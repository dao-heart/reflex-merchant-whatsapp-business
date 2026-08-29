import { ArrowUpRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function ActionCard({ item, onAction }) {
  const Icon = item.icon

  return (
    <article className="action-card">
      <div className={`action-icon ${item.tone}`}><Icon size={23} /></div>
      <div className="action-content">
        <div className="action-title-row">
          <h3>{item.title}</h3>
          {item.avatars && (
            <div className="avatar-stack" aria-label="Waiting customers">
              {item.avatars.map((initials, index) => <span key={initials} style={{ zIndex: 3 - index }}>{initials}</span>)}
              <span className="avatar-more">+5</span>
            </div>
          )}
        </div>
        <p>{item.detail}</p>
        <div className="action-footer">
          <span>{item.meta}</span>
          {item.to ? (
            <NavLink to={item.to}>{item.cta} <ArrowUpRight size={15} /></NavLink>
          ) : (
            <button onClick={() => onAction(item.cta)}>{item.cta} <ArrowUpRight size={15} /></button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ActionCard
