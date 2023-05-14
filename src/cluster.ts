import cluster from 'cluster'
import os from 'os'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const PORT = 7878

// const __dirname = dirname(fileURLToPath(import.meta.url))

// const mainServer = http.createServer(async (req, res) => {
  
//   res.writeHead(200, { "Content-Type": "application/json" })
  
//   res.end(JSON.stringify({message: 'get request'}))



// })

// mainServer.listen(PORT, () => { console.log(`\nServer started on port: ${PORT}\n`) })


const cpus = os.cpus()

console.log(`CPUs number: ${cpus.length}`)
cluster.setupPrimary({
  exec: __dirname + '/clusterServer.ts',
  execArgv: [``],
})

cpus.forEach(element => {
  cluster.fork()
});

cluster.on('exit', (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} was killed`)
  console.log(`Starting another worker`)
  cluster.fork()
})