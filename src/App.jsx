import { useState } from 'react'
import { Phone, UserRound } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import DataState from './components/DataState.jsx'
import Toast from './components/Toast.jsx'
import Topbar from './components/Topbar.jsx'
import useCrmData from './hooks/useCrmData.js'
import useFakeData from './hooks/useFakeData.js'
import HomeDashboard from './pages/HomeDashboard.jsx'
import ChatsPage from './pages/ChatsPage.jsx'
import PagePlaceholder from './pages/PagePlaceholder.jsx'

function App() {
  const [notice, setNotice] = useState('')
  const { error, isLoading } = useCrmData()
  const fakeData = useFakeData()

  const unreadChats = fakeData.conversations.filter((conversation) => conversation.unread > 0).length

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2400)
  }

  return (
    <div className="app-shell">
      <Sidebar unreadChats={unreadChats} />
      <main className="main-content">
        <Topbar showNotice={showNotice} />
        {(isLoading || error || !fakeData.initialized) ? <DataState error={error} /> : (
          <Routes>
            <Route path="/" element={<HomeDashboard showNotice={showNotice} dashboard={fakeData.dashboard} />} />
            <Route path="/chats" element={(
              <ChatsPage
                showNotice={showNotice}
                conversations={fakeData.conversations}
              />
            )} />
            <Route path="/calls" element={<PagePlaceholder title="Calls" description="Review and manage your business call activity." icon={Phone} />} />
            <Route path="/profile" element={<PagePlaceholder title="Profile" description="Manage your business details and account settings." icon={UserRound} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
      <Toast message={notice} />
    </div>
  )
}

export default App
