import http, {IncomingMessage, ServerResponse} from 'http'

import { getUser, getUsers } from './controller'

import { validate } from 'uuid';

//TODO 
/**
  * make separate env to store PORT
  **/
const PORT = process.env.PORT || 5555

const server = http.createServer(async (req, res) => {
  const matchPathUserId = req.url?.match(/\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/)

  //GET api/users       get all persons
  if (req.url === '/api/users' && req.method === 'GET') {
    
    const users = await getUsers()
    
    res.writeHead(200, { "Content-Type": "application/json" })
    
    res.end(JSON.stringify(users))

  }

  

  //GET api/users/{userId}        unique user
  else if (matchPathUserId && req.method === 'GET') {

    // console.log(`index.ts - line: 28 ->> req.url?.match(/\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/`, req.url?.match(/\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/))
    // console.log(`index.ts - line: 28 ->> URL`, req.url.split('/'))

    // console.log(`index.ts - line: 28 ->> req.url?.match(/\/api\/users\/*/`, req.url?.match(/\/users\/*/))

    // const uuidRegex = new RegExp(/\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i)

    // const userIdFromUrl = req.url.match(uuidRegex)

    // console.log(`index.ts - line: 30 ->> userIdFromUrl`, userIdFromUrl)

    const userIdFromReq = req.url?.split('/')[3]

    try {
      
      // const userId = req.url.match(/\/(\d+)+[\/]?/)
      
      console.log(`index.ts - line: 29 ->> userId`, userIdFromReq)

      

      if (userIdFromReq) {

        const user = await getUser(userIdFromReq) 
        
        console.log(`index.ts - line: 36 ->> get user`, user)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(user))

      }

    } catch (error) {
      
      res.writeHead(404, { "Content-Type": "application/json" })
      res.end(JSON.stringify({message: error}))
    }
    
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({message: "Route not found!"}))
  }

  
})

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})