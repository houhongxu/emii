import { Command } from 'commander'
import Koa from 'koa'

const app = new Koa()

app.use((ctx) => {
  ctx.set('Content-Type', 'text/html')

  ctx.body = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Malita</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
        </div>
    </body>
    </html>`
})

function listen(port: number) {
  app.listen(port, () => {
    console.log(`App listening at http://127.0.0.1:${port}`)
  })
}

function build() {}

function devAction(port: number) {
  build
  listen(port)
}

export const dev = new Command('dev')

dev.option('-p,--port <number>', 'log it', '2222').action((options) => {
  const { port } = options
  devAction(port)
})
