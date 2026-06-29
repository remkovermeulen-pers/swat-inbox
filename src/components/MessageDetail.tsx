import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { messages, customers, brands } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { StatusBadge } from './StatusBadge'
import { SentimentBadge } from './SentimentBadge'
import {
  ArrowLeft,
  UserPlus,
  Tag,
  Forward,
  Star,
  BellOff,
  Archive,
  RefreshCw,
  ChevronDown,
  X,
  Smile,
  BookOpen,
  Link2,
  Sparkles,
  Send,
  CheckCheck,
  Clock,
  Hash,
  AtSign,
  Upload,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  MessageSquareText,
} from 'lucide-react'

function formatReach(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

function daysUntil(dateStr: string) {
  const now = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

interface Activity {
  id: string
  author: string
  action: string
  detail?: string
  time: string
}

export function MessageDetail() {
  const { messageId } = useParams()
  const navigate = useNavigate()
  const [replyText, setReplyText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [starred, setStarred] = useState(false)
  const [showAiTooltip, setShowAiTooltip] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'a1', author: 'Remko Vermeulen', action: 'wrote an internal note:', detail: 'Checked order — delayed in transit.', time: '2 minutes ago' },
  ])

  const msg = messages.find((m) => m.id === messageId)

  if (!msg) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', flexDirection: 'column', gap: 12 }}>
        <MessageSquareText size={40} style={{ color: '#d1d5db' }} />
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Select a ticket to view the conversation</p>
      </div>
    )
  }

  const customer = customers.find((c) => c.id === msg.customerId)!
  const days = daysUntil(customer.renewalDate)

  function addNote() {
    if (!noteText.trim()) return
    setActivities((prev) => [
      {
        id: String(Date.now()),
        author: 'Remko Vermeulen',
        action: 'wrote an internal note:',
        detail: noteText.trim(),
        time: 'just now',
      },
      ...prev,
    ])
    setNoteText('')
  }

  function enhanceWithAI() {
    if (!replyText.trim()) {
      setReplyText("Thank you for reaching out! We completely understand your frustration and we're already looking into this for you. Our team will have an update within the next few hours. We appreciate your patience!")
    } else {
      setReplyText((t) => t + ' We truly appreciate your loyalty and will make this right!')
    }
    setShowAiTooltip(false)
  }

  const customerMessages = msg.timeline.filter((e) => e.isCustomer)
  const latestCustomerMsg = customerMessages[customerMessages.length - 1]

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', flexDirection: 'column' }}>

      {/* ── Top action bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: '4px 6px', borderRadius: 6, fontFamily: 'inherit' }}
        >
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Ticket</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 13, color: '#374151', background: '#f9fafb' }}>
          <PlatformIcon platform={msg.platform} size={14} />
          {msg.ticketNumber}
        </span>

        <div style={{ flex: 1 }} />

        <RefreshCw size={15} style={{ color: '#9ca3af', cursor: 'pointer' }} />
        {[
          { icon: <UserPlus size={14} />, label: 'Assign to', hasDropdown: true },
          { icon: <Tag size={14} />, label: 'Tags', hasDropdown: true },
          { icon: <Forward size={14} />, label: 'Forward', hasDropdown: false },
          { icon: <Star size={14} style={{ fill: starred ? '#f59e0b' : 'none', color: starred ? '#f59e0b' : 'currentColor' }} />, label: 'Star', hasDropdown: false, onClick: () => setStarred(!starred) },
          { icon: <BellOff size={14} />, label: 'Mute', hasDropdown: false },
          { icon: <Archive size={14} />, label: 'Archive', hasDropdown: false },
        ].map(({ icon, label, hasDropdown, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 7,
              border: '1px solid #e5e7eb', background: '#fff',
              fontSize: 13, color: '#374151', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500,
            }}
          >
            {icon} {label} {hasDropdown && <ChevronDown size={12} style={{ color: '#9ca3af' }} />}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Center: thread + reply ── */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', borderRight: '1px solid #e5e7eb' }}>

          {/* Thread */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0, background: '#f9fafb' }}>
            {msg.timeline.map((event, idx) => {
              if (event.type === 'status_change') {
                return (
                  <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
                    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                      <Clock size={11} /> {event.content}
                    </span>
                    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  </div>
                )
              }

              if (event.type === 'note') {
                return (
                  <div key={event.id} style={{ margin: '10px 0', background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#065f46' }}>R</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{event.author}</span>
                      <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '1px 7px', borderRadius: 99, fontWeight: 500 }}>Internal note</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>{format(new Date(event.timestamp), 'MMM d, HH:mm')}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6, margin: 0 }}>{event.content}</p>
                  </div>
                )
              }

              if (event.type === 'ai_suggestion') return null

              const isCustomer = event.isCustomer
              const isLastCustomer = isCustomer && idx === msg.timeline.map((e, i) => ({ e, i })).filter(({ e }) => e.isCustomer).at(-1)?.i

              return (
                <div key={event.id} style={{ margin: '6px 0' }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexDirection: isCustomer ? 'row' : 'row-reverse' }}>
                    {isCustomer ? (
                      <img src={event.authorAvatar || customer.avatar} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1d4ed8' }}>R</div>
                    )}
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{event.author}</span>
                    {event.platform && <PlatformIcon platform={event.platform} size={13} />}
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{format(new Date(event.timestamp), 'MMM d · HH:mm')}</span>
                    {!isCustomer && (
                      <span style={{ fontSize: 10, color: '#6b7280', background: '#f3f4f6', padding: '1px 7px', borderRadius: 99 }}>published by you</span>
                    )}
                    <Send size={13} style={{ color: '#d1d5db', marginLeft: 4 }} />
                  </div>

                  {/* Bubble */}
                  <div style={{ display: 'flex', justifyContent: isCustomer ? 'flex-start' : 'flex-end' }}>
                    <div style={{
                      maxWidth: 520,
                      background: isCustomer ? '#fff' : '#eff6ff',
                      border: `1px solid ${isCustomer ? '#e5e7eb' : '#bfdbfe'}`,
                      borderRadius: 12,
                      borderTopLeftRadius: isCustomer ? 2 : 12,
                      borderTopRightRadius: isCustomer ? 12 : 2,
                      padding: '10px 16px',
                    }}>
                      <p style={{ fontSize: 13, color: '#111827', lineHeight: 1.65, margin: 0 }}>{event.content}</p>
                      {isCustomer && (
                        <button style={{ marginTop: 6, fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                          Translate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mark as read row — only on last customer msg if unread */}
                  {isLastCustomer && msg.unread && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingLeft: 36 }}>
                      <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                        💬 {msg.replyCount}
                        {msg.newReplies > 0 && (
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 99, border: '1px solid #bfdbfe' }}>
                            {msg.newReplies} unread
                          </span>
                        )}
                      </span>
                      <div style={{ flex: 1 }} />
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', fontSize: 12, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <CheckCheck size={14} style={{ color: '#22c55e' }} /> Mark as read <ChevronDown size={12} style={{ color: '#9ca3af' }} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Reply composer ── */}
          <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 20px', flexShrink: 0 }}>
            {latestCustomerMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '6px 10px', background: '#f9fafb', borderRadius: 7, border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>
                  Replying to <span style={{ fontWeight: 600, color: '#374151' }}>{latestCustomerMsg.author}</span>
                </span>
                <div style={{ flex: 1 }} />
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={5}
              style={{
                width: '100%', resize: 'none',
                border: '1px solid #e5e7eb', borderRadius: 8,
                padding: '10px 14px', fontSize: 13, lineHeight: 1.6,
                color: '#111827', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box', background: '#fff',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              {/* AI Enhance */}
              <div style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setShowAiTooltip(true)}
                  onMouseLeave={() => setShowAiTooltip(false)}
                  onClick={enhanceWithAI}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 7,
                    border: '1px solid #c4b5fd', background: '#faf5ff',
                    fontSize: 13, fontWeight: 600, color: '#7c3aed',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <Sparkles size={14} />
                  <span style={{ fontWeight: 700, fontStyle: 'italic' }}>AB</span>Enhance
                </button>
                {showAiTooltip && (
                  <div style={{
                    position: 'absolute', bottom: '110%', left: 0,
                    background: '#22c55e', color: '#fff',
                    fontSize: 12, fontWeight: 500, padding: '8px 12px',
                    borderRadius: 8, whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    Let AI help you with the perfect reply 🤖
                  </div>
                )}
              </div>

              <button style={iconBtn}><Smile size={16} style={{ color: '#6b7280' }} /></button>

              <button style={{ ...iconBtn, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 7 }}>
                <BookOpen size={14} style={{ color: '#6b7280' }} />
                <span style={{ fontSize: 12, color: '#374151' }}>Add preset</span>
              </button>

              <button style={{ ...iconBtn, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 7 }}>
                <Link2 size={14} style={{ color: '#6b7280' }} />
                <span style={{ fontSize: 12, color: '#374151' }}>Shorten Links</span>
              </button>

              <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>{replyText.length}</span>

              <button style={{
                padding: '7px 16px', borderRadius: 7,
                border: '1px solid #e5e7eb', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#374151',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Reply & Archive
              </button>
              <button
                disabled={!replyText.trim()}
                style={{
                  padding: '7px 20px', borderRadius: 7, border: 'none',
                  background: replyText.trim() ? '#2563eb' : '#93c5fd',
                  fontSize: 13, fontWeight: 600, color: '#fff',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                }}
              >
                Reply
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ width: 280, flexShrink: 0, background: '#fff', overflowY: 'auto' }}>
          {/* Ticket header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Ticket {msg.ticketNumber}</span>
              <StatusBadge status={msg.status} size="sm" />
            </div>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Updated {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</p>
          </div>

          {/* Ticket meta */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
            <MetaRow label="Channel">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PlatformIcon platform={msg.platform} size={16} />
                <span style={{ fontSize: 13, color: '#374151' }}>{msg.channel}</span>
              </div>
            </MetaRow>

            <MetaRow label="Assigned to">
              {msg.assignedTo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#1d4ed8' }}>
                    {msg.assignedTo[0]}
                  </div>
                  <span style={{ fontSize: 13, color: '#374151' }}>{msg.assignedTo}</span>
                </div>
              ) : (
                <button style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: '1px dashed #d1d5db', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + Assign
                </button>
              )}
            </MetaRow>

            <MetaRow label="Tags">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {msg.tags.map((tag) => (
                  <span key={tag.label} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}40` }}>
                    {tag.label} <X size={10} style={{ cursor: 'pointer' }} />
                  </span>
                ))}
                <button style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: 0, fontFamily: 'inherit' }}>
                  <Plus size={12} /> Tags
                </button>
              </div>
            </MetaRow>
          </div>

          {/* Customer info */}
          {customer.mrr > 0 && (
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Customer</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <img src={customer.avatar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>{customer.name}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{customer.email}</p>
                </div>
              </div>
              <SentimentBadge sentiment={customer.sentiment} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                <SmallMetric icon={<DollarSign size={12} style={{ color: '#16a34a' }} />} label="MRR" value={`$${customer.mrr.toLocaleString()}`} green />
                <SmallMetric icon={<Calendar size={12} style={{ color: days <= 60 ? '#dc2626' : '#6b7280' }} />} label="Renewal" value={`${days}d · ${format(new Date(customer.renewalDate), 'MMM d')}`} red={days <= 60} />
                <SmallMetric icon={<TrendingUp size={12} style={{ color: '#2563eb' }} />} label="Reach" value={formatReach(customer.totalReach)} />
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>Activity Log</p>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write an internal note..."
                rows={3}
                style={{
                  width: '100%', resize: 'none', border: 'none',
                  padding: '10px 12px', fontSize: 12, color: '#374151',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  lineHeight: 1.5,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderTop: '1px solid #f3f4f6', background: '#f9fafb' }}>
                <Hash size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                <AtSign size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                <Smile size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                <Upload size={14} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                <div style={{ flex: 1 }} />
                <button
                  onClick={addNote}
                  disabled={!noteText.trim()}
                  style={{
                    padding: '4px 12px', borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    background: noteText.trim() ? '#fff' : '#f9fafb',
                    fontSize: 12, fontWeight: 600,
                    color: noteText.trim() ? '#374151' : '#d1d5db',
                    cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                  }}
                >
                  Add note
                </button>
              </div>
            </div>
          </div>

          {/* Activities feed */}
          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>Activities</p>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                All activities <ChevronDown size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.map((a) => (
                <div key={a.id} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#1d4ed8', flexShrink: 0, marginTop: 1 }}>
                    {a.author[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#374151', margin: '0 0 3px', lineHeight: 1.4 }}>
                      <strong>{a.author}</strong> {a.action}
                    </p>
                    {a.detail && (
                      <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 3px', background: '#f3f4f6', borderRadius: 6, padding: '5px 10px' }}>
                        {a.detail}
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
  alignItems: 'center', padding: '6px', borderRadius: 6,
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: '#9ca3af', width: 80, flexShrink: 0, paddingTop: 2 }}>{label}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function SmallMetric({ icon, label, value, green, red }: { icon: React.ReactNode; label: string; value: string; green?: boolean; red?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 20, height: 20, borderRadius: 5, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <span style={{ fontSize: 12, color: '#6b7280', flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: green ? '#16a34a' : red ? '#dc2626' : '#374151' }}>{value}</span>
    </div>
  )
}
