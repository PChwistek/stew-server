import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AuthModule } from '../auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountModule } from './account.module'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { getJwt } from '../../test/getJwtOrCreate'

describe('Account Controller e2e', () => {
  let app: INestApplication
  let jwt = ''

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AccountModule, AuthModule,
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
        ],
    })
    .compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwt = await getJwt(app)
  })
  it(`add display name - /POST profile`, () => {
    return request(app.getHttpServer())
      .post('/account/profile')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        username: 'end-to-end',
      })
      .expect(201)
      .expect('end-to-end')
  })

  afterAll(async () => {
    await app.close()
  })

})