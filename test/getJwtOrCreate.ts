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

  return response.body.access_token
}