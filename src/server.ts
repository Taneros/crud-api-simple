
import dotenv from 'dotenv'
import http, { IncomingMessage, ServerResponse } from 'http'
import { createUser, getUser, getUsers } from './controller'
import { validate } from 'uuid';
import { Users } from 'data';

dotenv.config()

interface ErrorMessage {
  message: string,
  code: number
}

//TODO 
/**
  * make separate env to store PORT
  **/
// const PORT = process.env.PORT || 7777

const server = http.createServer(async (req, res) => {
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
    
  else if (req.url === '/api/users' && req.method === 'POST') {
    console.log(`index.ts - line: 62 ->> `,)
    
    let body = ''
    let user: Pick<Users, 'age' | 'hobbies' | 'username'> | null = null   

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      console.log(`index.ts - line: 71 ->> BODY`, JSON.parse(body))
      user = JSON.parse(body)

      try {

        console.log(`index.ts - line: 79 ->> TRY CATCH`, )
  
        // check data and throw error if body is not of the required format
        if (!user) throw { message: "Invalid JSON in POST body!", code: 400 };
  
        const newUser = await createUser(user)
  
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(newUser))
        
      } catch (error) {
  
        const typedError = error as ErrorMessage
  
        res.writeHead(typedError.code, { "Content-Type": "application/json" })
        res.end(JSON.stringify({message: typedError.message}))
      }
    })
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({message: "Route not found!"}))
  }

})



const myServer = (PORT: number) => server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})


export { myServer }