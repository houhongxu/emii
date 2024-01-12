import EventEmitter from 'events'
import portfinder from 'portfinder'

/**
 * 查找可用端口
 */
export async function findPort(port: number) {
  try {
    const newPort = await portfinder.getPortPromise({ port: port })

    return newPort
  } catch (e) {
    console.error('无可用端口', e)
    process.exit(1)
  }
}

/**
 * 事件系统
 */
export const EmiEmitter = new EventEmitter()
