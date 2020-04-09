import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AuthModule } from '../auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountModule } from '../account/account.module'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'

describe('Auth Controller e2e', () => {
  let app: INestApplication
  let jwt = ''
  const generatedEmail = `${Math.floor((Math.random() * 10000) + 1)}end-to-end@gmail.com`

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
  })

  it(`can register - /auth/register POST`, () => {

    function hasKeys(res) {
      if (!('access_token' in res.body)) throw new Error('missing access_token key')
      if (!('lastUpdated' in res.body)) throw new Error('missing lastUpdated key')
      if (!('username' in res.body)) throw new Error('missing username key')
    }

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: generatedEmail,
        password: '1234567',
      })
      .expect(hasKeys)
  })

  it(`can login - /auth/login POST`, async () => {

    function hasKeys(res) {
      if (!('access_token' in res.body)) throw new Error('missing access_token key')
      if (!('lastUpdated' in res.body)) throw new Error('missing lastUpdated key')
      if (!('username' in res.body)) throw new Error('missing username key')
    }

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: generatedEmail,
        password: '1234567',
      })
      .expect(201)

    expect(hasKeys(response))
    jwt = response.body.access_token
  })

  it(`can validate token - /auth/validate GET`, () => {
    return request(app.getHttpServer())
      .get('/auth/validate')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('true')
  })

  it(`can get profile - /auth/profile GET`, () => {
    function hasKeys(res) {
      if (!('username' in res.body)) throw new Error('missing username key')
    }
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(hasKeys)
  })

  afterAll(async () => {
    await app.close()
  })

})