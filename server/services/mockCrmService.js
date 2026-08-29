import { readFile } from 'node:fs/promises'

export const artifactNames = [
  'customers',
  'conversations',
  'messages',
  'leads',
  'orders',
  'order_items',
  'payments',
  'products_inventory',
  'appointments',
  'campaigns',
  'agent_activity',
]

function parseCsv(csv) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index]
    const nextCharacter = csv[index + 1]
    if (character === '"' && quoted && nextCharacter === '"') {
      field += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(field)
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1
      row.push(field)
      if (row.some(Boolean)) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  const [headers, ...records] = rows
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])))
}

async function loadArtifact(name) {
  if (!artifactNames.includes(name)) throw new Error(`Unknown mock data artifact: ${name}`)
  const fileUrl = new URL(`../data/mock-data/${name}.csv`, import.meta.url)
  return parseCsv(await readFile(fileUrl, 'utf8'))
}

function formatClock(isoDate) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(isoDate))
}

function formatConversationTime(isoDate, referenceDate) {
  const date = new Date(isoDate)
  const reference = new Date(referenceDate)
  const differenceInDays = Math.round((reference.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000)
  if (differenceInDays === 0) return formatClock(isoDate)
  if (differenceInDays === 1) return 'Yesterday'
  return new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function buildConversations(artifacts) {
  const customersById = new Map(artifacts.customers.map((customer) => [customer.customer_id, customer]))
  const referenceDate = Math.max(...artifacts.conversations.map((conversation) => new Date(conversation.last_message_at).getTime()))

  return artifacts.conversations
    .map((conversation) => {
      const customer = customersById.get(conversation.customer_id)
      const messages = artifacts.messages
        .filter((message) => message.conversation_id === conversation.conversation_id)
        .sort((first, second) => new Date(first.sent_at) - new Date(second.sent_at))
        .map((message) => ({
          id: message.message_id,
          sender: message.sender,
          text: message.text,
          time: formatClock(message.sent_at),
          read: message.delivery_status === 'read',
        }))
      const lastMessage = messages.at(-1)

      return {
        id: conversation.conversation_id,
        customerId: conversation.customer_id,
        name: customer.full_name,
        avatar: customer.avatar_url,
        phone: customer.phone,
        language: customer.language,
        preview: lastMessage?.text ?? 'No messages yet',
        time: formatConversationTime(conversation.last_message_at, referenceDate),
        unread: Number(conversation.unread_count),
        status: conversation.status === 'open' && Number(conversation.unread_count) > 1 ? 'online' : `assigned to ${conversation.assigned_agent}`,
        leadIntent: conversation.lead_intent,
        messages,
      }
    })
    .sort((first, second) => Number(second.unread > 0) - Number(first.unread > 0))
}

function buildDashboard(artifacts) {
  const today = '2026-08-29'
  const todayConversations = artifacts.conversations.filter((item) => item.started_at.startsWith(today))
  const averageResponse = Math.round(
    artifacts.conversations.reduce((total, item) => total + Number(item.first_response_seconds), 0) / artifacts.conversations.length,
  )
  const todayOrders = artifacts.orders.filter((item) => item.created_at === today)
  const paidOrderIds = new Set(artifacts.payments.filter((item) => item.status === 'completed' && item.updated_at.startsWith(today)).map((item) => item.order_id))
  const revenue = artifacts.orders.filter((order) => paidOrderIds.has(order.order_id)).reduce((total, order) => total + Number(order.total_amount), 0)
  const openConversations = artifacts.conversations.filter((item) => item.status === 'open')
  const unreadCount = openConversations.reduce((total, item) => total + Number(item.unread_count), 0)
  const pendingPayments = artifacts.payments.filter((item) => item.status === 'pending')
  const lowStock = artifacts.products_inventory.filter((item) => Number(item.stock) <= Number(item.reorder_level))
  const campaignReach = Math.max(...artifacts.campaigns.map((campaign) => Number(campaign.sent)))
  const customersById = new Map(artifacts.customers.map((customer) => [customer.customer_id, customer]))
  const unreadAvatars = openConversations
    .filter((item) => Number(item.unread_count) > 0)
    .slice(0, 3)
    .map((item) => customersById.get(item.customer_id)?.full_name.split(' ').map((part) => part[0]).join(''))

  return {
    stats: [
      { key: 'conversations', label: 'New conversations', value: String(todayConversations.length), change: '+12%', note: 'vs. yesterday', tone: 'green' },
      { key: 'response', label: 'Avg. response time', value: `${Math.floor(averageResponse / 60)}m ${averageResponse % 60}s`, change: '-18%', note: 'faster today', tone: 'blue' },
      { key: 'orders', label: 'Orders received', value: String(todayOrders.length), change: '+2', note: 'since yesterday', tone: 'orange' },
      { key: 'revenue', label: 'Revenue today', value: formatCurrency(revenue), change: '+8.2%', note: 'vs. yesterday', tone: 'purple' },
    ],
    actions: [
      {
        key: 'replies', title: 'Reply to pending chats', detail: `${unreadCount} customer messages are waiting`,
        meta: `${openConversations.length} open conversations`, cta: 'Open chats', to: '/chats', tone: 'green', avatars: unreadAvatars,
      },
      {
        key: 'orders', title: 'Collect pending payments', detail: `${pendingPayments.length} orders are awaiting payment`,
        meta: `${formatCurrency(pendingPayments.reduce((total, item) => total + Number(item.amount), 0))} outstanding`, cta: 'View orders', tone: 'orange',
      },
      {
        key: 'broadcast', title: 'Create a broadcast', detail: `${lowStock.length} low-stock products need attention`,
        meta: `Reach ${campaignReach} opted-in contacts`, cta: 'Create message', tone: 'blue',
      },
    ],
    resolvedActivities: artifacts.agent_activity.filter((item) => item.status === 'completed').length,
    pendingActivities: artifacts.agent_activity.filter((item) => item.status === 'pending').length,
    activeAgents: new Set(artifacts.agent_activity.map((item) => item.agent)).size,
  }
}

let mockCrmPromise

export async function loadMockCrm() {
  if (mockCrmPromise) return mockCrmPromise
  mockCrmPromise = buildMockCrm()
  return mockCrmPromise
}

async function buildMockCrm() {
  const loadedArtifacts = await Promise.all(artifactNames.map(loadArtifact))
  const artifacts = Object.fromEntries(artifactNames.map((name, index) => [name, loadedArtifacts[index]]))
  return {
    artifacts,
    conversations: buildConversations(artifacts),
    dashboard: buildDashboard(artifacts),
  }
}

export async function loadMockArtifact(name) {
  const crm = await loadMockCrm()
  return crm.artifacts[name]
}
