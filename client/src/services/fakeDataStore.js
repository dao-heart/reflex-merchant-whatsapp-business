let initialData = null
let state = {
  initialized: false,
  artifacts: {},
  conversations: [],
  dashboard: null,
  archivedConversations: [],
  changeLog: [],
}

const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

function recordChange(type, entityId, details = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    entityId,
    details,
    changedAt: new Date().toISOString(),
  }
}

function updateDashboardUnreadCount(dashboard, conversations) {
  if (!dashboard) return dashboard
  const unreadMessages = conversations.reduce((total, conversation) => total + conversation.unread, 0)
  return {
    ...dashboard,
    actions: dashboard.actions.map((action) => action.key === 'replies'
      ? { ...action, detail: `${unreadMessages} customer messages are waiting` }
      : action),
  }
}

export function initializeFakeData(data) {
  if (state.initialized) return
  initialData = structuredClone(data)
  state = {
    ...structuredClone(data),
    initialized: true,
    archivedConversations: [],
    changeLog: [],
  }
  emit()
}

export function subscribeFakeData(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getFakeDataSnapshot() {
  return state
}

export function markConversationRead(conversationId) {
  const conversation = state.conversations.find((item) => item.id === conversationId)
  if (!conversation || conversation.unread === 0) return
  const conversations = state.conversations.map((item) => item.id === conversationId ? { ...item, unread: 0 } : item)
  state = {
    ...state,
    conversations,
    dashboard: updateDashboardUnreadCount(state.dashboard, conversations),
    changeLog: [...state.changeLog, recordChange('conversation.read', conversationId)],
  }
  emit()
}

export function archiveConversation(conversationId) {
  const conversation = state.conversations.find((item) => item.id === conversationId)
  if (!conversation) return
  const conversations = state.conversations.filter((item) => item.id !== conversationId)
  state = {
    ...state,
    conversations,
    archivedConversations: [...state.archivedConversations, conversation],
    dashboard: updateDashboardUnreadCount(state.dashboard, conversations),
    changeLog: [...state.changeLog, recordChange('conversation.archived', conversationId)],
  }
  emit()
}

export function deleteConversation(conversationId) {
  if (!state.conversations.some((item) => item.id === conversationId)) return
  const conversations = state.conversations.filter((item) => item.id !== conversationId)
  state = {
    ...state,
    conversations,
    dashboard: updateDashboardUnreadCount(state.dashboard, conversations),
    changeLog: [...state.changeLog, recordChange('conversation.deleted', conversationId)],
  }
  emit()
}

export function sendFakeMessage(conversationId, text, sender = 'agent', messageData = {}) {
  const message = {
    id: `TEMP-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    text,
    time: 'Now',
    read: sender === 'agent',
    ...messageData,
  }
  const conversations = state.conversations.map((conversation) => conversation.id === conversationId ? {
    ...conversation,
    preview: text,
    time: 'Now',
    messages: [...conversation.messages, message],
  } : conversation)
  state = {
    ...state,
    conversations,
    changeLog: [...state.changeLog, recordChange('message.created', message.id, { conversationId, text, sender })],
  }
  emit()
}

export function resetFakeData() {
  if (!initialData) return
  state = {
    ...structuredClone(initialData),
    initialized: true,
    archivedConversations: [],
    changeLog: [],
  }
  emit()
}

export function getTemporaryChanges() {
  return state.changeLog
}
