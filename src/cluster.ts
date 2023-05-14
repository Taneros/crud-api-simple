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

if (cluster.isPrimary) {
  cpus.forEach((cpu, idx) => {

    const workerEnv = {};

    workerEnv[`WORKER_NAME`] = Number(PORT) + idx + 1;

    cluster.fork(workerEnv);

  });

  (cluster.workers as unknown as WorkersMod).usersData = []

  myWorkers = cluster.workers as unknown as WorkersMod

  const mainServer = http.createServer(async (req, res) => {

    const options = {
      hostname: 'localhost',
      port: CurrentPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const body = await getReqData(req) as Users

    console.log(`cluster.ts - line: 51 ->> body`, body)

    http.request(options, async (respCluster) => {

      console.log(`cluster.ts - line: 59 ->>  respCluster.headers`, respCluster.headers)

      CurrentPort = CurrentPort === PORT + cpus.length ? PORT + 1 : CurrentPort + 1

      respCluster.pipe(res).on('finish', () => {
        console.log(`cluster.ts - line: 68 ->> PIPE`,)

        // myWorkers.users = [...myWorkers.users, body]

        console.log(`cluster.ts - line: 82 ->> myWorkers`, myWorkers.usersData)
        
        res.end()
      })
    }).end(body)

  })


  mainServer.listen(PORT, () => { console.log(`\nMain server started on port: ${PORT} `) })

} else {

  console.log(`Worker ${process.pid} started`);

  myServer(Number(process.env.WORKER_NAME)) 
}

const getServerInstance = () => myWorkers

export { getServerInstance }