import http from 'http'
import { Duplex } from 'stream'
import * as net from 'net'

declare module 'net' {
  interface Server {
    destroy(): Promise<void>
  }
}

export default function (server: http.Server) {
  const sockets = new Set<Duplex>()

  // 记录所有套接字
  server.on('connection', function (socket) {
    sockets.add(socket)

    socket.on('close', function () {
      sockets.delete(socket)
    })
  })

  // destroy函数关闭服务并关闭所有套接字
  server.destroy = () => {
    return new Promise((resolve, reject) => {
      // 禁止新请求
      server.on('request', (incomingMessage, outgoingMessage) => {
        if (!outgoingMessage.headersSent) {
          outgoingMessage.setHeader('connection', 'close')
        }
      })

      // 关闭套接字
      for (const socket of sockets) {
        socket.destroy()
      }

      // 关闭服务
      server.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  return server
}
