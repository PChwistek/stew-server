import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipeService } from './recipe.service'
import { RecipeController } from './recipe.controller'
import { RecipeSchema, RecipeHistorySchema, RecipeDiffSchema } from '../schemas/recipe.schema'
import { AccountModule } from '../account/account.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }], 'stew'),
    MongooseModule.forFeature([{ name: 'Recipe-Diff', schema: RecipeDiffSchema }], 'stew'),
    MongooseModule.forFeature([{ name: 'Archived-Recipe', schema: RecipeHistorySchema }], 'stew'),
    AccountModule,
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
