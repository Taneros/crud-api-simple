import { myServer } from './server'

import { agent } from 'supertest'

const httpServer = myServer(6666)

const request = agent(httpServer)

describe('GET requests', () => {
  test('GET /api/users   get all users', async () => {

    const res = await request.get('/api/users')
  
    expect(res.body).toEqual([])
  })

  test('GET /api/users/{id}  get a specific user', async () => {
    
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

describe('POST request', () => {
  
  test('POST /api/users create a new user', async () => {
    const newUser = {
      username: 'ruslan',
      age: 38,
      hobbies: [ 'computers' ]
    }
    
    const resPOST = await request.post('/api/users').send(newUser)

    expect(resPOST.statusCode).toBe(201)

    const respNewUser = resPOST.body
    
    delete respNewUser.id

    expect(respNewUser).toEqual(newUser)

  })
})

describe('PUT request', () => {
  
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


describe('DELETE request', () => {
  
  test('DELETE /api/users/{id} delete existing user record', async () => {
    const newUser = {
      username: 'renat',
      age: 40,
      hobbies: [ 'JavaScript' ]
    }
    
    const resPOST = await request.post('/api/users').send(newUser)
    
    expect(resPOST.statusCode).toBe(201)
    
    const resDELETE = await request.delete(`/api/users/${resPOST.body.id}`)

    expect(resDELETE.statusCode).toBe(204)

    const resGET = await request.get(`/api/users/${resPOST.body.id}`)

    expect(resGET.body).toEqual({ message: 'Not found!' })

  })
})