import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Recipe } from './recipe.interface'
import { RecipePayloadDto } from './recipe-payload.dto'
import { Account } from '../account/account.interface'
import { RecipeDto } from './recipe.dto'

@Injectable()
export class RecipeService {
  constructor(
  @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
  ) {}

  async createRecipe(user: Account, recipePayloadDto: RecipePayloadDto): Promise<Recipe> {
    const recipeDto = new RecipeDto(user.username, user._id, recipePayloadDto)
    const createdRecipe = new this.recipeModel(recipeDto)
    return await createdRecipe.save()
  }

  async getUserRecipes(  ) {
    return {}
  }

}