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
  app.use(morgan('dev'))

  await app.listen(3009)
  console.log('====== Listening at port 3009 ======')
}
bootstrap()
