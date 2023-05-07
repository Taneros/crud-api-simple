import { myServer } from './server';
const PORT = process.env.PORT

myServer(Number(PORT))