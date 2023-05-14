import dotenv from "dotenv"
import { myServer } from './server';

dotenv.config()

const PORT = process.env.PORT || 7777

console.log(`process.env.PORT is set to: `,  process.env.PORT )

export default myServer(Number(PORT))