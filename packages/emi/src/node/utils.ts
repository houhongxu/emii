import portfinder from 'portfinder'

/**
 * 查找可用端口
 */
export async function findPort(port: number) {
  try {
    const newPort = await portfinder.getPortPromise({ port: port })

    return newPort
  } catch (e) {
    console.log('无可用端口', e)
    process.exit(1)
  }
}
