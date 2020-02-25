import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipeService } from './recipe.service'
import { RecipeController } from './recipe.controller'
import { RecipeSchema } from '../schemas/recipe.schema'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]), AuthModule],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
