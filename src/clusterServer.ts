import http from 'http'

const PORTdefault = 7878

const mainServer = http.createServer(async (req, res) => {
  
  res.writeHead(200, { "Content-Type": "application/json" })
  
  res.end(JSON.stringify({message: 'get request'}))

})

const mainServerExport = (PORT: number = PORTdefault) => {
  mainServer.listen(PORT, () => { console.log(`\nServer started on port: ${PORT}\n`) })

  return mainServer
}

export {mainServerExport}