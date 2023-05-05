// import usersData, { Users } from './data';
import { randomUUID, UUID } from 'crypto';

export interface Users {
  id: UUID,
  username: string,
  age: number,
  hobbies: string[]
}

const users: Users[] = [
  {
    id: '5560298e-e80b-11ed-a05b-0242ac120003',
    username: 'renat',
    age: 40,
    hobbies: ['spanish']
  }
]

const getUsers = async (): Promise<unknown> => new Promise((resolve, _) => resolve(users))

const getUser = async (userId: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
  
    const user = users.find((user) => user.id === userId)
        
    if (user) resolve(user)
    reject({message: 'Not found!', code: 404})

  })
}

const createUser = async ({age ,hobbies, username}: Pick<Users, 'age' | "hobbies" | "username">): Promise<unknown> => new Promise((resolve, reject) => {

  const newUser: Users = {
    id: randomUUID(),
    age,
    hobbies,
    username,
  }

  resolve(users.concat([newUser]))

})


const updateUser = async ({id, age, hobbies, username }: Users): Promise<unknown> => new Promise((resolve, reject) => {


  if (users.find((user) => user.id === id)) {
    const userIdx = users.findIndex((user) => user.id === id)

    users.splice(userIdx, 1, {
      id,
      age,
      hobbies,
      username
    })

    resolve(users[userIdx])
  } 

  reject({message: 'Not Found!', code: 404})

})

export {getUsers, getUser, createUser, updateUser}