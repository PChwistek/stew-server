import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import { json } from 'body-parser'

const cloneBuffer = require('clone-buffer')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  process.env.NODE_ENV === 'development'
    ? app.enableCors({credentials: false})
    : app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny' ))
  app.use(json({
    verify: (req: any, res, buf, encoding) => {
      // important to store rawBody for Stripe signature verification
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
      	req.rawBody = cloneBuffer(buf)
      }
      return true
    },
  }))
  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log('Started on ' + port)
}
bootstrap()
