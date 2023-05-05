import { myServer } from './server'

import { agent } from 'supertest'

const httpServer = myServer(6666)

const request = agent(httpServer)

describe('GET requests', () => {
  test('GET /api/users', async () => {

    const res = await request.get('/api/users')
  
    console.log(`index.test.ts - line: 61 ->> res`, res.body)
  
    expect(res.body).toEqual([
      {
        id: '5560298e-e80b-11ed-a05b-0242ac120003',
        username: 'renat',
        age: 40,
        hobbies: [ 'spanish' ]
      }
    ])
  
  })
})

describe('POST requests', () => {
  
  test('POST new user', async () => {
    const res = await request.post('/api/users').send({
      username: 'ruslan',
      age: 38,
      hobbies: [ 'computers' ]
    })


    console.log(`index.test.ts - line: 38 ->> BODY`, Array.isArray(res.body))

    // const parsed = JSON.parse(res.body)

 
    // check id is uuid
    //check everything else is as in post 

    // expect(res.body.slice(-1)).toEqual([
    //   {
    //     username: 'ruslan',
    //     age: 38,
    //     hobbies: [ 'computers' ]
    //   }
    // ])



  })
})