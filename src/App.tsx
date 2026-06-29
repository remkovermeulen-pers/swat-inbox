import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { MessageList } from './components/MessageList'
import { MessageDetail } from './components/MessageDetail'
import { BrandSettings } from './pages/BrandSettings'

function InboxLayout({ brandId }: { brandId?: string }) {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <MessageList brandId={brandId} />
      <MessageDetail />
    </div>
  )
}

function BrandInboxWrapper() {
  const { brandId } = useParams()
  return <InboxLayout brandId={brandId} />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" replace />} />
            <Route path="/inbox" element={<InboxLayout />} />
            <Route path="/inbox/settings" element={<BrandSettings />} />
            <Route path="/inbox/:brandId" element={<BrandInboxWrapper />} />
            <Route path="/inbox/:brandId/:messageId" element={<BrandInboxWrapper />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
