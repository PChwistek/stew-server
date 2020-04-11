import * as request from 'supertest'

export async function getJwt(app) {

  let response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: 'end-to-end@gmail.com',
      password: '123456',
    })

  if (response.body.access_token) return response.body.access_token

  response = await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      email: 'end-to-end@gmail.com',
      password: '123456',
    })

  await request(app.getHttpServer())
    .post('/auth/register')
    .set('Authorization', `Bearer ${response.body.access_token}`)
    .send({
      username: 'end-to-end',
    })

  return response.body.access_token
}