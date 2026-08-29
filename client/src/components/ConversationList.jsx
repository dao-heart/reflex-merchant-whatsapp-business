import { MessageCircleMore, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import ConversationItem from './ConversationItem.jsx'

function ConversationList({ conversations, selectedId, menuId, onSelect, onToggleMenu, onAction, showNotice }) {
  const [query, setQuery] = useState('')
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section className="conversation-list-panel" aria-label="Conversations">
      <div className="conversation-list-header">
        <div>
          <h1>Chats</h1>
          <span>{conversations.length} conversations</span>
        </div>
        <button aria-label="Start a new chat" onClick={() => showNotice('New conversation created.')}><Plus size={19} /></button>
      </div>
      <label className="chat-search">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chats" aria-label="Search chats" />
      </label>
      <div className="conversation-list">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            isMenuOpen={menuId === conversation.id}
            onSelect={onSelect}
            onToggleMenu={onToggleMenu}
            onAction={onAction}
          />
        ))}
        {filteredConversations.length === 0 && (
          <div className="no-chats"><MessageCircleMore size={25} /><p>No conversations found</p></div>
        )}
      </div>
    </section>
  )
}

export default ConversationList
