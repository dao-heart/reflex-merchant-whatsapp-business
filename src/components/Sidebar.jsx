import {
  ChevronRight,
  Home,
  MessageCircleMore,
  MoreHorizontal,
  Phone,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Chats', path: '/chats', icon: MessageCircleMore, showsUnread: true },
  { label: 'Calls', path: '/calls', icon: Phone },
  { label: 'Profile', path: '/profile', icon: UserRound },
]

function Sidebar({ unreadChats }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div className="brand-copy">
          <strong>WhatsApp</strong>
          <span>BUSINESS</span>
        </div>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <p className="nav-label">WORKSPACE</p>
        {navItems.map(({ label, path, icon: Icon, showsUnread }) => (
          <NavLink
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            key={label}
          >
            <Icon size={20} />
            <span>{label}</span>
            {showsUnread && unreadChats > 0 && <span className="nav-count">{unreadChats}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-tip">
        <span className="tip-icon"><Sparkles size={17} /></span>
        <strong>Business tip</strong>
        <p>Reply quickly to turn more chats into sales.</p>
        <button>See insights <ChevronRight size={14} /></button>
      </div>

      <div className="account">
        <div className="avatar avatar-main">PB</div>
        <div className="account-copy">
          <strong>Priya&apos;s Boutique</strong>
          <span><i /> Online</span>
        </div>
        <MoreHorizontal size={19} />
      </div>
    </aside>
  )
}

export default Sidebar
