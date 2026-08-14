import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TicketList } from './components/TicketList'
import { BrandSettings } from './pages/BrandSettings'
import { Publisher } from './pages/Publisher'
import type { InboxFilter } from './data/mockData'
import type { CustomView, PinnedItem } from './lib/inboxScale'
import {
  loadCustomViews, saveCustomViews,
  loadPinnedItems, savePinnedItems,
  loadViewOrder, saveViewOrder,
  samePinnedItem, insertPinnedItemAt,
} from './lib/inboxScale'

const BASE_VIEW_FILTERS: InboxFilter[] = ['new', 'assigned_me', 'starred']

function defaultViewOrder(customViews: CustomView[]): PinnedItem[] {
  return [
    ...BASE_VIEW_FILTERS.map((key): PinnedItem => ({ kind: 'filter', key })),
    ...customViews.map((v): PinnedItem => ({ kind: 'view', id: v.id })),
  ]
}

function InboxShell({
  brandId,
  channelId,
  filter,
  onFilterChange,
  customViews,
  activeViewId,
  onAddView,
  onViewChange,
  onDeleteView,
  onUpdateView,
  viewOrder,
  onReorderView,
  mode = 'inbox',
}: {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
  onFilterChange: (f: InboxFilter) => void
  customViews: CustomView[]
  activeViewId: string | null
  onAddView: (view: CustomView) => void
  onViewChange: (id: string | null) => void
  onDeleteView: (id: string) => void
  onUpdateView: (id: string, patch: Partial<CustomView>) => void
  viewOrder: PinnedItem[]
  onReorderView: (item: PinnedItem, atIndex: number) => void
  mode?: 'inbox' | 'comments'
}) {
  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
      <div style={{ width: '100%', flexShrink: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TicketList
          brandId={brandId}
          channelId={channelId}
          filter={filter}
          onFilterChange={onFilterChange}
          customViews={customViews}
          activeViewId={activeViewId}
          onAddView={onAddView}
          onViewChange={onViewChange}
          onDeleteView={onDeleteView}
          onUpdateView={onUpdateView}
          viewOrder={viewOrder}
          onReorderView={onReorderView}
          mode={mode}
        />
      </div>
    </div>
  )
}

function InboxRoutes({
  brandId,
  channelId,
  filter,
  onFilterChange,
  customViews,
  activeViewId,
  onAddView,
  onViewChange,
  onDeleteView,
  onUpdateView,
  viewOrder,
  onReorderView,
}: {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
  onFilterChange: (f: InboxFilter) => void
  customViews: CustomView[]
  activeViewId: string | null
  onAddView: (view: CustomView) => void
  onViewChange: (id: string | null) => void
  onDeleteView: (id: string) => void
  onUpdateView: (id: string, patch: Partial<CustomView>) => void
  viewOrder: PinnedItem[]
  onReorderView: (item: PinnedItem, atIndex: number) => void
}) {
  const shell = (
    <InboxShell
      brandId={brandId}
      channelId={channelId}
      filter={filter}
      onFilterChange={onFilterChange}
      customViews={customViews}
      activeViewId={activeViewId}
      onAddView={onAddView}
      onViewChange={onViewChange}
      onDeleteView={onDeleteView}
      onUpdateView={onUpdateView}
      viewOrder={viewOrder}
      onReorderView={onReorderView}
    />
  )
  const commentsShell = (
    <InboxShell
      brandId={null}
      channelId={null}
      filter={filter}
      onFilterChange={onFilterChange}
      customViews={customViews}
      activeViewId={activeViewId}
      onAddView={onAddView}
      onViewChange={onViewChange}
      onDeleteView={onDeleteView}
      onUpdateView={onUpdateView}
      viewOrder={viewOrder}
      onReorderView={onReorderView}
      mode="comments"
    />
  )
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inbox" replace />} />
      <Route path="/inbox/settings" element={<BrandSettings />} />
      <Route path="/publisher" element={<Publisher />} />
      <Route path="/inbox" element={shell} />
      <Route path="/inbox/:brandId" element={shell} />
      <Route path="/inbox/:brandId/:messageId" element={shell} />
      <Route path="/comments" element={commentsShell} />
      <Route path="/comments/:messageId" element={commentsShell} />
    </Routes>
  )
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState<InboxFilter>('all')
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
  const activeChannelId: string | null = null
  const [customViews, setCustomViews] = useState<CustomView[]>(() => loadCustomViews())
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => loadPinnedItems())
  const [viewOrder, setViewOrder] = useState<PinnedItem[]>(() => {
    const loaded = loadViewOrder()
    return loaded ?? defaultViewOrder(customViews)
  })

  useEffect(() => { saveCustomViews(customViews) }, [customViews])
  useEffect(() => { savePinnedItems(pinnedItems) }, [pinnedItems])
  useEffect(() => { saveViewOrder(viewOrder) }, [viewOrder])

  // Any base filter or custom view not yet recorded (e.g. a just-created view) is appended at the end.
  useEffect(() => {
    setViewOrder((prev) => {
      const missing = defaultViewOrder(customViews).filter((d) => !prev.some((p) => samePinnedItem(p, d)))
      return missing.length === 0 ? prev : [...prev, ...missing]
    })
  }, [customViews])

  function activateView(view: CustomView | null) {
    setActiveViewId(view?.id ?? null)
    if (view) {
      setActiveBrandId(view.brandId ?? null)
      setActiveFilter('all')
    }
  }

  function handleViewChange(id: string | null) {
    activateView(id ? customViews.find((v) => v.id === id) ?? null : null)
  }

  function handleFilterChange(filter: InboxFilter) {
    setActiveFilter(filter)
    setActiveViewId(null)
  }

  function addCustomView(view: CustomView) {
    setCustomViews((prev) => [...prev, view])
    activateView(view)
  }

  function deleteCustomView(id: string) {
    setCustomViews((prev) => prev.filter((v) => v.id !== id))
    setViewOrder((prev) => prev.filter((p) => !(p.kind === 'view' && p.id === id)))
    if (activeViewId === id) setActiveViewId(null)
  }

  function updateCustomView(id: string, patch: Partial<CustomView>) {
    setCustomViews((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }

  function insertPinnedItem(item: PinnedItem, atIndex: number) {
    setPinnedItems((prev) => insertPinnedItemAt(prev, item, atIndex))
  }

  function removePinnedItem(item: PinnedItem) {
    setPinnedItems((prev) => prev.filter((p) => !samePinnedItem(p, item)))
  }

  function reorderView(item: PinnedItem, atIndex: number) {
    setViewOrder((prev) => insertPinnedItemAt(prev, item, atIndex))
  }

  function selectPinnedItem(item: PinnedItem) {
    if (item.kind === 'view') activateView(customViews.find((v) => v.id === item.id) ?? null)
    else handleFilterChange(item.key)
  }

  return (
    <HashRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          customViews={customViews}
          activeViewId={activeViewId}
          activeFilter={activeFilter}
          pinnedItems={pinnedItems}
          onSelectItem={selectPinnedItem}
          onDropItem={insertPinnedItem}
          onRemoveItem={removePinnedItem}
        />
        <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <InboxRoutes
            brandId={activeBrandId}
            channelId={activeChannelId}
            filter={activeFilter}
            onFilterChange={handleFilterChange}
            customViews={customViews}
            activeViewId={activeViewId}
            onAddView={addCustomView}
            onViewChange={handleViewChange}
            onDeleteView={deleteCustomView}
            onUpdateView={updateCustomView}
            viewOrder={viewOrder}
            onReorderView={reorderView}
          />
        </main>
      </div>
    </HashRouter>
  )
}
