import http, {IncomingMessage, ServerResponse} from 'http'

import { getUser, getUsers } from './controller'

//TODO 
/**
  * make separate env to store PORT
  **/
const PORT = process.env.PORT || 5555

const server = http.createServer(async (req, res) => {
  //GET api/users       get all persons
  if (req.url === '/api/users' && req.method === 'GET') {
    
    const users = await getUsers()
    
    res.writeHead(200, { "Content-Type": "application/json" })
    
    res.end(JSON.stringify(users))

  }

  //GET api/users/{userId}        unique user
  else if (req.url?.match(/\/api\/users\/\d/) && req.method === 'GET') {

    try {
      
      const userId = req.url.match(/\/(\d+)+[\/]?/)
      
      console.log(`index.ts - line: 29 ->> userId`, userId)

      

      if (userId) {

        const user = await getUser(Number(userId[1])) 
        
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