import { useMemo, useState } from 'react'
import ChatWindow from '../components/ChatWindow.jsx'
import ConversationList from '../components/ConversationList.jsx'
import {
  archiveConversation,
  deleteConversation,
  markConversationRead,
  sendFakeMessage,
} from '../services/fakeDataStore.js'

function ChatsPage({ showNotice, conversations }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? null)
  const [menuId, setMenuId] = useState(null)

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0],
    [conversations, selectedId],
  )

  const handleSelect = (id) => {
    setSelectedId(id)
    setMenuId(null)
    markConversationRead(id)
  }

  const handleAction = (action, conversation) => {
    setMenuId(null)
    if (action === 'open') {
      window.open(`/chats?conversation=${conversation.id}`, '_blank', 'noopener,noreferrer')
      return
    }
    if (action === 'archive') archiveConversation(conversation.id)
    if (action === 'delete') deleteConversation(conversation.id)
    if (selectedId === conversation.id) {
      const nextConversation = conversations.find((item) => item.id !== conversation.id)
      setSelectedId(nextConversation?.id ?? null)
    }
    showNotice(action === 'archive' ? `${conversation.name}'s chat archived.` : `${conversation.name}'s chat deleted.`)
  }

  const handleSendMessage = (conversationId, text) => {
    sendFakeMessage(conversationId, text)
  }

  return (
    <div className="chats-page">
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        menuId={menuId}
        onSelect={handleSelect}
        onToggleMenu={(id) => setMenuId(menuId === id ? null : id)}
        onAction={handleAction}
        showNotice={showNotice}
      />
      {selectedConversation && <ChatWindow conversation={selectedConversation} onSendMessage={handleSendMessage} />}
    </div>
  )
}

export default ChatsPage
