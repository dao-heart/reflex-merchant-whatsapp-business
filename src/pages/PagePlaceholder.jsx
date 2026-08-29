import { NavLink } from 'react-router-dom'

function PagePlaceholder({ title, description, icon: Icon }) {
  return (
    <div className="dashboard subpage">
      <p className="eyebrow">WHATSAPP BUSINESS</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="page-placeholder">
        <div><Icon size={30} /></div>
        <h2>{title} workspace</h2>
        <p>This route is connected and ready for its business workflow.</p>
        <NavLink to="/">Return to Home</NavLink>
      </div>
    </div>
  )
}

export default PagePlaceholder
