import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipeService } from './recipe.service'
import { RecipeController } from './recipe.controller'
import { RecipeSchema, RecipeHistorySchema } from '../schemas/recipe.schema'
import { AccountModule } from '../account/account.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }], 'stew'),
    MongooseModule.forFeature([{ name: 'Old-Recipe', schema: RecipeHistorySchema }], 'stew_history'),
    MongooseModule.forFeature([{ name: 'Removed-Recipe', schema: RecipeSchema }], 'stew_history'),
    AccountModule,
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
