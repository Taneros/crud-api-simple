/* eslint-disable @typescript-eslint/ban-ts-comment */
import dotenv from "dotenv"
import { env } from 'process'
import cluster from 'cluster'
import http from 'http'
import process from 'node:process'
import os from 'os'
import { ServerMod } from 'server'
import getReqData from './utils'


async function getCllusterServerInstanceAsync() {
  const {getServerInstance } = await import('./clusterServer');
  
  return getServerInstance
}

dotenv.config()

console.log(`CLUSTER_PORT_START: `,  process.env.CLUSTER_PORT_START )

const PORT = Number(process.env.CLUSTER_PORT_START) || 7878

let CurrentPort = Number(PORT) + 1

const cpus = os.cpus()

let mainServer: ServerMod | null = null

if (cluster.isPrimary) {
  console.log(`cluster.ts - line: 31 ->> PRIMARY`,)

  cpus.forEach((cpu, idx) => {

    const workerEnv = {};

    workerEnv[`WORKER_NAME`] = Number(PORT) + idx + 1;

    cluster.fork(workerEnv);

  });

  mainServer = http.createServer(async (req, res) => {
    
    const options = {
      hostname: 'localhost',
      port: CurrentPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const body = await getReqData(req)
    
    console.log(`cluster.ts - line: 51 ->> body`, body)

    http.request(options, async(respCluster) => { 

      console.log(`cluster.ts - line: 59 ->>  respCluster.headers`, respCluster.headers)

      const bodyRespCluster = await getReqData(respCluster)
    
      console.log(`cluster.ts - line: 63 ->> body`, bodyRespCluster)
      
      CurrentPort = CurrentPort === PORT + cpus.length ? PORT + 1 : CurrentPort + 1
      
      respCluster.pipe(res).on('finish', () => {
        console.log(`cluster.ts - line: 68 ->> PIPE`,)
        
        res.end()
      })
    }).end(body)

  }) as unknown as ServerMod


  mainServer.listen(PORT, () => { console.log(`\nMain server started on port: ${PORT} `) })


} else {

  console.log(`Worker ${process.pid} started`);

  getCllusterServerInstanceAsync().then(res => {
    
    res().listen(process.env.WORKER_NAME, () => { console.log(`\nCluster server started on port: ${process.env.WORKER_NAME}`) })
    
  })
}
