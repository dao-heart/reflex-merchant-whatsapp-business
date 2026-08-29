const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

export async function requestChatResponse(conversation, businessContext) {
  const response = await fetch(`${apiBaseUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation, businessContext }),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.error || `Chat request failed with status ${response.status}`)
  }
  return result.message
}
