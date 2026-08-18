import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { messages } from '../data/mockData'
import type { InboxFilter } from '../data/mockData'
import type { CustomView, PinnedItem } from '../lib/inboxScale'
import { samePinnedItem } from '../lib/inboxScale'
import {
  Home,
  Inbox,
  MessageSquare,
  Calendar,
  BarChart2,
  Folder,
  Settings,
  GraduationCap,
  ChevronDown,
  Bell,
  Sparkles,
  UserCheck,
  Star,
  X,
} from 'lucide-react'

// Comments reuses the same mock message data as Inbox in this prototype, so both counts are identical for now.
const newItemsCount = messages.filter((m) => m.unread && !m.archived).length

const FILTER_META: Record<string, { icon: React.ReactNode; label: string }> = {
  new: { icon: <Sparkles size={14} />, label: 'New' },
  assigned_me: { icon: <UserCheck size={14} />, label: 'Assigned to me' },
  starred: { icon: <Star size={14} />, label: 'Starred' },
}

type StaticKey = 'home' | 'inbox' | 'comments' | 'publisher' | 'insights' | 'library'
const STATIC_KEYS: StaticKey[] = ['home', 'inbox', 'comments', 'publisher', 'insights', 'library']

type NavRow = { kind: 'static'; key: StaticKey } | { kind: 'pinned'; item: PinnedItem }

const NAV_ORDER_KEY = 'inbox-sidebar-nav-order'

