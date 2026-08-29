const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

async function fetchApi(path) {
  const response = await fetch(`${apiBaseUrl}${path}`)
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error || `API request failed with status ${response.status}`)
  }
  return response.json()
}

export function fetchDashboard() {
  return fetchApi('/api/mock-data/dashboard')
}

export function fetchConversations() {
  return fetchApi('/api/mock-data/conversations')
}

export async function loadMockCrm() {
  const [dashboard, conversations] = await Promise.all([
    fetchDashboard(),
    fetchConversations(),
  ])
  return { artifacts: {}, dashboard, conversations }
}
