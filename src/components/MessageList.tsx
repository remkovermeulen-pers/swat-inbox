import { NavLink } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { messages, brands, customers } from '../data/mockData'
import type { Message, MessageStatus } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { StatusBadge } from './StatusBadge'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Props {
  brandId?: string
}

export function MessageList({ brandId }: Props) {
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all')

  const brand = brandId ? brands.find((b) => b.id === brandId) : null

  const filtered = messages
    .filter((m) => !brandId || m.brandId === brandId)
    .filter((m) => statusFilter === 'all' || m.status === statusFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const filterLabels: { value: MessageStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unanswered', label: 'Unanswered' },
    { value: 'ai_pending', label: 'AI pending' },
    { value: 'answered', label: 'Answered' },
  ]

  return (
    <div
      className="flex flex-col h-full"
      style={{ width: 320, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-3">
          {brand ? (
            <>
              <span style={{ fontSize: 18 }}>{brand.logo}</span>
              <div className="flex-1">
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {brand.name}
                </h2>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                  {filtered.length} message{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                All inboxes
              </h2>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                {filtered.length} messages
              </p>
            </div>
          )}
          <button
            style={{
              padding: '4px 6px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SlidersHorizontal size={13} />
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {filterLabels.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              style={{
                padding: '3px 10px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.1s',
                background: statusFilter === value ? '#1a7bc4' : '#f1f5f9',
                color: statusFilter === value ? '#fff' : '#475569',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 36 }}>📭</span>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>All caught up!</p>
          </div>
        ) : (
          filtered.map((msg) => <MessageRow key={msg.id} msg={msg} showBrand={!brandId} />)
        )}
      </div>
    </div>
  )
}

function MessageRow({ msg, showBrand }: { msg: Message; showBrand: boolean }) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const brand = brands.find((b) => b.id === msg.brandId)

  return (
    <NavLink
      to={`/inbox/${msg.brandId}/${msg.id}`}
      style={({ isActive }) => ({
        display: 'block',
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        textDecoration: 'none',
        background: isActive ? '#eff6ff' : '#fff',
        borderLeft: isActive ? '2px solid #1a7bc4' : '2px solid transparent',
        transition: 'background 0.1s',
      })}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={customer?.avatar}
            alt={customer?.name}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ position: 'absolute', bottom: -2, right: -2 }}>
            <PlatformIcon platform={msg.platform} size={14} />
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0f172a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {customer?.name}
            </span>
            {msg.unread && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#1a7bc4',
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 10,
                color: '#94a3b8',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </span>
          </div>

          {showBrand && brand && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <span style={{ fontSize: 11 }}>{brand.logo}</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{brand.name}</span>
            </div>
          )}

          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#334155',
              margin: '0 0 2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {msg.subject}
          </p>
          <p
            style={{
              fontSize: 11,
              color: '#94a3b8',
              margin: '0 0 8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {msg.preview}
          </p>

          <StatusBadge status={msg.status} size="sm" />
        </div>
      </div>
    </NavLink>
  )
}
