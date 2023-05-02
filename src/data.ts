import { UUID } from 'crypto'

//TODO
/**
  * write generator for users
  **/

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

export default users