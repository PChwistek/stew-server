import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { AccountModule } from './account/account.module'
import { ConfigModule } from './config/config.module'
import { RecipeModule } from './recipe/recipe.module'
import { OrgModule } from './org/org.module'
import { ConfigService } from './config/config.service'
import { EmailGatewayModule } from './emailgateway/emailgateway.module'
import { RecordKeeperModule } from './recordkeeper/recordkeeper.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      connectionName: 'stew',
      inject: [ConfigService],
  }),
  AuthModule, AccountModule, RecipeModule, OrgModule,
  EmailGatewayModule, RecordKeeperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
