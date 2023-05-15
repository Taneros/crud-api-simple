/* eslint-disable @typescript-eslint/ban-ts-comment */
import dotenv from "dotenv"
dotenv.config()
import { env } from 'process'
import cluster, { Worker } from 'cluster'
import http, { Server } from 'http'
import process from 'node:process'
import os from 'os'
import { ServerMod } from 'server'
import getReqData from './utils'
import { myServer } from './clusterServer'
import { Users } from 'clusterController'

interface WorkersMod extends Worker {
  usersData: Users[]
}

const PORT = Number(process.env.CLUSTER_PORT_START) || 7878

let CurrentPort = Number(PORT) + 1

const cpus = os.cpus()

let myWorkers: WorkersMod = null

const DB: Users[] = []

let mainServer: ServerMod = null

if (cluster.isPrimary) {
  cpus.forEach((cpu, idx) => {

    const workerEnv = {};

    workerEnv[`WORKER_NAME`] = Number(PORT) + idx + 1;

    cluster.fork(workerEnv);

  });

  (cluster.workers as unknown as WorkersMod).usersData = []

  myWorkers = cluster.workers as unknown as WorkersMod

  mainServer = http.createServer(async (req, res) => {

    const options = {
      hostname: 'localhost',
      port: CurrentPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const body = await getReqData(req) as Users

    http.request(options, async (respCluster) => {

      console.log(`cluster.ts - line: 59 ->>  respCluster.headers`, respCluster.headers)

      CurrentPort = CurrentPort === PORT + cpus.length ? PORT + 1 : CurrentPort + 1

      // console.log(`cluster.ts - line: 62 ->> respClusterBody`, await getReqData(respCluster))
      
      const respBody = await getReqData(respCluster) as Users

      console.log(`cluster.ts - line: 67 ->> respBody`, respBody)

      // respCluster.pipe(res).on('finish', async () => {
      //   console.log(`cluster.ts - line: 68 ->> PIPE`,)


      //   console.log(`cluster.ts - line: 69 ->> await getReqData(respCluster)`, respBody)

      //   // mainServer.usersData = [...JSON.parse()]

      //   // console.log(`cluster.ts - line: 82 ->> myWorkers`, myWorkers.usersData)
        
      //   res.end()
      // })

      mainServer.usersData = [...mainServer.usersData, respBody]

      process.env.DB = JSON.stringify(mainServer)

      res.end(respBody)

    }).end(body)

  }) as unknown as ServerMod

  mainServer.usersData = []

  mainServer.listen(PORT, () => { console.log(`\nMain server started on port: ${PORT} `) })

  cluster.on('listening', (worker, address) => {

    console.log(`cluster.ts - line: 81 ->> worker id`, worker.id)

    console.log(
      `A worker is now connected to ${address.address}:${address.port}`);
    
      // process.env.DB = JSON.stringify(mainServer.usersData ?? [])
  }); 

  // cluster.on('message', (msg) => {
  //   console.log(`cluster.ts - line: 98 ->> msg`, msg)
  // })

} else {

  console.log(`Worker ${process.pid} started`);

  process.env.DB = JSON.stringify(mainServer?.usersData ?? [])

  myServer(Number(process.env.WORKER_NAME)) 
}

const getServerInstance = () => myWorkers

export { getServerInstance }