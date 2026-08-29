import { Archive, ChevronDown, ExternalLink, Trash2 } from 'lucide-react'

function ConversationItem({ conversation, isSelected, isMenuOpen, onSelect, onToggleMenu, onAction }) {
  const handleMenuClick = (event) => {
    event.stopPropagation()
    onToggleMenu(conversation.id)
  }

  const handleAction = (event, action) => {
    event.stopPropagation()
    onAction(action, conversation)
  }

  return (
    <div
      className={`conversation-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(conversation.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === 'Enter' && onSelect(conversation.id)}
    >
      <img className="conversation-avatar" src={conversation.avatar} alt={`${conversation.name} profile`} />
      <div className="conversation-copy">
        <div className="conversation-name-row">
          <strong>{conversation.name}</strong>
          <span>{conversation.time}</span>
        </div>
        <div className="conversation-preview-row">
          <p>{conversation.preview}</p>
          {conversation.unread > 0 && <span className="unread-badge">{conversation.unread}</span>}
        </div>
      </div>
      <button className="conversation-menu-toggle" onClick={handleMenuClick} aria-label={`More options for ${conversation.name}`} aria-expanded={isMenuOpen}>
        <ChevronDown size={17} />
      </button>
      {isMenuOpen && (
        <div className="conversation-menu">
          <button onClick={(event) => handleAction(event, 'open')}><ExternalLink size={15} /> Open in new window</button>
          <button onClick={(event) => handleAction(event, 'archive')}><Archive size={15} /> Archive</button>
          <button className="danger" onClick={(event) => handleAction(event, 'delete')}><Trash2 size={15} /> Delete conversation</button>
        </div>
      )}
    </div>
  )
}

export default ConversationItem
