import { TrendingUp } from 'lucide-react'

function StatCard({ item }) {
  const Icon = item.icon

  return (
    <article className="stat-card">
      <div className={`stat-icon ${item.tone}`}><Icon size={21} /></div>
      <p>{item.label}</p>
      <div className="stat-value">{item.value}</div>
      <div className="stat-trend">
        <span><TrendingUp size={13} /> {item.change}</span>
        {item.note}
      </div>
    </article>
  )
}

export default StatCard
