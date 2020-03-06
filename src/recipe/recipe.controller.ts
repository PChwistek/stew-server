
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RecipeService } from './recipe.service'
import { RecipePayloadDto } from './Payloads/recipe-payload.dto'
import { EditRecipePayloadDto } from './Payloads/edit-recipe-payload.dto'
import { DeleteRecipePayloadDto } from './Payloads/delete-recipe-payload.dto'
import { SyncRecipePayloadDto } from './sync-recipe-payload.dto'
import { Recipe } from './recipe.interface'

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

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  async editRecipe(@Request() req, @Body() editRecipePayloadDto: EditRecipePayloadDto): Promise<Recipe> {
    const { user } = req
    return await this.recipeService.editRecipe(user, editRecipePayloadDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/byAuthor')
  async getRecipesByAuthor(@Request() req): Promise<Array<Recipe>> {
    const { user } = req
    const recipes = await this.recipeService.getRecipesByAuthorId(user._id)
    return recipes
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sync')
  async syncRecipes(@Request() req, @Body() syncRecipePayloadDto: SyncRecipePayloadDto) {
    const { user } = req
    return await this.recipeService.syncRecipes(user._id, syncRecipePayloadDto.lastUpdated, syncRecipePayloadDto.isForced)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete')
  async deleteRecipeById(@Request() req, @Body() deleteRecipePayloadDto: DeleteRecipePayloadDto): Promise<Recipe> {
    const { user } = req
    return await this.recipeService.deleteRecipe(user, deleteRecipePayloadDto._id)
  }

}