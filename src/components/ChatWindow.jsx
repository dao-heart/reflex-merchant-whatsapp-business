import { CheckCheck, MoreVertical, Paperclip, Phone, Search, Send, Smile, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function ChatWindow({ conversation, onSendMessage }) {
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleSubmit = (event) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message) return
    onSendMessage(conversation.id, message)
    setDraft('')
  }

  return (
    <section className="chat-window" aria-label={`Conversation with ${conversation.name}`}>
      <header className="chat-window-header">
        <img src={conversation.avatar} alt="" />
        <div>
          <strong>{conversation.name}</strong>
          <span>{conversation.status}</span>
        </div>
        <div className="chat-window-actions">
          <button aria-label="Video call"><Video size={18} /></button>
          <button aria-label="Voice call"><Phone size={18} /></button>
          <button aria-label="Search conversation"><Search size={18} /></button>
          <button aria-label="More conversation options"><MoreVertical size={18} /></button>
        </div>
      </header>

      <div className="message-area">
        <div className="message-day"><span>Today</span></div>
        <div className="encryption-note">Messages are end-to-end encrypted. No one outside of this chat can read them.</div>
        {conversation.messages.map((message) => (
          <div className={`message-row ${message.sender}`} key={message.id}>
            <div className="message-bubble">
              <p>{message.text}</p>
              <span>{message.time} {message.sender === 'agent' && <CheckCheck size={14} />}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-composer" onSubmit={handleSubmit}>
        <button type="button" aria-label="Add emoji"><Smile size={21} /></button>
        <button type="button" aria-label="Attach file"><Paperclip size={20} /></button>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" aria-label="Message" />
        <button className="send-button" type="submit" aria-label="Send message"><Send size={18} /></button>
      </form>
    </section>
  )
}

export default ChatWindow
