
import { Controller, Request, Post, UseGuards, Body, Param, Get, Patch, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RecipeService } from './recipe.service'
import { RecipePayloadDto } from './Payloads/recipe-payload.dto'
import { EditRecipePayloadDto } from './Payloads/edit-recipe-payload.dto'
import { DeleteRecipePayloadDto } from './Payloads/delete-recipe-payload.dto'
import { SyncRecipePayloadDto } from './Payloads/sync-recipe-payload.dto'
import { RecipeByLinkDto } from './Payloads/recipe-by-link.payload.dto'
import { Recipe } from './recipe.interface'
import { AddRecipeFavoriteDto } from './Payloads/add-recipe-favorite-payload.dto'
import { RecipePermissionsPayload } from './Payloads/recipe-permissions-payload.dto'

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
  @Post('/favorite')
  async addAsFavorite(@Request() req, @Body() addAsFavorite: AddRecipeFavoriteDto) {
    const { user } = req
    return await this.recipeService.addRecipeToFavorites(user, addAsFavorite)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/share/:id')
  async getRecipeByShareId(@Request() req, @Param() params) {
    // check if already imported or is owned by
    const { user } = req
    const recipe = await this.recipeService.getRecipeByShareId(params.id)
    console.log('recipe', recipe)
    if (!recipe || recipe.length < 1) {
      return new NotFoundException()
    }

    const isAuthor = recipe[0].authorId === `${user._id}`

    const allowed =
      recipe[0].linkPermissions.findIndex(item => item === 'any') > -1
      || isAuthor
      // add org

    if (!allowed) {
      return new ForbiddenException('You don\t have access to this recipe.')
    }

    const alreadyInLibrary = isAuthor || user.importedRecipes.findIndex(shareId => params.id === shareId) > -1
    return {
      recipe,
      alreadyInLibrary,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/share/import')
  async addRecipeToLibrary(@Request() req, @Body() recipeByLink: RecipeByLinkDto) {
    const { user } = req
    return await this.recipeService.addRecipeToImports(user, recipeByLink)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete')
  async deleteRecipeById(@Request() req, @Body() deleteRecipePayloadDto: DeleteRecipePayloadDto): Promise<Recipe> {
    const { user } = req
    return await this.recipeService.deleteRecipe(user, deleteRecipePayloadDto._id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/permissions')
  async editRecipePermissions(@Request() req, @Body() recipePermissionsDto: RecipePermissionsPayload) {
    const { user } = req
    return await this.recipeService.editRecipePermissions(user, recipePermissionsDto)
  }
}