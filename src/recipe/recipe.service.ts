import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { diff } from 'json-diff'
import { Recipe, RecipeHistory } from './recipe.interface'
import { RecipeDiff } from './recipe-diff.interface'
import { RecipePayloadDto } from './Payloads/recipe-payload.dto'
import { Account } from '../account/account.interface'
import { RecipeDto } from './recipe.dto'
import { AccountService } from '../account/account.service'
import { EditRecipePayloadDto } from './Payloads/edit-recipe-payload.dto'
import { AddRecipeFavoriteDto } from './Payloads/add-recipe-favorite-payload.dto'
import { RecipeByLinkDto } from './Payloads/recipe-by-link.payload.dto'
import { ArchiveRecipeDto } from './archive-recipe.dto'
import { RecipePermissionsPayload } from './Payloads/recipe-permissions-payload.dto'
import { RecipeDiffDto } from './recipe-diff.dto'
import { OrgService } from '../org/org.service'

@Injectable()
export class RecipeService {
  constructor(
  @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
  @InjectModel('Recipe-Diff') private readonly recipeDiffModel: Model<RecipeDiff>,
  @InjectModel('Archived-Recipe') private readonly recipeArchiveModel: Model<RecipeHistory>,
  private readonly accountService: AccountService,
  private readonly orgService: OrgService,
  ) {}

  async createRecipe(user: Account, recipePayloadDto: RecipePayloadDto): Promise<Recipe> {
    const recipeDto = new RecipeDto(user.username, user._id, recipePayloadDto)
    const createdRecipe = new this.recipeModel(recipeDto)
    await this.accountService.setUpdatedTime(user._id)
    return await createdRecipe.save()
  }

  async editRecipe(user: Account, editRecipePayloadDto: EditRecipePayloadDto): Promise<Recipe> {
    await this.accountService.setUpdatedTime(user._id)
    const _id = editRecipePayloadDto._id
    const theRecipe = await this.recipeModel.findOne({ _id: editRecipePayloadDto._id })
    const { shareableId, authorId } = theRecipe

    const isFork = authorId !== `${user._id}`
    if (isFork) {
      const { name, tags, attributes, config, linkPermissions } = editRecipePayloadDto
      return await this.createRecipe(user, new RecipePayloadDto(name, tags, attributes, config, linkPermissions, shareableId))
    }

    const oldRecipe = await this.recipeModel.findOneAndUpdate({ _id }, {
        ...editRecipePayloadDto,
        dateModified: new Date(),
        $inc: { __v: 1 },
    })

    const newRecipe = await this.recipeModel.findOne({ _id })

    const theDiff = diff(oldRecipe, newRecipe)
    const toHistory = new RecipeDiffDto(oldRecipe._id, new Date(), theDiff)
    const savedDiff = new this.recipeDiffModel(toHistory)
    savedDiff.save()
    return newRecipe
  }

  async deleteRecipe(user: Account, idOfRecipeToDelete: string): Promise<Recipe> {

    const theRecipe = await this.recipeModel.findOne({ _id: idOfRecipeToDelete})
    const isDeleteByForker = theRecipe.authorId !== `${user._id}`
    if (isDeleteByForker) {
      this.accountService.setImported(user._id, theRecipe.shareableId, false)
      return theRecipe
    }

    const oldRecipe = await this.recipeModel.findOneAndDelete({ _id: idOfRecipeToDelete })
    const toHistory = new ArchiveRecipeDto(oldRecipe)
    const recipeDeletedModel = new this.recipeArchiveModel(toHistory)
    return await recipeDeletedModel.save()
  }

  async addRecipeToFavorites(user: Account, addAsFavorite: AddRecipeFavoriteDto) {
    await this.accountService.setFavorite(user._id, addAsFavorite.recipeId, addAsFavorite.isNew)
    await this.accountService.setUpdatedTime(user._id)
  }

  async addRecipeToImports(user: Account, addAsImport: RecipeByLinkDto) {

    const theRecipe = await this.recipeModel.findOne({ shareableId: addAsImport.recipeId })

    if (theRecipe) {
      await this.accountService.setImported(user._id, addAsImport.recipeId, addAsImport.adding)
      await this.accountService.setUpdatedTime(user._id)
    } else {
      throw new BadRequestException()
    }
  }

  async editRecipePermissions(user: Account, editRecipePermissions: RecipePermissionsPayload): Promise<any> {
    const { _id } = editRecipePermissions
    const theRecipe = await this.recipeModel.findOne({ _id })
    if (String(user._id) === theRecipe.authorId) {
      const newRecipe = await this.recipeModel.findOneAndUpdate({ _id }, {
        linkPermissions: editRecipePermissions.linkPermissions,
        repos: editRecipePermissions.repos,
        $inc: { __v: 1 },
      }, { new: true })
      // add to repo
      const theDiff = diff(theRecipe, newRecipe)
      const toHistory = new RecipeDiffDto(theRecipe._id, new Date(), theDiff)
      const savedDiff = new this.recipeDiffModel(toHistory)
      savedDiff.save()
      return newRecipe

    } else {
      throw new BadRequestException('Recipe not created by this user')
    }

  }

  async getRecipeByShareId(id: string) {
    return await this.recipeModel.find({ shareableId: id }).exec()
  }

  async getRecipesByAuthorId(_id: string) {
    return await this.recipeModel.find({ authorId: _id }).exec()
  }

  async syncRecipes(userId: string, updated: Date, forced: boolean) {
    const theUser = await this.accountService.findOneById(userId)

    let repos = []
    if (theUser.orgs.length > 0) {
      const foundRepos = await this.orgService.getRepos(theUser.orgs[0])
      repos = foundRepos.filter(repo => repo.permittedUsers.findIndex(id => `${id}` === `${userId}`) > -1)
    }

    if (new Date(theUser.lastUpdated) > new Date(updated) || forced) {
      let recipes =  await this.recipeModel.find({ authorId: userId }).exec()

      for (const shareId of theUser.importedRecipes) {
        const foundRecipe = await this.recipeModel.findOne({ shareableId: shareId })
        recipes = recipes.concat(foundRecipe)
      }

      // add repo recipes

      return {
        upToDate: false,
        lastUpdated: theUser.lastUpdated,
        recipes,
        favoriteRecipes: theUser.favoriteRecipes,
        repos,
      }
    }
    return { upToDate: true, lastUpdated: theUser.lastUpdated, recipes: [], repos, favoriteRecipes: theUser.favoriteRecipes }
  }

}