import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { messages, customers, brands, channels } from '../data/mockData'
import type { Message, InboxFilter } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { StatusBadge } from './StatusBadge'
import {
  Search,
  Download,
  ChevronDown,
  RefreshCw,
  Star,
} from 'lucide-react'

interface Props {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
}

export function TicketList({ brandId, channelId, filter }: Props) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortFilter, setSortFilter] = useState<'All' | 'Unanswered' | 'AI pending' | 'Answered'>('All')

  const channel = channelId ? channels.find((c) => c.id === channelId) : null

  let filtered = messages
    .filter((m) => !brandId || m.brandId === brandId)
    .filter((m) => !channelId || (channel && m.channel === channel.name && m.platform === channel.platform))
    .filter((m) => {
      if (filter === 'new') return m.unread
      if (filter === 'starred') return m.starred
      if (filter === 'assigned_me') return m.assignedTo === 'Remko'
      if (filter === 'assigned_others') return m.assignedTo && m.assignedTo !== 'Remko'
      if (filter === 'archive') return false
      return true
    })
    .filter((m) => {
      if (sortFilter === 'Unanswered') return m.status === 'unanswered'
      if (sortFilter === 'AI pending') return m.status === 'ai_pending'
      if (sortFilter === 'Answered') return m.status === 'answered'
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

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

  const headerLabel = brandId
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

        {/* Status filter dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              background: '#fff',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {sortFilter} <ChevronDown size={13} style={{ color: '#9ca3af' }} />
          </button>
        </div>

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
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Sort by: Newest</span>
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
        <RefreshCw size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
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

function TicketRow({
  msg,
  selected,
  onSelect,
  active,
  onClick,
}: {
  msg: Message
  selected: boolean
  onSelect: () => void
  active: boolean
  onClick: () => void
}) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const brand = brands.find((b) => b.id === msg.brandId)
  const timeStr = format(new Date(msg.timestamp), 'HH:mm')

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

      {/* Ticket # */}
      <div style={{ width: 80, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{msg.ticketNumber}</span>
      </div>

      {/* Reply count */}
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

      {/* Channel */}
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
      <div style={{ width: 44, flexShrink: 0, textAlign: 'right' }}>
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: msg.unread ? 600 : 400 }}>
          {timeStr}
        </span>
      </div>
    </div>
  )
}
