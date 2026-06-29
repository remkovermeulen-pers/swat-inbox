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
  Users,
  ChevronRight,
  MoreHorizontal,
  Reply,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Pencil,
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
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-sm font-medium text-[#475467]">Select a message to view</p>
        </div>
      </div>
    )
  }

  const customer = customers.find((c) => c.id === msg.customerId)!
  const brand = brands.find((b) => b.id === msg.brandId)!
  const days = daysUntil(customer.renewalDate)
  const aiEvent = msg.timeline.find((t) => t.type === 'ai_suggestion')

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Timeline column */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#f8f9fb]">
        {/* Header */}
        <div className="bg-white border-b border-[#e4e7ec] px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5">
                <PlatformIcon platform={msg.platform} size={16} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-sm font-semibold text-[#101828]">{msg.subject}</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#98a2b3]">
                  {customer.name} · {brand.logo} {brand.name}
                </span>
                <StatusBadge status={msg.status} size="sm" />
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-[#f0f2f5] text-[#98a2b3] transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {msg.timeline.map((event, idx) => {
            if (event.type === 'status_change') {
              return (
                <div key={event.id} className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#e4e7ec]" />
                  <span className="text-[11px] text-[#98a2b3] whitespace-nowrap flex items-center gap-1">
                    <Clock size={11} />
                    {event.content}
                  </span>
                  <div className="flex-1 h-px bg-[#e4e7ec]" />
                </div>
              )
            }

            if (event.type === 'ai_suggestion') {
              if (approvedAI || rejectedAI) return null
              return (
                <div key={event.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-amber-800">AI Draft — Pending Approval</span>
                    <span className="ml-auto text-[10px] text-amber-600">
                      {format(new Date(event.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed mb-4 bg-white/60 rounded-lg px-3 py-2.5">
                    {event.aiSuggestion}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApprovedAI(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check size={13} />
                      Approve & Send
                    </button>
                    <button
                      onClick={() => { setRejectedAI(true); setReplyText(event.aiSuggestion || '') }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#475467] text-xs font-medium rounded-lg border border-[#e4e7ec] hover:bg-[#f0f2f5] transition-colors"
                    >
                      <Pencil size={13} />
                      Edit before sending
                    </button>
                    <button
                      onClick={() => setRejectedAI(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X size={13} />
                      Reject
                    </button>
                  </div>
                </div>
              )
            }

            if (event.type === 'note') {
              return (
                <div key={event.id} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={13} className="text-yellow-700" />
                    </div>
                    {idx < msg.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#e4e7ec] mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#344054]">{event.author}</span>
                      <span className="text-[10px] text-[#98a2b3]">Internal note</span>
                      <span className="ml-auto text-[10px] text-[#98a2b3]">
                        {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3.5 py-2.5">
                      <p className="text-xs text-yellow-800 leading-relaxed">{event.content}</p>
                    </div>
                  </div>
                </div>
              )
            }

            const isCustomer = event.isCustomer
            return (
              <div key={event.id} className={`flex gap-2.5 ${isCustomer ? '' : 'flex-row-reverse'}`}>
                <div className="flex flex-col items-center">
                  <div className="relative flex-shrink-0">
                    {isCustomer ? (
                      <img
                        src={event.authorAvatar || customer.avatar}
                        alt={event.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                    )}
                  </div>
                  {idx < msg.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-[#e4e7ec] mt-2" />
                  )}
                </div>
                <div className={`flex-1 pb-4 ${isCustomer ? '' : 'flex flex-col items-end'}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${isCustomer ? '' : 'flex-row-reverse'}`}>
                    <span className="text-xs font-semibold text-[#344054]">{event.author}</span>
                    {event.platform && <PlatformIcon platform={event.platform} size={13} />}
                    <span className="text-[10px] text-[#98a2b3]">
                      {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-md ${
                      isCustomer
                        ? 'bg-white border border-[#e4e7ec] text-[#101828] rounded-tl-sm'
                        : 'bg-orange-500 text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{event.content}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {approvedAI && (
            <div className="flex items-center gap-2 py-2 justify-center">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs text-green-700 font-medium">AI reply approved and sent</span>
            </div>
          )}
        </div>

        {/* Reply box */}
        <div className="bg-white border-t border-[#e4e7ec] px-4 py-3">
          {msg.status === 'ai_pending' && !approvedAI && !rejectedAI && (
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle size={12} className="text-amber-500" />
              <span className="text-xs text-amber-700">An AI draft is waiting for your review above</span>
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="flex-1 resize-none text-sm border border-[#e4e7ec] rounded-xl px-3 py-2 text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
            <div className="flex flex-col gap-2">
              <button
                disabled={!replyText.trim()}
                className="p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={15} />
              </button>
              <button className="p-2.5 rounded-xl bg-[#f0f2f5] text-[#475467] hover:bg-[#e4e7ec] transition-colors">
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-l border-[#e4e7ec] overflow-y-auto">
        {/* Customer header */}
        <div className="px-4 py-5 border-b border-[#e4e7ec]">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#101828]">{customer.name}</p>
              <p className="text-xs text-[#98a2b3]">{customer.email}</p>
            </div>
          </div>
          <SentimentBadge sentiment={customer.sentiment} />
        </div>

        {/* Key metrics */}
        <div className="px-4 py-4 border-b border-[#e4e7ec]">
          <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">Account</p>
          <div className="space-y-3">
            <MetricRow
              icon={<DollarSign size={14} className="text-green-600" />}
              label="MRR"
              value={`$${customer.mrr.toLocaleString()}`}
              valueClass="text-green-700 font-semibold"
            />
            <MetricRow
              icon={<Calendar size={14} className={days <= 60 ? 'text-red-500' : 'text-[#475467]'} />}
              label="Renewal"
              value={`${days}d (${format(new Date(customer.renewalDate), 'MMM d')})`}
              valueClass={days <= 60 ? 'text-red-600 font-semibold' : ''}
            />
            <MetricRow
              icon={<TrendingUp size={14} className="text-blue-500" />}
              label="Social reach"
              value={formatReach(customer.totalReach)}
            />
          </div>
        </div>

        {/* Social profiles */}
        <div className="px-4 py-4 border-b border-[#e4e7ec]">
          <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider mb-3">Social profiles</p>
          <div className="space-y-2">
            {customer.socialProfiles.map((profile) => (
              <div key={profile.platform} className="flex items-center gap-2">
                <PlatformIcon platform={profile.platform} size={20} />
                <span className="text-xs text-[#475467] flex-1">{profile.handle}</span>
                <span className="text-xs font-medium text-[#344054]">
                  {formatReach(profile.followers)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand settings preview */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[#98a2b3] uppercase tracking-wider">Brand tone</p>
            <a
              href={`/inbox/settings?brand=${brand.id}`}
              className="text-[10px] text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
            >
              Edit <ChevronRight size={10} />
            </a>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{brand.logo}</span>
            <span className="text-xs font-medium text-[#344054]">{brand.name}</span>
          </div>
          <p className="text-[11px] text-[#475467] leading-relaxed line-clamp-3">
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
  valueClass = '',
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-[#f8f9fb] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-xs text-[#475467] flex-1">{label}</span>
      <span className={`text-xs text-[#344054] ${valueClass}`}>{value}</span>
    </div>
  )
}
