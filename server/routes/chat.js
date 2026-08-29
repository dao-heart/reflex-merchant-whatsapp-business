import { Router } from 'express'
import { getOpenAIClient } from '../openaiClient.js'

const router = Router()
const allowedSenders = new Set(['customer', 'agent'])

router.post('/', async (request, response, next) => {
  try {
    const { conversation, businessContext } = request.body
    if (!Array.isArray(conversation) || conversation.length === 0) {
      return response.status(400).json({ error: 'A non-empty conversation array is required' })
    }

    const invalidMessage = conversation.some((message) => (
      !allowedSenders.has(message.sender) || typeof message.text !== 'string' || !message.text.trim()
    ))
    if (invalidMessage) {
      return response.status(400).json({ error: 'Each message requires a customer or agent sender and non-empty text' })
    }

    const input = conversation.slice(-30).map((message) => ({
      role: message.sender === 'agent' ? 'assistant' : 'user',
      content: message.text.trim(),
    }))
    const openai = getOpenAIClient()
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      instructions: [
        'You are the customer support agent for Priya’s Boutique, an Indian WhatsApp-based clothing business.',
        'Reply naturally and concisely to the customer’s latest message.',
        'Use ₹ for prices and do not claim an order, payment, refund, or booking was completed unless the conversation confirms it.',
        businessContext ? `Business context: ${businessContext}` : '',
      ].filter(Boolean).join('\n'),
      input,
      max_output_tokens: 400,
    })

    return response.json({
      responseId: result.id,
      message: {
        id: `AI-${result.id}`,
        sender: 'agent',
        text: result.output_text,
        time: new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
        read: true,
      },
      usage: result.usage,
    })
  } catch (error) {
    return next(error)
  }
})

export default router
