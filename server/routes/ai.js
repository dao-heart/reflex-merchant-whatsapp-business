import { Router } from 'express'
import { getOpenAIClient, isOpenAIConfigured } from '../openaiClient.js'

const router = Router()

router.get('/status', (request, response) => {
  response.json({
    configured: isOpenAIConfigured(),
    model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  })
})

router.post('/respond', async (request, response, next) => {
  try {
    const { message, businessContext } = request.body
    if (typeof message !== 'string' || !message.trim()) {
      return response.status(400).json({ error: 'A non-empty message is required' })
    }

    const openai = getOpenAIClient()
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      instructions: [
        'You are a helpful assistant for a WhatsApp-based small business.',
        'Give concise, practical replies. Never claim to complete an external action unless it was actually completed.',
        businessContext ? `Business context: ${businessContext}` : '',
      ].filter(Boolean).join('\n'),
      input: message.trim(),
      max_output_tokens: 600,
    })

    return response.json({
      id: result.id,
      model: result.model,
      text: result.output_text,
      usage: result.usage,
    })
  } catch (error) {
    return next(error)
  }
})

export default router
