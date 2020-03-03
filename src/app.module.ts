import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { AccountModule } from './account/account.module'
import { ConfigModule } from './config/config.module'
import { RecipeModule } from './recipe/recipe.module'
import { ConfigService } from './config/config.service'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useFindAndModify: false,
        useNewUrlParser: true,
      }),
      connectionName: 'stew',
      inject: [ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('MONGODB_URI_HISTORY'),
      useFindAndModify: false,
      useNewUrlParser: true,
    }),
    connectionName: 'stew_history',
    inject: [ConfigService],
  }),
  AuthModule, AccountModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
