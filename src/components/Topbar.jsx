import { Bell, Plus, Search } from 'lucide-react'
import BrandMark from './BrandMark.jsx'

function Topbar({ showNotice }) {
  return (
    <header className="topbar">
      <div className="mobile-brand"><BrandMark /><strong>WA Business</strong></div>
      <label className="search-box">
        <Search size={18} />
        <input type="search" placeholder="Search conversations or customers" aria-label="Search" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications"><Bell size={20} /><span /></button>
        <button className="new-chat" onClick={() => showNotice('New conversation created.')}><Plus size={18} /> New chat</button>
      </div>
    </header>
  )
}

export default Topbar
