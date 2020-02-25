
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RecipeService } from './recipe.service'
import { RecipePayloadDto } from './recipe-payload.dto'
import { Recipe } from './recipe.interface'
import { request } from 'http'

@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createRecipe(@Request() req, @Body() recipePayloadDto: RecipePayloadDto): Promise<Recipe> {
    const { user } = req
    const theRecipe = await this.recipeService.createRecipe(user, recipePayloadDto)
    return theRecipe
  }

}