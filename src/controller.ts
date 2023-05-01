import usersData from './data';


const getUsers = async () => new Promise((resolve, _) => resolve(usersData))

const getUser = async (userId: string) => {
  return new Promise((resolve, reject) => {
  
    const user = usersData.find((user) => user.id === userId)
    
    console.log(`controller.ts - line: 10 ->> user`, user)
    
    if (user) resolve(user)
    reject({message: 'Not found!', code: 404})

})}

export {getUsers, getUser}