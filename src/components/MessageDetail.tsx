import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { messages, customers, brands } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { StatusBadge } from './StatusBadge'
import { SentimentBadge } from './SentimentBadge'
import {
  Send,
  Check,
  X,
  Sparkles,
  TrendingUp,
  Calendar,
  DollarSign,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
  Pencil,
  ChevronRight,
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

export function MessageDetail() {
  const { messageId } = useParams()
  const [replyText, setReplyText] = useState('')
  const [approvedAI, setApprovedAI] = useState(false)
  const [rejectedAI, setRejectedAI] = useState(false)

  const msg = messages.find((m) => m.id === messageId)
  if (!msg) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <MessageSquareText size={40} style={{ color: '#cbd5e1' }} />
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Select a conversation</p>
      </div>
    )
  }

  const customer = customers.find((c) => c.id === msg.customerId)!
  const brand = brands.find((b) => b.id === msg.brandId)!
  const days = daysUntil(customer.renewalDate)
  const aiEvent = msg.timeline.find((t) => t.type === 'ai_suggestion')

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Timeline column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          background: '#f8fafc',
        }}
      >
        {/* Conversation header */}
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            padding: '12px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={customer.avatar}
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', bottom: -2, right: -2 }}>
                <PlatformIcon platform={msg.platform} size={15} />
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 0 3px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {msg.subject}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {customer.name} · {brand.logo} {brand.name}
                </span>
                <StatusBadge status={msg.status} size="sm" />
              </div>
            </div>
            <button
              style={{
                padding: '5px 6px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {msg.timeline.map((event, idx) => {
            /* Status change */
            if (event.type === 'status_change') {
              return (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    <Clock size={11} /> {event.content}
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>
              )
            }

            /* AI suggestion */
            if (event.type === 'ai_suggestion') {
              if (approvedAI || rejectedAI) return null
              return (
                <div
                  key={event.id}
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>
                      AI Draft — Pending Approval
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#b45309' }}>
                      {format(new Date(event.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#78350f',
                      lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.6)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      margin: '0 0 14px',
                    }}
                  >
                    {event.aiSuggestion}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setApprovedAI(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={13} /> Approve & Send
                    </button>
                    <button
                      onClick={() => { setRejectedAI(true); setReplyText(event.aiSuggestion || '') }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        background: '#fff',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={13} /> Edit first
                    </button>
                    <button
                      onClick={() => setRejectedAI(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        background: 'transparent',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              )
            }

            /* Internal note */
            if (event.type === 'note') {
              return (
                <div key={event.id} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>📝</span>
                    </div>
                    {idx < msg.timeline.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: '#e2e8f0', marginTop: 6 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{event.author}</span>
                      <span
                        style={{
                          fontSize: 10,
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '1px 7px',
                          borderRadius: 99,
                          fontWeight: 500,
                        }}
                      >
                        Internal note
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>
                        {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div
                      style={{
                        background: '#fefce8',
                        border: '1px solid #fde68a',
                        borderRadius: 10,
                        padding: '10px 14px',
                      }}
                    >
                      <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6, margin: 0 }}>
                        {event.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            }

            /* Customer / agent message */
            const isCustomer = event.isCustomer
            return (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  flexDirection: isCustomer ? 'row' : 'row-reverse',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {isCustomer ? (
                    <img
                      src={event.authorAvatar || customer.avatar}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#1a7bc4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>R</span>
                    </div>
                  )}
                  {idx < msg.timeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: '#e2e8f0', marginTop: 6 }} />
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    paddingBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCustomer ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                      flexDirection: isCustomer ? 'row' : 'row-reverse',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{event.author}</span>
                    {event.platform && <PlatformIcon platform={event.platform} size={13} />}
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div
                    style={{
                      maxWidth: 480,
                      borderRadius: 12,
                      padding: '10px 14px',
                      background: isCustomer ? '#fff' : '#1a7bc4',
                      border: isCustomer ? '1px solid #e2e8f0' : 'none',
                      borderTopLeftRadius: isCustomer ? 2 : 12,
                      borderTopRightRadius: isCustomer ? 12 : 2,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: isCustomer ? '#0f172a' : '#fff',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {event.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {approvedAI && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>
                AI reply approved and sent
              </span>
            </div>
          )}
        </div>

        {/* Reply composer */}
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 16px',
          }}
        >
          {msg.status === 'ai_pending' && !approvedAI && !rejectedAI && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <AlertCircle size={12} style={{ color: '#d97706' }} />
              <span style={{ fontSize: 11, color: '#b45309' }}>An AI draft is waiting for your review above</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              style={{
                flex: 1,
                resize: 'none',
                fontSize: 13,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#0f172a',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                disabled={!replyText.trim()}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: replyText.trim() ? '#1a7bc4' : '#e2e8f0',
                  color: replyText.trim() ? '#fff' : '#94a3b8',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={15} />
              </button>
              <button
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Generate AI draft"
              >
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer profile sidebar */}
      <div
        style={{
          width: 268,
          flexShrink: 0,
          background: '#fff',
          borderLeft: '1px solid #e2e8f0',
          overflowY: 'auto',
        }}
      >
        {/* Customer */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <img
              src={customer.avatar}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{customer.name}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{customer.email}</p>
            </div>
          </div>
          <SentimentBadge sentiment={customer.sentiment} />
        </div>

        {/* Account metrics */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
            Account
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MetricRow
              icon={<DollarSign size={13} style={{ color: '#16a34a' }} />}
              label="MRR"
              value={`$${customer.mrr.toLocaleString()}`}
              valueStyle={{ color: '#16a34a', fontWeight: 700 }}
            />
            <MetricRow
              icon={<Calendar size={13} style={{ color: days <= 60 ? '#dc2626' : '#64748b' }} />}
              label="Renewal"
              value={`${days}d · ${format(new Date(customer.renewalDate), 'MMM d')}`}
              valueStyle={days <= 60 ? { color: '#dc2626', fontWeight: 600 } : {}}
            />
            <MetricRow
              icon={<TrendingUp size={13} style={{ color: '#1a7bc4' }} />}
              label="Social reach"
              value={formatReach(customer.totalReach)}
            />
          </div>
        </div>

        {/* Social profiles */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
            Social profiles
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {customer.socialProfiles.map((profile) => (
              <div key={profile.platform} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlatformIcon platform={profile.platform} size={20} />
                <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>{profile.handle}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>
                  {formatReach(profile.followers)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand tone */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              Brand tone
            </p>
            <a
              href={`/inbox/settings`}
              style={{ fontSize: 11, color: '#1a7bc4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              Edit <ChevronRight size={11} />
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{brand.logo}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>{brand.name}</span>
          </div>
          <p
            style={{
              fontSize: 11,
              color: '#64748b',
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {brand.settings.toneOfVoice}
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricRow({
  icon,
  label,
  value,
  valueStyle = {},
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12, color: '#334155', ...valueStyle }}>{value}</span>
    </div>
  )
}
