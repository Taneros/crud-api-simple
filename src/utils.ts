import { IncomingMessage } from 'http'

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

export default getReqData
