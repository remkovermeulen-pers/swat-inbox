import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { messages, customers, brands, channels } from '../data/mockData'
import type { Message, InboxFilter, Tag } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { AGENTS, getPriorityScore, messageMatchesView, priorityTier, type CustomView, type SortCol, type SortDir } from '../lib/inboxScale'
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Star,
  TrendingUp,
  Tag as TagIcon,
  CheckCheck,
  Archive,
  BookmarkPlus,
  Columns3,
} from 'lucide-react'

interface Props {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
  customViews: CustomView[]
  activeViewId: string | null
  onAddView: (view: CustomView) => void
}

const STATUS_TO_LABEL: Record<string, 'Unanswered' | 'AI pending' | 'Answered'> = {
  unanswered: 'Unanswered',
  ai_pending: 'AI pending',
  answered: 'Answered',
}

type ColKey = 'priority' | 'ticket' | 'replies' | 'reach' | 'channel' | 'time'

const TOGGLEABLE_COLUMNS: { key: ColKey; label: string; width: number }[] = [
  { key: 'priority', label: 'Priority', width: 72 },
  { key: 'ticket', label: 'Ticket #', width: 80 },
  { key: 'replies', label: 'Replies', width: 60 },
  { key: 'reach', label: 'Reach', width: 70 },
  { key: 'channel', label: 'Channel', width: 130 },
  { key: 'time', label: 'Time', width: 44 },
]

const VISIBLE_COLS_KEY = 'inbox-visible-columns'

function loadVisibleCols(): Set<ColKey> {
  try {
    const raw = localStorage.getItem(VISIBLE_COLS_KEY)
    if (!raw) return new Set(TOGGLEABLE_COLUMNS.map((c) => c.key))
    const parsed = JSON.parse(raw) as ColKey[]
    return new Set(parsed)
  } catch {
    return new Set(TOGGLEABLE_COLUMNS.map((c) => c.key))
  }
}

