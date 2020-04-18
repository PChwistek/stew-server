import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { Recipe, RecipeHistory } from './recipe.interface'

import { RecipePayloadDto } from './Payloads/recipe-payload.dto'
import { Account } from '../account/account.interface'
import { RecipeDto } from './recipe.dto'
import { AccountService } from '../account/account.service'
import { EditRecipePayloadDto } from './Payloads/edit-recipe-payload.dto'
import { AddRecipeFavoriteDto } from './Payloads/add-recipe-favorite-payload.dto'
import { RecipeByLinkDto } from './Payloads/recipe-by-link.payload.dto'
import { RecipeHistoryDto } from './recipe-history.dto'

@Injectable()
export class RecipeService {
  constructor(
  @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
  @InjectModel('Old-Recipe') private readonly recipeHistoryModel: Model<RecipeHistory>,
  @InjectModel('Removed-Recipe') private readonly recipeDeletedModel: Model<Recipe>,
  private readonly accountService: AccountService,
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
    const theRecipe = this.recipeModel.find({ _id: editRecipePayloadDto._id })
    const { shareableId } = theRecipe
    if (theRecipe.authorId !== user._id) {
      const { name, tags, attributes, config, permissions } = editRecipePayloadDto
      return await this.createRecipe(user, new RecipePayloadDto(name, tags, attributes, config, permissions, shareableId))
    }

    const oldRecipe = await this.recipeModel.findOneAndUpdate({ _id }, {
        ...editRecipePayloadDto,
        dateModified: new Date(),
        $inc: { __v: 1 },
    })
    const toHistory = new RecipeHistoryDto(oldRecipe)
    const savedOldRecipe = new this.recipeHistoryModel(toHistory)
    savedOldRecipe.save()
    return await this.recipeModel.findOne({ _id })
  }

  async deleteRecipe(user: Account, idOfRecipeToDelete: string): Promise<Recipe> {

    const theRecipe = await this.recipeModel.findOne({ _id: idOfRecipeToDelete})

    if (theRecipe.authorId !== user._id) {
      this.accountService.setImported(user._id, theRecipe.shareableId, false)
      return theRecipe
    }

    const oldRecipe = await this.recipeModel.findOneAndDelete({ _id: idOfRecipeToDelete })
    const toHistory = new RecipeHistoryDto(oldRecipe)
    const recipeDeletedModel = new this.recipeDeletedModel(toHistory)
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

  async getRecipeByShareId(id: string) {
    return await this.recipeModel.find({ shareableId: id }).exec()
  }

  async getRecipesByAuthorId(_id: string) {
    return await this.recipeModel.find({ authorId: _id }).exec()
  }

  async syncRecipes(userId: string, updated: Date, forced: boolean) {
    const theUser = await this.accountService.findOneById(userId)
    if (new Date(theUser.lastUpdated) > new Date(updated) || forced) {
      let recipes =  await this.recipeModel.find({ authorId: userId }).exec()

      for (const shareId of theUser.importedRecipes) {
        const foundRecipe = await this.recipeModel.findOne({ shareableId: shareId })
        recipes = recipes.concat(foundRecipe)
      }

      return {
        upToDate: false,
        lastUpdated: theUser.lastUpdated,
        recipes,
        favoriteRecipes: theUser.favoriteRecipes,
      }
    }
    return { upToDate: true, lastUpdated: theUser.lastUpdated, recipes: [] }
  }

}