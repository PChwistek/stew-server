import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { RecipeModule } from './recipe.module'
import { AuthModule } from '../auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { getJwt } from '../../test/getJwtOrCreate'

const theRecipe = {
    name: 'e2etest_recipe',
    tags: [],
    titles: ['Extensions'],
    attributes: [],
    config: [{
      tabs: [{
        favIconUrl: '',
        url: 'chrome://extensions/',
        title: 'Extensions',
        index: 0,
      }],
    }],
    repos: [],
    linkPermissions: ['any'],
}

describe('Recipe Controller e2e', () => {
  let app: INestApplication
  let jwt = ''
  let recipeId = ''
  let shareId = ''

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, RecipeModule,
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

  it(`can create - /recipe/create POST`, async () => {

    function hasKeys(res) {
      if (!('_id' in res.body)) throw new Error('missing _id key')
      if (!('__v' in res.body)) throw new Error('missing __v key')
      if (!('author' in res.body)) throw new Error('missing author key')
      if (!('authorId' in res.body)) throw new Error('missing authorId key')
      if (!('dateCreated' in res.body)) throw new Error('missing dateCreated key')
      if (!('dateModified' in res.body)) throw new Error('missing dateModified key')
      if (!('name' in res.body)) throw new Error('missing name key')
      // if (!('titles' in res.body)) throw new Error('missing titles key')
      if (!('attributes' in res.body)) throw new Error('missing titles key')
      if (!('config' in res.body)) throw new Error('missing titles key')
    }

    const response = await request(app.getHttpServer())
        .post('/recipe/create')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...theRecipe,
        })

    expect(hasKeys(response))
    recipeId = response.body._id
    shareId = response.body.shareableId
  })

  it(`can edit - /recipe/edit PATCH`, () => {
    function hasKeys(res) {
      if (!('_id' in res.body)) throw new Error('missing _id key')
      if (!('__v' in res.body)) throw new Error('missing __v key')
      if (!('author' in res.body)) throw new Error('missing author key')
      if (!('authorId' in res.body)) throw new Error('missing authorId key')
      if (!('dateCreated' in res.body)) throw new Error('missing dateCreated key')
      if (!('dateModified' in res.body)) throw new Error('missing dateModified key')
      if (!('name' in res.body)) throw new Error('missing name key')
      // if (!('titles' in res.body)) throw new Error('missing titles key')
      if (!('attributes' in res.body)) throw new Error('missing titles key')
      if (!('config' in res.body)) throw new Error('missing titles key')
    }

    return request(app.getHttpServer())
      .patch('/recipe/edit')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        ...theRecipe,
        _id: recipeId,
        name: 'e2etest_edited_recipe',
      })
      .expect(hasKeys)
  })

  // it('can edit a link-shared recipe permissions - ', async () => {
  //     const response = await request(app.getHttpServer())
  //     .patch(`/recipe/permissions/)
  //     .expect(401)
  // })

  it('can fetch a link-shared recipe - recipe/share/:id', async () => {
    function hasKeys(res) {
      if (!('_id' in res.body[0])) throw new Error('missing _id key')
      if (!('__v' in res.body[0])) throw new Error('missing __v key')
      if (!('author' in res.body[0])) throw new Error('missing author key')
      if (!('authorId' in res.body[0])) throw new Error('missing authorId key')
      if (!('dateCreated' in res.body[0])) throw new Error('missing dateCreated key')
      if (!('dateModified' in res.body[0])) throw new Error('missing dateModified key')
      if (!('name' in res.body[0])) throw new Error('missing name key')
      // if (!('titles' in res.body)) throw new Error('missing titles key')
      if (!('attributes' in res.body[0])) throw new Error('missing titles key')
      if (!('config' in res.body[0])) throw new Error('missing titles key')
    }
    const response = await request(app.getHttpServer())
      .get(`/recipe/share/${shareId}`)
      .expect(401)
    // expect(hasKeys(response))
})

  it(`can get all created recipes by author - /recipe/byAuthor GET`, async () => {

    const response = await request(app.getHttpServer())
      .get('/recipe/byAuthor')
      .set('Authorization', `Bearer ${jwt}`)

    expect(response.body.length > 0)
  })

  it('can sync recipes w/ ext - recipe/sync POST', () => {
    function hasKeys(res) {
      if (!('upToDate' in res.body)) throw new Error('missing upToDate key')
      if (!('lastUpdated' in res.body)) throw new Error('missing lastUpdated key')
      if (!('recipes' in res.body)) throw new Error('missing recipes key')
      if (!('favorites' in res.body)) throw new Error('missing favorites key')
    }
    return request(app.getHttpServer())
      .post('/recipe/sync')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        isForced: true,
        lastUpdated: new Date(),
      })
      .expect(hasKeys)
  })

  it('can add favorite recipes - recipe/favorite POST', async () => {

      await request(app.getHttpServer())
        .post('/recipe/favorite')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          isNew: true,
          recipeId,
        })
        .expect(201)

      function hasRecipeId(res) {
        const { favorites } = res.body
        expect(favorites.findIndex(id => recipeId === id) > -1)
      }

      return request(app.getHttpServer())
        .post('/recipe/sync')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          isForced: true,
          lastUpdated: new Date(),
        })
        .expect(hasRecipeId)
  })

  it('can delete a recipe - recipe/delete POST', async () => {
    await request(app.getHttpServer())
      .post('/recipe/delete')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        _id: recipeId,
      })
      .expect(201)

    function hasRecipeId(res) {
        const { favorites } = res.body
        expect(favorites.findIndex((id: string) => recipeId === id) === -1)
      }

    return request(app.getHttpServer())
        .post('/recipe/sync')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          isForced: true,
          lastUpdated: new Date(),
        })
        .expect(hasRecipeId)
  })

  it('does not return a deleted recipe - recipe/share/:id', async () => {

    function isEmpty(res) {
      expect(res.body === [])
    }

    return request(app.getHttpServer())
      .get(`/recipe/share/${shareId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(isEmpty)
  })

  afterAll(async () => {
    await app.close()
  })

})