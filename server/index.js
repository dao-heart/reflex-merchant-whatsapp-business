import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT) || 3001

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`WhatsApp Business API listening on http://0.0.0.0:${port}`)
})

function shutDown(signal) {
  console.log(`${signal} received, shutting down`)
  server.close(() => process.exit(0))
}

process.on('SIGTERM', () => shutDown('SIGTERM'))
process.on('SIGINT', () => shutDown('SIGINT'))
