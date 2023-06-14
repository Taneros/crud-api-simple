
import http, { IncomingMessage, OutgoingMessage, ServerResponse } from 'http'
import { createUser, deleteUser, getUser, getUsers, updateUser, Users } from './clusterController'
import { validate } from 'uuid';
import { UUID } from 'node:crypto';


interface Server extends http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
  usersData: Users[]
}

interface ErrorMessage {
  message: string,
  code: number
}

const server = http.createServer(async (req, res) => {
  const matchPathWithUserId = req.url?.match(/^\/api\/users\/(.*)$/)

  //GET api/users       get all users
  if (req.url === '/api/users' && req.method === 'GET') {

    const users = await getUsers()

    res.writeHead(200, { "Content-Type": "application/json", "ProcesPID": `${process.pid}` })

    res.end(JSON.stringify(users))
  }

  //GET /api/users/{UUID}  get a unique user
  else if (matchPathWithUserId && req.method === 'GET') {

    const userId = matchPathWithUserId[1]

    try {

      if (!validate(userId)) throw { message: "Invalid uuid!", code: 400 };

      if (userId) {

        const user = await getUser(userId)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(user))

      }

    } catch (error: unknown) {

      const typedError = error as ErrorMessage

      res.writeHead(typedError.code, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: typedError.message }))
    }

  }

  //POST api/users        create a new user
  else if (req.url === '/api/users' && req.method === 'POST') {
    console.log(`index.ts - line: 62 ->> POST`,)

    let body = ''
    let user: Pick<Users, 'age' | 'hobbies' | 'username'> | null = null

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      console.log(`index.ts - line: 71 ->> BODY`, JSON.parse(body))
      user = JSON.parse(body)

      try {

        if (!user) throw { message: "Invalid JSON in POST body!", code: 400 };

        const newUser = await createUser(user)

        res.writeHead(201, { "Content-Type": "application/json" })
        res.end(JSON.stringify(newUser))

      } catch (error) {

        const typedError = error as ErrorMessage

        res.writeHead(typedError.code, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: typedError.message }))
      }
    })
  }
    
  // PUT /api/users/{UUID}
  else if (matchPathWithUserId && req.method === 'PUT') {
    console.log(`server.ts - line: 99 ->> PUT`,)

    const userId = matchPathWithUserId[1] as UUID

    let body = ''
    let user: Pick<Users, 'age' | 'hobbies' | 'username'> | null = null

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      console.log(`index.ts - line: 71 ->> BODY`, JSON.parse(body))
      user = JSON.parse(body)

      try {

        if (!validate(userId)) throw { message: "Invalid uuid!", code: 400 };

        if (userId && user) {

          const updatedUser = await updateUser({ id: userId, ...user })

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(updatedUser))

        }

      } catch (error: unknown) {

        const typedError = error as ErrorMessage

        res.writeHead(typedError.code, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: typedError.message }))
      }
    })
  }

  else if (matchPathWithUserId && req.method === 'DELETE') {
    console.log(`server.ts - line: 99 ->> DELETE`,)

    const userId = matchPathWithUserId[1] as UUID

    try {

      if (!validate(userId)) throw { message: "Invalid uuid!", code: 400 };

      if (userId) {

        await deleteUser({ id: userId })

        res.writeHead(204, { "Content-Type": "application/json" })
        res.end("")
      }

    } catch (error: unknown) {

      const typedError = error as ErrorMessage

      res.writeHead(typedError.code, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: typedError.message }))
    }
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found!" }))
  }

}) as unknown as Server

server.usersData = []

const myServer = (PORT: number) => {
  server.listen(PORT, () => { console.log(`\nServer started on port: ${PORT}\n`) })

  return server
}

const getServerInstance = () => server

export { myServer, getServerInstance }