import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny' ))
  await app.listen(process.env.NODE_ENV === 'development' ? 3009 : 8081)
}
bootstrap()
