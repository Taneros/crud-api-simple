import usersData, { Users } from './data';
import { randomUUID } from 'crypto';

const getUsers = async (): Promise<unknown> => new Promise((resolve, _) => resolve(usersData))

const getUser = async (userId: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
  
    const user = usersData.find((user) => user.id === userId)
    
    console.log(`controller.ts - line: 10 ->> user`, user)
    
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

  resolve(usersData.concat(newUser))

})

export {getUsers, getUser, createUser}