export function TicketList({ brandId, channelId, filter, customViews, activeViewId, onAddView }: Props) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortFilter, setSortFilter] = useState<'All' | 'Unanswered' | 'AI pending' | 'Answered'>('All')
  const [sortCol, setSortCol] = useState<SortCol>('time')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [overrides, setOverrides] = useState<Record<string, Partial<Message>>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(() => loadVisibleCols())
  const [showColumnMenu, setShowColumnMenu] = useState(false)

  useEffect(() => {
    localStorage.setItem(VISIBLE_COLS_KEY, JSON.stringify(Array.from(visibleCols)))
  }, [visibleCols])

  function toggleColumn(key: ColKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const activeView = customViews.find((v) => v.id === activeViewId) ?? null
  const viewChannel = activeView?.channelId ? channels.find((c) => c.id === activeView.channelId) : null

  useEffect(() => {
    if (!activeViewId) return
    const v = customViews.find((view) => view.id === activeViewId)
    if (v?.sortCol) { setSortCol(v.sortCol); setSortDir(v.sortDir ?? 'desc') }
    else { setSortCol('priority'); setSortDir('desc') }
    setSortFilter(v?.statuses?.length === 1 ? STATUS_TO_LABEL[v.statuses[0]] ?? 'All' : 'All')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('desc') }
  }

  const channel = channelId ? channels.find((c) => c.id === channelId) : null

  function withOverrides(m: Message): Message {
    const o = overrides[m.id]
    return o ? { ...m, ...o } : m
  }

  let filtered = messages
    .map(withOverrides)
    .filter((m) => (filter === 'archive' ? m.archived === true : !m.archived))
    .filter((m) => {
      if (activeView) {
        const cust = customers.find((c) => c.id === m.customerId)
        if (!messageMatchesView(m, cust, activeView)) return false
        if (viewChannel && !(m.channel === viewChannel.name && m.platform === viewChannel.platform)) return false
        return true
      }
      return (!brandId || m.brandId === brandId)
        && (!channelId || (channel && m.channel === channel.name && m.platform === channel.platform))
    })
    .filter((m) => {
      if (activeView) return true
      if (filter === 'new') return m.unread
      if (filter === 'starred') return m.starred
      if (filter === 'assigned_me') return m.assignedTo === 'Remko'
      if (filter === 'assigned_others') return m.assignedTo && m.assignedTo !== 'Remko'
      return true
    })
    .filter((m) => {
      if (sortFilter === 'Unanswered') return m.status === 'unanswered'
      if (sortFilter === 'AI pending') return m.status === 'ai_pending'
      if (sortFilter === 'Answered') return m.status === 'answered'
      return true
    })
    .sort((a, b) => {
      const custA = customers.find((c) => c.id === a.customerId)
      const custB = customers.find((c) => c.id === b.customerId)
      let cmp = 0
      if (sortCol === 'time') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      else if (sortCol === 'name') cmp = (custA?.name ?? '').localeCompare(custB?.name ?? '')
      else if (sortCol === 'ticket') cmp = a.ticketNumber.localeCompare(b.ticketNumber)
      else if (sortCol === 'replies') cmp = a.replyCount - b.replyCount
      else if (sortCol === 'reach') cmp = (custA?.totalReach ?? 0) - (custB?.totalReach ?? 0)
      else if (sortCol === 'channel') cmp = a.channel.localeCompare(b.channel)
      else if (sortCol === 'priority') cmp = getPriorityScore(a, custA) - getPriorityScore(b, custB)
      return sortDir === 'asc' ? cmp : -cmp
    })

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((m) => m.id)))
  }

  function applyToSelected(patch: Partial<Message>) {
    setOverrides((prev) => {
      const next = { ...prev }
      selected.forEach((id) => { next[id] = { ...next[id], ...patch } })
      return next
    })
  }

  function bulkAssign(name: string) {
    if (!name) return
    const count = selected.size
    applyToSelected({ assignedTo: name })
    setToast(`Assigned ${count} ticket${count > 1 ? 's' : ''} to ${name}`)
    setSelected(new Set())
  }

  function bulkTag() {
    const label = window.prompt('Tag to add to selected tickets:')
    if (!label?.trim()) return
    const newTag: Tag = { label: label.trim(), color: '#5e6ad2' }
    const count = selected.size
    setOverrides((prev) => {
      const next = { ...prev }
      selected.forEach((id) => {
        const current = withOverrides(messages.find((m) => m.id === id)!)
        if (!current.tags.some((t) => t.label.toLowerCase() === newTag.label.toLowerCase())) {
          next[id] = { ...next[id], tags: [...current.tags, newTag] }
        }
      })
      return next
    })
    setToast(`Tagged ${count} ticket${count > 1 ? 's' : ''} "${newTag.label}"`)
    setSelected(new Set())
  }

  function bulkMarkAnswered() {
    const count = selected.size
    applyToSelected({ status: 'answered' })
    setToast(`Marked ${count} ticket${count > 1 ? 's' : ''} as answered`)
    setSelected(new Set())
  }

  function bulkArchive() {
    const count = selected.size
    applyToSelected({ archived: true })
    setToast(`Archived ${count} ticket${count > 1 ? 's' : ''}`)
    setSelected(new Set())
  }

  function saveCurrentView() {
    const name = window.prompt('Name this view:', activeView ? `${activeView.name} (customized)` : '')
    if (!name?.trim()) return
    const statuses = sortFilter === 'All' ? undefined : [
      sortFilter === 'Unanswered' ? 'unanswered' as const
        : sortFilter === 'AI pending' ? 'ai_pending' as const
        : 'answered' as const,
    ]
    onAddView({
      id: `view-${Date.now()}`,
      name: name.trim(),
      icon: activeView?.icon ?? '📌',
      color: activeView?.color ?? '#5e6ad2',
      keywords: activeView?.keywords,
      tags: activeView?.tags,
      sentiments: activeView?.sentiments,
      minReach: activeView?.minReach,
      statuses,
      brandId: activeView?.brandId ?? brandId ?? undefined,
      channelId: activeView?.channelId ?? channelId ?? undefined,
      sortCol,
      sortDir,
    })
    setToast(`Saved view "${name.trim()}"`)
  }

  const headerLabel = activeView
    ? `${activeView.icon} ${activeView.name}`
    : brandId
    ? brands.find((b) => b.id === brandId)?.name ?? 'Inbox'
    : channel
    ? channel.name
    : 'Tickets'

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
          {headerLabel}
        </h1>

        {activeView && (
          <span style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 99, padding: '3px 10px' }}>
            Smart view · across all brands &amp; channels, sorted by priority
          </span>
        )}

        {/* Status quick-filters */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
          {(['All', 'Unanswered', 'AI pending', 'Answered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSortFilter(f)}
              style={{
                padding: '4px 12px',
                borderRadius: 99,
                border: 'none',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                background: sortFilter === f ? '#111827' : '#f3f4f6',
                color: sortFilter === f ? '#fff' : '#6b7280',
                transition: 'all 0.1s',
                fontFamily: 'inherit',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={18} style={{ color: '#9ca3af', cursor: 'pointer' }} />
          <Download size={18} style={{ color: '#9ca3af', cursor: 'pointer' }} />
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
            Sort by: {sortCol === 'time' ? 'Time' : sortCol === 'name' ? 'Name' : sortCol === 'ticket' ? 'Ticket #' : sortCol === 'replies' ? 'Replies' : sortCol === 'reach' ? 'Reach' : sortCol === 'priority' ? 'Priority' : 'Channel'} {sortDir === 'asc' ? '↑' : '↓'}
          </span>
          <button onClick={saveCurrentView} style={saveViewBtnStyle} title="Save the current filters, status, and sort order as a Smart View">
            <BookmarkPlus size={13} /> Save view
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowColumnMenu((v) => !v)} style={saveViewBtnStyle}>
              <Columns3 size={13} /> Columns
            </button>
            {showColumnMenu && (
              <>
                <div
                  onClick={() => setShowColumnMenu(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 9 }}
                />
                <div
                  style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 10,
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: 8, width: 160,
                  }}
                >
                  {TOGGLEABLE_COLUMNS.map((col) => (
                    <label
                      key={col.key}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#374151' }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        style={{ cursor: 'pointer', accentColor: '#5e6ad2' }}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk selection bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 20px',
          borderBottom: '1px solid #f3f4f6',
          background: selected.size > 0 ? '#f0fdf4' : '#fff',
        }}
      >
        <input
          type="checkbox"
          checked={selected.size > 0 && selected.size === filtered.length}
          onChange={toggleAll}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#22c55e' }}
        />
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {selected.size > 0 ? `${selected.size} selected` : 'None selected'}
        </span>

        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select
              value=""
              onChange={(e) => bulkAssign(e.target.value)}
              style={bulkBtnStyle}
            >
              <option value="">Assign to…</option>
              {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <button onClick={bulkTag} style={bulkBtnStyle}>
              <TagIcon size={13} /> Tag
            </button>
            <button onClick={bulkMarkAnswered} style={bulkBtnStyle}>
              <CheckCheck size={13} /> Mark answered
            </button>
            <button onClick={bulkArchive} style={bulkBtnStyle}>
              <Archive size={13} /> Archive
            </button>
          </div>
        )}

        <div style={{ flex: 1 }} />
        {toast && (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={13} /> {toast}
          </span>
        )}
        <RefreshCw size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb',
          gap: 12,
          userSelect: 'none',
        }}
      >
        {/* match checkbox + star + platform icons widths */}
        <div style={{ width: 15, flexShrink: 0 }} />
        <div style={{ width: 15, flexShrink: 0 }} />
        <div style={{ width: 39, flexShrink: 0 }} />

        {/* Name */}
        <ColHeader label="Name" col="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={140} />

        {/* Preview — not sortable, flex spacer */}
        <div style={{ flex: 1 }} />

        {/* Priority */}
        {visibleCols.has('priority') && <ColHeader label="Priority" col="priority" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={72} />}
        {/* Ticket # */}
        {visibleCols.has('ticket') && <ColHeader label="Ticket #" col="ticket" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={80} />}
        {/* Replies */}
        {visibleCols.has('replies') && <ColHeader label="Replies" col="replies" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={60} />}
        {/* Reach */}
        {visibleCols.has('reach') && <ColHeader label="Reach" col="reach" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={70} />}
        {/* Channel */}
        {visibleCols.has('channel') && <ColHeader label="Channel" col="channel" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={130} />}
        {/* Assignee spacer */}
        <div style={{ width: 28, flexShrink: 0 }} />
        {/* Time */}
        {visibleCols.has('time') && <ColHeader label="Time" col="time" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={44} />}
      </div>

      {/* Ticket rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              color: '#9ca3af',
            }}
          >
            <span style={{ fontSize: 40 }}>😎</span>
            <p style={{ fontSize: 14, margin: 0 }}>You've reached the end of the list.</p>
          </div>
        ) : (
          <>
            {filtered.map((msg) => (
              <TicketRow
                key={msg.id}
                msg={msg}
                selected={selected.has(msg.id)}
                onSelect={() => toggleSelect(msg.id)}
                active={msg.id === messageId}
                onClick={() => navigate(`/inbox/${msg.brandId}/${msg.id}`)}
                visibleCols={visibleCols}
              />
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '32px 0',
                color: '#9ca3af',
              }}
            >
              <span style={{ fontSize: 20 }}>😎</span>
              <span style={{ fontSize: 14 }}>You've reached the end of the list.</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ColHeader({
  label, col, sortCol, sortDir, onSort, width,
}: {
  label: string; col: SortCol; sortCol: SortCol; sortDir: SortDir
  onSort: (col: SortCol) => void; width: number
}) {
  const active = sortCol === col
  return (
    <button
      onClick={() => onSort(col)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width,
        flexShrink: 0,
        background: 'none',
        border: 'none',
        padding: '2px 0',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        color: active ? '#111827' : '#9ca3af',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
      {active ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
    </button>
  )
}

function TicketRow({
  msg,
  selected,
  onSelect,
  active,
  onClick,
  visibleCols,
}: {
  msg: Message
  selected: boolean
  onSelect: () => void
  active: boolean
  onClick: () => void
  visibleCols: Set<ColKey>
}) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const timeStr = format(new Date(msg.timestamp), 'HH:mm')
  const score = getPriorityScore(msg, customer)
  const tier = priorityTier(score)

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #f9fafb',
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        background: active ? '#eff6ff' : selected ? '#f0fdf4' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.1s',
        gap: 12,
        minHeight: 52,
      }}
      onMouseEnter={(e) => {
        if (!active && !selected) (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'
      }}
      onMouseLeave={(e) => {
        if (!active && !selected) (e.currentTarget as HTMLDivElement).style.background = '#fff'
      }}
    >
      {/* Checkbox */}
      <div onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#22c55e' }}
        />
      </div>

      {/* Star */}
      <div onClick={(e) => e.stopPropagation()}>
        <Star
          size={15}
          style={{
            color: msg.starred ? '#f59e0b' : '#d1d5db',
            fill: msg.starred ? '#f59e0b' : 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Platform icons (2 stacked) */}
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        <PlatformIcon platform={msg.platform} size={18} />
        {customer?.avatar ? (
          <img
            src={customer.avatar}
            style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e5e7eb' }} />
        )}
      </div>

      {/* User name */}
      <div style={{ width: 140, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: msg.unread ? 700 : 500,
            color: '#111827',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {customer?.name ?? 'Anonymous profile'}
        </span>
      </div>

      {/* Preview + tags */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 13,
            color: msg.unread ? '#111827' : '#6b7280',
            fontWeight: msg.unread ? 500 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {msg.preview}
        </span>
        {msg.tags.map((tag) => (
          <span
            key={tag.label}
            style={{
              padding: '2px 9px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 500,
              background: tag.color + '20',
              color: tag.color,
              flexShrink: 0,
              border: `1px solid ${tag.color}40`,
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Priority */}
      {visibleCols.has('priority') && (
        <div style={{ width: 72, flexShrink: 0 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '2px 8px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 500,
              background: tier.color + '15',
              color: tier.color,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
            {tier.label}
          </span>
        </div>
      )}

      {/* Ticket # */}
      {visibleCols.has('ticket') && (
        <div style={{ width: 80, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{msg.ticketNumber}</span>
        </div>
      )}

      {/* Reply count */}
      {visibleCols.has('replies') && (
        <div style={{ width: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{msg.replyCount}</span>
          {msg.newReplies > 0 && (
            <span
              style={{
                background: '#3b82f6',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                width: 18,
                height: 18,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {msg.newReplies}
            </span>
          )}
        </div>
      )}

      {/* Reach */}
      {visibleCols.has('reach') && (
        <div style={{ width: 70, flexShrink: 0, textAlign: 'right' }}>
          {customer?.totalReach ? (
            <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
              <TrendingUp size={11} style={{ color: customer.totalReach >= 10000 ? '#f59e0b' : '#d1d5db' }} />
              {customer.totalReach >= 1_000_000
                ? `${(customer.totalReach / 1_000_000).toFixed(1)}M`
                : customer.totalReach >= 1_000
                ? `${(customer.totalReach / 1_000).toFixed(1)}K`
                : customer.totalReach}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: '#e5e7eb' }}>—</span>
          )}
        </div>
      )}

      {/* Channel */}
      {visibleCols.has('channel') && (
        <div style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <PlatformIcon platform={msg.platform} size={15} />
          <span
            style={{
              fontSize: 12,
              color: '#6b7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {msg.channel}
          </span>
        </div>
      )}

      {/* Assignee avatar */}
      <div style={{ width: 28, flexShrink: 0 }}>
        {msg.assignedTo ? (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#1d4ed8',
            }}
          >
            {msg.assignedTo[0]}
          </div>
        ) : (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#f3f4f6',
              border: '1px dashed #d1d5db',
            }}
          />
        )}
      </div>

      {/* Time */}
      {visibleCols.has('time') && (
        <div style={{ width: 44, flexShrink: 0, textAlign: 'right' }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: msg.unread ? 600 : 400 }}>
            {timeStr}
          </span>
        </div>
      )}
    </div>
  )
}

const saveViewBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 12px',
  borderRadius: 6,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 12,
  fontWeight: 500,
  color: '#374151',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const bulkBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: '#fff',
  fontSize: 12,
  fontWeight: 500,
  color: '#374151',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
