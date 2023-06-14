import { randomUUID, UUID } from 'crypto';
// import { getServerInstance } from './server';
import { getServerInstance } from './clusterServer';

export interface Users {
  id: UUID,
  username: string,
  age: number,
  hobbies: string[]
}

const getUsers = async (): Promise<unknown> => new Promise((resolve, _) => {
  console.log(`clusterController.ts - line: 13 ->> process.env.DB`, process.env.DB)
  resolve([])
})

const getUser = async (userId: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
  
    const user = getServerInstance().usersData.find((user) => user.id === userId)
        
    if (user) resolve(user)
    reject({message: 'Not found!', code: 404})

  })
}

const createUser = async ({age ,hobbies, username}: Pick<Users, 'age' | "hobbies" | "username">): Promise<unknown> => new Promise((resolve, reject) => {

  console.log(`clusterController.ts - line: 13 ->> process.env.DB`, process.env.DB)

  const newUser: Users = {
    id: randomUUID(),
    age,
    hobbies,
    username,
  }

  getServerInstance().usersData = [...getServerInstance().usersData, newUser]

  resolve(newUser)

})


const updateUser = async ({id, age, hobbies, username }: Users): Promise<unknown> => new Promise((resolve, reject) => {

  if (getServerInstance().usersData.find((user) => user.id === id)) {
    const userIdx = getServerInstance().usersData.findIndex((user) => user.id === id)

    getServerInstance().usersData.splice(userIdx, 1, {
      id,
      age,
      hobbies,
      username
    })

    resolve(getServerInstance().usersData[userIdx])
  } 

  reject({message: 'Not Found!', code: 404})

})


const deleteUser = async ({ id }: Pick<Users, 'id'>): Promise<unknown> => new Promise((resolve, reject) => {
  
  if (getServerInstance().usersData.find((user) => user.id === id)) {

    const userIdx = getServerInstance().usersData.findIndex((user) => user.id === id)

    getServerInstance().usersData.splice(userIdx, 1)

    resolve({})
  } 

  reject({message: 'Not Found!', code: 404})

})


export { getUsers, getUser, createUser, updateUser, deleteUser}