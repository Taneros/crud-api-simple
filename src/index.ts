import http, {IncomingMessage, ServerResponse} from 'http'

import { getUser, getUsers } from './controller'

import { validate } from 'uuid';


interface ErrorMessage {
  message: string,
  code: number
}

//TODO 
/**
  * make separate env to store PORT
  **/
const PORT = process.env.PORT || 5555

const server = http.createServer(async (req, res) => {
  // const matchPathWithUserId = req.url?.match(/\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/)
  const matchPathWithUserId = req.url?.match(/^\/api\/users\/(.*)$/)

  //GET api/users       get all persons
  if (req.url === '/api/users' && req.method === 'GET') {
    
    const users = await getUsers()
    
    res.writeHead(200, { "Content-Type": "application/json" })
    
    res.end(JSON.stringify(users))
  }
  
  //GET api/users/{userId}        unique user
  else if (matchPathWithUserId && req.method === 'GET') {

    const userId = matchPathWithUserId[1]
    
    try {

      if(!validate(userId)) throw {message: "Invalid uuid!", code: 400};
      
      if (userId) {

        const user = await getUser(userId) 
        
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(user))

      }

    } catch (error: unknown) {

      const typedError = error as ErrorMessage
      
      res.writeHead(typedError.code, { "Content-Type": "application/json" })
      res.end(JSON.stringify({message: typedError.message}))
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