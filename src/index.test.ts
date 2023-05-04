import {jest} from '@jest/globals'
// import server from './index'

import supertest, { agent } from 'supertest'

const url = 'http://localhost:5555'

console.log(`index.test.ts - line: 8 ->> url`, url)

const requestSuper = supertest(url)

// jest.unstable_mockModule('node:child_process', () => ({
//   execSync: jest.fn(),
// }));

// describe('util', function () {
//   // it('loads JSON  files', async function () {
//   //   // import the module being tested, which uses the mocked resource
//   //   // const {loadJson} = await import( './index.ts' );
    
//   //   // const data = loadJson( 'foo.json' );
    
//   //   // expect(data).toEqual({ items: ['one', 'two', 'three'] });



//   //   expect(true).toBe(true)
//   // });


//   test('send request', async () => {
    
//     return request.get('api/users').expect(200).expect((response) => {
//       console.log(`index.test.ts - line: 31 ->> response`, response)
//     })

//   })
// });


test('send request', async () => {
    console.log(`index.test.ts - line: 42 ->> url`, url)
  return requestSuper.get('api/users').expect(200).expect((response) => {
    console.log(`index.test.ts - line: 31 ->> response`, response)
  })

})


// import { myServer } from 'index'

// const httpServer = myServer()

// const request = agent(httpServer)

// test('sdsf', async () => {

//   const res = await request.get()

// })