function loadNavOrderIds(): string[] {
  try {
    const raw = localStorage.getItem(NAV_ORDER_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

function saveNavOrderIds(ids: string[]) {
  localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(ids))
}

function itemKey(item: PinnedItem) {
  return item.kind === 'filter' ? `f:${item.key}` : `v:${item.id}`
}

/** Merges the user's saved order with the current static items + pinned items, so it always
 * renders something sensible even if the saved order is stale, empty, or missing entries. */
function buildNavRows(orderIds: string[], items: PinnedItem[]): NavRow[] {
  const pinnedByKey = new Map(items.map((it) => [itemKey(it), it]))
  const seen = new Set<string>()
  const rows: NavRow[] = []
  for (const id of orderIds) {
    if (seen.has(id)) continue
    if (id.startsWith('static:')) {
      const key = id.slice(7) as StaticKey
      if (STATIC_KEYS.includes(key)) {
        rows.push({ kind: 'static', key })
        seen.add(id)
      }
    } else {
      const item = pinnedByKey.get(id)
      if (item) {
        rows.push({ kind: 'pinned', item })
        seen.add(id)
      }
    }
  }
  for (const key of STATIC_KEYS) {
    const id = `static:${key}`
    if (!seen.has(id)) {
      rows.push({ kind: 'static', key })
      seen.add(id)
    }
  }
  for (const item of items) {
    const id = itemKey(item)
    if (!seen.has(id)) {
      rows.push({ kind: 'pinned', item })
      seen.add(id)
    }
  }
  return rows
}

export function Sidebar({
  customViews,
  activeViewId,
  activeFilter,
  pinnedItems,
  onSelectItem,
  onDropItem,
  onRemoveItem,
}: {
  customViews: CustomView[]
  activeViewId: string | null
  activeFilter: InboxFilter
  pinnedItems: PinnedItem[]
  onSelectItem: (item: PinnedItem) => void
  onDropItem: (item: PinnedItem, atIndex: number) => void
  onRemoveItem: (item: PinnedItem) => void
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isInbox = location.pathname.startsWith('/inbox') && !location.pathname.includes('settings')
  const isComments = location.pathname.startsWith('/comments')
  const [navOrderIds, setNavOrderIds] = useState<string[]>(() => loadNavOrderIds())
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const navRows = buildNavRows(navOrderIds, pinnedItems)

  function itemMeta(item: PinnedItem): { icon: React.ReactNode; label: string } | null {
    if (item.kind === 'filter') return FILTER_META[item.key] ?? null
    const view = customViews.find((v) => v.id === item.id)
    return view ? { icon: <span style={{ fontSize: 14 }}>{view.icon}</span>, label: view.name } : null
  }

  function isActive(item: PinnedItem) {
    if (!isInbox) return false
    return item.kind === 'filter' ? activeFilter === item.key : activeViewId === item.id
  }

  function goToItem(item: PinnedItem) {
    onSelectItem(item)
    navigate('/inbox')
  }

  function computeDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const rows = Array.from(e.currentTarget.querySelectorAll('[data-nav-row]'))
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect()
      if (e.clientY < rect.top + rect.height / 2) return i
    }
    return rows.length
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropIndex(computeDropIndex(e))
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropIndex(null)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const atIndex = computeDropIndex(e)
    setDropIndex(null)
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    let payload: PinnedItem
    try {
      payload = JSON.parse(raw) as PinnedItem
    } catch {
      return
    }
    const payloadId = itemKey(payload)
    const alreadyPinned = pinnedItems.some((p) => samePinnedItem(p, payload))
    if (!alreadyPinned) onDropItem(payload, pinnedItems.length)

    const ids = navRows.map((r) => (r.kind === 'static' ? `static:${r.key}` : itemKey(r.item)))
    const fromIndex = ids.indexOf(payloadId)
    const withoutDragged = fromIndex !== -1 ? [...ids.slice(0, fromIndex), ...ids.slice(fromIndex + 1)] : ids
    let insertAt = fromIndex !== -1 && fromIndex < atIndex ? atIndex - 1 : atIndex
    insertAt = Math.min(Math.max(0, insertAt), withoutDragged.length)
    const nextIds = [...withoutDragged.slice(0, insertAt), payloadId, ...withoutDragged.slice(insertAt)]
    setNavOrderIds(nextIds)
    saveNavOrderIds(nextIds)
  }

  function renderStaticRow(key: StaticKey) {
    switch (key) {
      case 'home':
        return <NavItem icon={<Home size={16} />} label="Home" active={false} onClick={() => {}} />
      case 'inbox':
        return (
          <NavLink
            to="/inbox"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 6,
              fontSize: 14, fontWeight: isInbox ? 600 : 400,
              color: isInbox ? '#15803d' : '#374151',
              background: isInbox ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#6b7280' }}><Inbox size={16} /></span>
            <span style={{ flex: 1 }}>Inbox</span>
            {newItemsCount > 0 && <CountBadge count={newItemsCount} active={isInbox} />}
          </NavLink>
        )
      case 'comments':
        return (
          <NavLink
            to="/comments"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 6,
              fontSize: 14, fontWeight: isComments ? 600 : 400,
              color: isComments ? '#15803d' : '#374151',
              background: isComments ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#6b7280' }}><MessageSquare size={16} /></span>
            <span style={{ flex: 1 }}>Comments</span>
            {newItemsCount > 0 && <CountBadge count={newItemsCount} active={isComments} />}
          </NavLink>
        )
      case 'publisher':
        return (
          <NavLink
            to="/publisher"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 6,
              fontSize: 14, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#15803d' : '#374151',
              background: isActive ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
            })}
          >
            <span style={{ color: '#6b7280' }}><Calendar size={16} /></span>
            Publisher
          </NavLink>
        )
      case 'insights':
        return <NavItem icon={<BarChart2 size={16} />} label="Insights" active={false} onClick={() => {}} />
      case 'library':
        return <NavItem icon={<Folder size={16} />} label="Library" badge="BETA" active={false} onClick={() => {}} />
    }
  }

  return (
    <aside
      style={{
        width: 236,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Org + bell */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 14px',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12 }}>S</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Remko's organisation
        </span>
        <ChevronDown size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
        <div style={{ position: 'relative', flexShrink: 0, marginLeft: 4 }}>
          <Bell size={16} style={{ color: '#6b7280' }} />
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -8,
              background: '#ef4444',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              padding: '1px 4px',
              borderRadius: 99,
              lineHeight: 1.4,
            }}
          >
            99+
          </span>
        </div>
      </div>

      {/* Main nav — a pinned view can be dragged to any vertical position, interspersed with the static items */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}
      >
        {navRows.map((row, i) => {
          const rowKey = row.kind === 'static' ? `static:${row.key}` : itemKey(row.item)
          return (
            <div key={rowKey} data-nav-row>
              {dropIndex === i && <DropIndicator />}
              {row.kind === 'static' ? (
                renderStaticRow(row.key)
              ) : (
                (() => {
                  const meta = itemMeta(row.item)
                  if (!meta) return null
                  const active = isActive(row.item)
                  return (
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(row.item))
                        e.dataTransfer.effectAllowed = 'move'
                      }}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'grab' }}
                    >
                      <button
                        onClick={() => goToItem(row.item)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 28px 7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                          background: active ? '#f0fdf4' : 'transparent',
                          color: active ? '#15803d' : '#374151',
                          fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 400, textAlign: 'left',
                        }}
                      >
                        <span style={{ color: '#6b7280', display: 'flex' }}>{meta.icon}</span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meta.label}</span>
                      </button>
                      <button
                        onClick={() => onRemoveItem(row.item)}
                        title="Unpin from sidebar"
                        style={{
                          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 16, height: 16, border: 'none', borderRadius: '50%',
                          background: 'none', color: '#9ca3af', cursor: 'pointer',
                        }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )
                })()
              )}
            </div>
          )
        })}
        {dropIndex === navRows.length && <DropIndicator />}
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #f3f4f6', padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#065f46',
              flexShrink: 0,
            }}
          >
            R
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Remko Vermeulen</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Settings size={13} /> Settings
          </button>
          <button style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <GraduationCap size={13} /> Tutorials
          </button>
        </div>
      </div>
    </aside>
  )
}

function DropIndicator() {
  return <div style={{ height: 2, borderRadius: 1, background: '#5e6ad2', margin: '2px 10px' }} />
}

function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      style={{
        fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
        background: active ? '#dcfce7' : '#f3f4f6',
        color: active ? '#15803d' : '#6b7280',
      }}
    >
      {count > 999 ? '999+' : count}
    </span>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 10px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        background: active ? '#f0fdf4' : 'transparent',
        color: active ? '#15803d' : '#374151',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
      }}
    >
      <span style={{ color: '#6b7280' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', background: '#faf5ff', padding: '1px 6px', borderRadius: 99 }}>
          {badge}
        </span>
      )}
    </button>
  )
}
