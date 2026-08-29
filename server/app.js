import cors from 'cors'
import express from 'express'
import aiRouter from './routes/ai.js'

const app = express()

app.disable('x-powered-by')
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) || 'http://localhost:5173',
}))
app.use(express.json({ limit: '1mb' }))

app.get('/health', (request, response) => {
  response.json({ status: 'ok', service: 'whatsapp-business-api' })
})

app.use('/api/ai', aiRouter)

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use((error, request, response, next) => {
  void request
  void next
  const statusCode = error.statusCode || error.status || 500
  console.error('[server]', error.message)
  response.status(statusCode).json({
    error: statusCode >= 500 ? 'The AI service is currently unavailable' : error.message,
  })
})

export default app
