import { NavLink } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { messages, brands, customers } from '../data/mockData'
import type { Message } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { StatusBadge } from './StatusBadge'
import { Filter } from 'lucide-react'
import { useState } from 'react'
import type { MessageStatus } from '../data/mockData'

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

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#e4e7ec]" style={{ width: 340, flexShrink: 0 }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#e4e7ec]">
        <div className="flex items-center gap-2 mb-3">
          {brand ? (
            <>
              <span className="text-xl">{brand.logo}</span>
              <div>
                <h2 className="text-sm font-semibold text-[#101828] leading-tight">{brand.name}</h2>
                <p className="text-xs text-[#98a2b3]">
                  {filtered.length} message{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-sm font-semibold text-[#101828]">All Brands</h2>
              <p className="text-xs text-[#98a2b3]">{filtered.length} messages</p>
            </div>
          )}
          <button className="ml-auto p-1.5 rounded-lg hover:bg-[#f0f2f5] text-[#98a2b3] hover:text-[#475467] transition-colors">
            <Filter size={14} />
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'unanswered', 'ai_pending', 'answered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#f0f2f5] text-[#475467] hover:bg-[#e4e7ec]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'ai_pending' ? 'AI pending' : f === 'unanswered' ? 'Unanswered' : 'Answered'}
            </button>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-medium text-[#475467]">No messages</p>
            <p className="text-xs text-[#98a2b3] mt-1">All caught up!</p>
          </div>
        ) : (
          filtered.map((msg) => <MessageRow key={msg.id} msg={msg} brandId={brandId} />)
        )}
      </div>
    </div>
  )
}

function MessageRow({ msg, brandId }: { msg: Message; brandId?: string }) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const brand = brands.find((b) => b.id === msg.brandId)
  const linkTo = brandId
    ? `/inbox/${msg.brandId}/${msg.id}`
    : `/inbox/${msg.brandId}/${msg.id}`

  return (
    <NavLink
      to={linkTo}
      className={({ isActive }) =>
        `block px-4 py-3 border-b border-[#f0f2f5] transition-colors cursor-pointer ${
          isActive ? 'bg-orange-50 border-l-2 border-l-orange-500' : 'hover:bg-[#f8f9fb]'
        }`
      }
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={customer?.avatar}
            alt={customer?.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5">
            <PlatformIcon platform={msg.platform} size={14} />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-semibold text-[#101828] truncate">{customer?.name}</span>
            {msg.unread && (
              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
            )}
            <span className="ml-auto text-[10px] text-[#98a2b3] flex-shrink-0">
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </span>
          </div>

          {!brandId && brand && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px]">{brand.logo}</span>
              <span className="text-[10px] text-[#98a2b3]">{brand.name}</span>
            </div>
          )}

          <p className="text-xs font-medium text-[#344054] truncate mb-1.5">{msg.subject}</p>
          <p className="text-[11px] text-[#98a2b3] truncate mb-2">{msg.preview}</p>

          <StatusBadge status={msg.status} size="sm" />
        </div>
      </div>
    </NavLink>
  )
}
