import { myServer } from './server'

import { agent } from 'supertest'

const httpServer = myServer(6666)

const request = agent(httpServer)

describe('GET requests', () => {
  test('GET /api/users', async () => {

    const res = await request.get('/api/users')
  
    expect(res.body).toEqual([])
  })

  test('GET /api/users/{id}', async () => {
    
    const newUser = {
      username: 'pasha',
      age: 55,
      hobbies: ['aircraft']
    }
    
    const resPOST = await request.post('/api/users').send(newUser)

    const resGET = await request.get(`/api/users/${resPOST.body.id}`)

    expect(resGET.body).toEqual(resPOST.body)
  })

})

describe('POST requests', () => {
  
  test('POST /api/users create a new user', async () => {
    const res = await request.post('/api/users').send({
      username: 'ruslan',
      age: 38,
      hobbies: [ 'computers' ]
    })

    const newUser = res.body
    
    delete newUser.id

    expect(newUser).toEqual(
      {
        username: 'ruslan',
        age: 38,
        hobbies: [ 'computers' ]
      }
    )

  })
})

describe('PUT requests', () => {
  
  test('PUT /api/users/{id} change existing user record', async () => {
    const newUser = {
      username: 'renat',
      age: 40,
      hobbies: [ 'JavaScript' ]
    }

    const updatedUser = {
      username: 'renat',
      age: 40,
      hobbies: [ 'TypeScript' ]
    }
    
    const resPOST = await request.post('/api/users').send(newUser)

    const resPUT = await request.put(`/api/users/${resPOST.body.id}`).send(updatedUser)

    expect(resPUT.body).toEqual({...updatedUser, id: resPOST.body.id})

  })
})