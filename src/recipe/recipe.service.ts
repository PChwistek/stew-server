import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Recipe } from './recipe.interface'
import { RecipePayloadDto } from './recipe-payload.dto'
import { Account } from '../account/account.interface'
import { RecipeDto } from './recipe.dto'
import { AccountService } from '../account/account.service'
import { EditRecipePayloadDto } from './edit-recipe-payload.dto'

@Injectable()
export class RecipeService {
  constructor(
  @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
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
    return await this.recipeModel.findOneAndUpdate({ _id }, { ...editRecipePayloadDto, $inc: {__v: 1}}, {
      returnOriginal: false,
    })
  }

  async getRecipesByAuthorId(_id: string) {
    return await this.recipeModel.find({ authorId: _id }).exec()
  }

}