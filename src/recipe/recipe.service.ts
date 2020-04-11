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
    const oldRecipe = await this.recipeModel.findOneAndDelete({ _id: idOfRecipeToDelete })
    const toHistory = new RecipeHistoryDto(oldRecipe)
    const recipeDeletedModel = new this.recipeDeletedModel(toHistory)
    return await recipeDeletedModel.save()
  }

  async addRecipeToFavorites(user: Account, addAsFavorite: AddRecipeFavoriteDto) {
    await this.accountService.setFavorite(user._id, addAsFavorite.recipeId, addAsFavorite.isNew)
    await this.accountService.setUpdatedTime(user._id)
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
      const recipes =  await this.recipeModel.find({ authorId: userId }).exec()
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