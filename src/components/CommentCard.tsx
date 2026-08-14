import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, Reply as ReplyIcon, Repeat2, ThumbsUp, Pin, CornerDownRight, Trash2 } from 'lucide-react'
import type { Customer, Message } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'

interface Props {
  msg: Message
  customer: Customer | undefined
  selected: boolean
  onSelect: () => void
  active: boolean
  onClick: () => void
}

export function CommentCard({ msg, customer, selected, onSelect, active, onClick }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 4, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#22c55e' }}
        />
        <img
          src={customer?.avatar}
          style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover', background: '#e5e7eb' }}
        />
      </div>

      <div
        onClick={onClick}
        style={{
          flex: 1, minWidth: 0, cursor: 'pointer',
        }}
      >
        <div
          style={{
            border: `1.5px solid ${active ? '#2563eb' : '#93c5fd'}`,
            borderRadius: 12, padding: '12px 16px', background: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{customer?.name ?? 'Anonymous'}</span>
            <div style={{ flex: 1 }} />
            <button
              onClick={(e) => { e.stopPropagation(); onClick() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7,
                border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, fontWeight: 500, color: '#374151',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Show Ticket <PlatformIcon platform={msg.platform} size={14} />
            </button>
            <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
              <Pin size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8, color: '#6b7280', fontSize: 12 }}>
            <CornerDownRight size={12} />
            <PlatformIcon platform={msg.platform} size={14} />
            {msg.channel}
          </div>

          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>
            {msg.preview}
          </p>

          <button
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', display: 'block' }}
          >
            Translate
          </button>

          {msg.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {msg.tags.map((tag) => (
                <span
                  key={tag.label}
                  style={{
                    padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: '#ffedd5', color: '#c2410c',
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            <ExternalLink size={11} />
          </span>
          <button onClick={(e) => e.stopPropagation()} style={actionBtnStyle}>
            <ReplyIcon size={13} /> Reply
          </button>
          <button onClick={(e) => e.stopPropagation()} style={actionBtnStyle}>
            <Repeat2 size={13} /> Repost
          </button>
          <button onClick={(e) => e.stopPropagation()} style={actionBtnStyle}>
            <ThumbsUp size={13} /> Like
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', display: 'flex' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

const actionBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280',
  background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
}
