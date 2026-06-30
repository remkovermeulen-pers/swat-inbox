import { useState, useCallback, useRef, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TicketList } from './components/TicketList'
import { MessageDetail } from './components/MessageDetail'
import { BrandSettings } from './pages/BrandSettings'
import type { InboxFilter } from './data/mockData'

const SPLIT_KEY = 'inbox-split-pct'
const DEFAULT_SPLIT = 50

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

  const saved = parseFloat(localStorage.getItem(SPLIT_KEY) || String(DEFAULT_SPLIT))
  const [splitPct, setSplitPct] = useState(saved)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return
    function onMove(e: MouseEvent) {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pct = Math.min(75, Math.max(25, ((e.clientX - rect.left) / rect.width) * 100))
      setSplitPct(pct)
    }
    function onUp() {
      setDragging(false)
      setSplitPct((prev) => { localStorage.setItem(SPLIT_KEY, String(prev)); return prev })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging])

  return (
    <div ref={containerRef} style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', cursor: dragging ? 'col-resize' : 'default', userSelect: dragging ? 'none' : 'auto' }}>
      {/* Ticket list */}
      <div
        style={{
          width: hasMessage ? `${splitPct}%` : '100%',
          flexShrink: 0,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TicketList brandId={brandId} channelId={channelId} filter={filter} />
      </div>

      {/* Draggable divider */}
      {hasMessage && (
        <div
          onMouseDown={onMouseDown}
          style={{
            width: 5,
            flexShrink: 0,
            height: '100%',
            cursor: 'col-resize',
            background: dragging ? '#d1d5db' : '#e5e7eb',
            transition: dragging ? 'none' : 'background 0.15s',
            position: 'relative',
          }}
          onMouseEnter={(e) => { if (!dragging) (e.currentTarget as HTMLDivElement).style.background = '#d1d5db' }}
          onMouseLeave={(e) => { if (!dragging) (e.currentTarget as HTMLDivElement).style.background = '#e5e7eb' }}
        />
      )}

      {/* Detail panel */}
      {hasMessage && (
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex' }}>
          <MessageDetail key={messageId} />
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
      <Route path="/inbox/settings" element={<BrandSettings />} />
      <Route path="/inbox" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
      <Route path="/inbox/:brandId" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
      <Route path="/inbox/:brandId/:messageId" element={<InboxShell brandId={brandId} channelId={channelId} filter={filter} />} />
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
    <HashRouter>
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
    </HashRouter>
  )
}
