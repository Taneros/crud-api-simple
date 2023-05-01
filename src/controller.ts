import usersData from './data';


const getUsers = async () => new Promise((resolve, _) => resolve(usersData))

const getUser = async (userId: number) => {
  return new Promise((resolve, reject) => {
  
    const user = usersData.find((user) => user.id === userId)
    
    console.log(`controller.ts - line: 10 ->> user`, user)
    
    if (user) resolve(user)
    reject('Not found!')

})}

export {getUsers, getUser}