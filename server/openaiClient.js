import OpenAI from 'openai'

let client

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY)
}

export function getOpenAIClient() {
  if (!isOpenAIConfigured()) {
    const error = new Error('OPENAI_API_KEY is not configured')
    error.statusCode = 503
    throw error
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      ...(process.env.OPENAI_BASE_URL && { baseURL: process.env.OPENAI_BASE_URL }),
      ...(process.env.OPENAI_ORG_ID && { organization: process.env.OPENAI_ORG_ID }),
      ...(process.env.OPENAI_PROJECT_ID && { project: process.env.OPENAI_PROJECT_ID }),
    })
  }

  return client
}
