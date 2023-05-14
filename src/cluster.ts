/* eslint-disable @typescript-eslint/ban-ts-comment */

import cluster from 'cluster'
import os from 'os'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import http, { IncomingMessage } from 'http'
import { availableParallelism } from 'node:os';


import process from 'node:process';

const PORT = Number(process.env.CLUSTERPORT_START) || 7878

let CurrentPort = Number(PORT) + 1

const __dirname = dirname(fileURLToPath(import.meta.url))

// const mainServer = http.createServer(async (req, res) => {

//   res.writeHead(200, { "Content-Type": "application/json" })

//   res.end(JSON.stringify({message: 'get request'}))
// })

// mainServer.listen(PORT, () => { console.log(`\nServer started on port: ${PORT}\n`) })


import { myServer } from './server';



const getReqData = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    try {
      let body = ""
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        resolve(body)
      })

    } catch (error) {
      reject(error)
    }
  })
}

const cpus = os.cpus()

// console.log(`CPUs number: ${cpus.length}`)
// cluster.setupPrimary({
//   exec: __dirname + '/clusterServer.ts',
//   execArgv: [``],
// })

// cpus.forEach(element => {
//   cluster.fork()
// });

// cluster.on('exit', (worker, code, signal) => {
//   console.log(`worker ${worker.process.pid} was killed`)
//   console.log(`Starting another worker`)
//   cluster.fork()
// })


//
if (cluster.isPrimary) {
  console.log(`cluster.ts - line: 45 ->> PRIMARY`,)

  cpus.forEach((cpu, idx) => {

    const workerEnv = {};

    workerEnv[`WORKER_NAME`] = Number(PORT) + idx + 1;

    cluster.fork(workerEnv);

  });

  const mainServer = http.createServer((req, res) => {

    // console.log(`cluster.ts - line: 64 ->> req`, req)

    // res.writeHead(200, { "Content-Type": "application/json" })

    // res.end(JSON.stringify({ message: 'main server' }))

    //@ts-ignore
    // if (typeof process.send === 'function') { 

    //   console.log(`cluster.ts - line: 73 ->> MSG`, )

    //   process.send({ cmd: 'notifyRequest' });
    // }
    
    const options = {
      hostname: 'localhost',
      port: CurrentPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    

    http.request(options, (respCluster) => {
      
      console.log(`cluster.ts - line: 89 ->> respCluster`, respCluster.headers)

      CurrentPort = CurrentPort === PORT + cpus.length ? PORT + 1 : CurrentPort + 1
      
      getReqData(respCluster).then(data => console.log(`cluster.ts - line: 93 ->> data`, data))
      
      respCluster.pipe(res).on('finish', () => {

        res.end()
      })
    }).end()

  })


  mainServer.listen(PORT, () => { console.log(`\nServer started on port: ${PORT} `) })

  cluster.on('fork', (worker) => {
    console.log(`cluster.ts - line: 107 ->> worker fork`)

    // PORT += worker.id

    // const clusterServer = http.createServer((req, res) => {

    //   console.log(`cluster.ts - line: 104 ->> `)

    //   res.writeHead(200, { "Content-Type": "application/json", "Worker": `${worker.id}` })

    //   // res.end(JSON.stringify({ message: 'worker id' + worker.id }))
    //   res.end()
    // })

    // clusterServer.listen(Number(PORT) + worker.id, () => { console.log(`\nServer started on port: ${Number(PORT) + worker.id}\n`) })

  })

  // cluster.on("exit", (worker, code, signal) => {
  //   console.log(`worker ${worker.process.pid} has been killed`);
  //   console.log("Starting another worker");
  //   cluster.fork();
  // });

  // cluster.on('online', (worker) => {
  //   worker.on('message', (msg) => {

  //     console.log(msg.cmd, worker.id)
  //   });
  // })


  // for (const id in cluster.workers) {
  //   //@ts-ignore
  //   cluster.workers[id].on('message', (msg, handdle) => {

  //     console.log(msg.cmd, id)
  //     console.log(`cluster.ts - line: 85 ->> handdle`, handdle)
  //   });

  //   }
    

  // console.log(`cluster.ts - line: 91 ->> luster.workers`, cluster.workers)

} else {

  console.log(`Worker ${process.pid} started`);


  const clusterServer = myServer(Number(PORT))

  // const clusterServer = http.createServer((req, res) => {

  //   console.log(`cluster.ts - line: 159 ->> `)

  //   res.writeHead(200, { "Content-Type": "application/json", "Worker": `${process.pid}` })

  //   // res.end(JSON.stringify({ message: 'worker id' + worker.id }))
  //   res.end(JSON.stringify({user: 'yoyoy'}))
  // })

  

  clusterServer.listen(process.env.WORKER_NAME, () => { console.log(`\nServer started on port: ${process.env.WORKER_NAME}`) })

}
