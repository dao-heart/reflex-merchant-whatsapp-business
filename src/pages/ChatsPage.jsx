import { useMemo, useState } from 'react'
import ChatWindow from '../components/ChatWindow.jsx'
import ConversationList from '../components/ConversationList.jsx'

function ChatsPage({ showNotice, initialConversations }) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? null)
  const [menuId, setMenuId] = useState(null)

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0],
    [conversations, selectedId],
  )

  const handleSelect = (id) => {
    setSelectedId(id)
    setMenuId(null)
    setConversations((items) => items.map((item) => item.id === id ? { ...item, unread: 0 } : item))
  }

  const handleAction = (action, conversation) => {
    setMenuId(null)
    if (action === 'open') {
      window.open(`/chats?conversation=${conversation.id}`, '_blank', 'noopener,noreferrer')
      return
    }
    setConversations((items) => items.filter((item) => item.id !== conversation.id))
    if (selectedId === conversation.id) {
      const nextConversation = conversations.find((item) => item.id !== conversation.id)
      setSelectedId(nextConversation?.id ?? null)
    }
    showNotice(action === 'archive' ? `${conversation.name}'s chat archived.` : `${conversation.name}'s chat deleted.`)
  }

  const handleSendMessage = (conversationId, text) => {
    setConversations((items) => items.map((item) => item.id === conversationId ? {
      ...item,
      preview: text,
      time: 'Now',
      messages: [...item.messages, { id: Date.now(), sender: 'agent', text, time: 'Now', read: true }],
    } : item))
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
