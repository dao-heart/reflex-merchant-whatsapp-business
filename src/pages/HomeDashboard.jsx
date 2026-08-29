import {
  Bot,
  Check,
  ChevronRight,
  Clock3,
  DollarSign,
  MessageCircleMore,
  PackageCheck,
  Send,
  ShoppingBag,
  UsersRound,
} from 'lucide-react'
import ActionCard from '../components/ActionCard.jsx'
import StatCard from '../components/StatCard.jsx'

const statIcons = {
  conversations: MessageCircleMore,
  response: Clock3,
  orders: ShoppingBag,
  revenue: DollarSign,
}

const actionIcons = {
  replies: MessageCircleMore,
  orders: PackageCheck,
  broadcast: Send,
}

function HomeDashboard({ showNotice, dashboard }) {
  const totalActivities = dashboard.resolvedActivities + dashboard.pendingActivities
  const resolvedPercentage = Math.round((dashboard.resolvedActivities / totalActivities) * 100)

  return (
    <div className="dashboard">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">SATURDAY, AUGUST 29</p>
          <h1>Good morning, Sofia <span>👋</span></h1>
          <p>Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="live-pill"><i /> Live updates</div>
      </section>

      <section className="glance-section" aria-labelledby="glance-title">
        <div className="section-heading">
          <div>
            <h2 id="glance-title">Today at a glance</h2>
            <p>Your business performance so far</p>
          </div>
          <button className="text-button" onClick={() => showNotice('Opening your full analytics report.')}>View report <ChevronRight size={16} /></button>
        </div>
        <div className="stats-grid">
          {dashboard.stats.map(item => <StatCard item={{ ...item, icon: statIcons[item.key] }} key={item.label} />)}
        </div>
      </section>

      <section className="lower-grid">
        <div className="agent-section">
          <div className="section-heading">
            <div>
              <h2>Agent actions</h2>
              <p>Keep your customer conversations moving</p>
            </div>
            <span className="action-count">{dashboard.actions.length} actions</span>
          </div>
          <div className="actions-list">
            {dashboard.actions.map(item => <ActionCard item={{ ...item, icon: actionIcons[item.key] }} key={item.title} onAction={showNotice} />)}
          </div>
        </div>

        <aside className="assist-card">
          <div className="assist-top">
            <div className="assist-icon"><Bot size={22} /></div>
            <span>AI ASSISTANT</span>
          </div>
          <h3>You&apos;re all caught up!</h3>
          <p>Your team has resolved <strong>{resolvedPercentage}%</strong> of today&apos;s assigned actions.</p>
          <div className="progress-bar"><span style={{ width: `${resolvedPercentage}%` }} /></div>
          <div className="progress-meta"><span>{dashboard.resolvedActivities} resolved</span><span>{dashboard.pendingActivities} remaining</span></div>
          <div className="team-row">
            <div><UsersRound size={18} /><span><strong>{dashboard.activeAgents} agents</strong> active now</span></div>
            <span className="status-check"><Check size={14} /></span>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default HomeDashboard
