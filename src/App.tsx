import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TicketList } from './components/TicketList'
import { MessageDetail } from './components/MessageDetail'
import { BrandSettings } from './pages/BrandSettings'
import type { InboxFilter } from './data/mockData'

function InboxShell({
  brandId,
  channelId,
  filter,
}: {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
}) {
  const { messageId } = useParams()
  const hasMessage = Boolean(messageId)

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Ticket list — narrows when a message is open */}
      <div
        style={{
          width: hasMessage ? 560 : '100%',
          flexShrink: 0,
          height: '100%',
          borderRight: hasMessage ? '1px solid #e5e7eb' : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TicketList brandId={brandId} channelId={channelId} filter={filter} />
      </div>

      {/* Detail panel */}
      {hasMessage && (
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex' }}>
          <MessageDetail />
        </div>
      )}
    </div>
  )
}

function InboxRoutes({
  brandId,
  channelId,
  filter,
}: {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
}) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inbox" replace />} />
      <Route path="/inbox" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
      <Route path="/inbox/:brandId" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
      <Route path="/inbox/:brandId/:messageId" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
      <Route path="/inbox/settings" element={<BrandSettings />} />
    </Routes>
  )
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState<InboxFilter>('all')
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)

  function handleBrandChange(id: string | null) {
    setActiveBrandId(id)
    setActiveChannelId(null)
  }

  function handleChannelChange(id: string | null) {
    setActiveChannelId(id)
    setActiveBrandId(null)
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeBrandId={activeBrandId}
          onBrandChange={handleBrandChange}
          activeChannelId={activeChannelId}
          onChannelChange={handleChannelChange}
        />
        <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <InboxRoutes
            brandId={activeBrandId}
            channelId={activeChannelId}
            filter={activeFilter}
          />
        </main>
      </div>
    </BrowserRouter>
  )
}
