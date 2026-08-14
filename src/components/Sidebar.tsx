import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { messages } from '../data/mockData'
import type { InboxFilter } from '../data/mockData'
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
  Star,
  UserCheck,
  Users,
  Archive,
  Sparkles,
  Bell,
  Pin,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  CheckCheck,
} from 'lucide-react'

const filterCounts: Record<InboxFilter, number> = {
  all: messages.length,
  new: messages.filter((m) => m.unread).length,
  starred: messages.filter((m) => m.starred).length,
  assigned_me: messages.filter((m) => m.assignedTo === 'Remko').length,
  assigned_others: messages.filter((m) => m.assignedTo && m.assignedTo !== 'Remko').length,
  archive: 999,
}

const commentCounts = {
  unread: messages.filter((m) => m.unread).length,
  pinned: messages.filter((m) => m.starred).length,
  actionRequired: messages.filter((m) => m.status === 'ai_pending').length,
}

interface Props {
  activeFilter: InboxFilter
  onFilterChange: (f: InboxFilter) => void
}

export function Sidebar({
  activeFilter,
  onFilterChange,
}: Props) {
  const [inboxOpen, setInboxOpen] = useState(true)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isInbox = location.pathname.startsWith('/inbox') && !location.pathname.includes('settings')

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

      {/* Main nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {/* Home */}
        <NavItem
          icon={<Home size={16} />}
          label="Home"
          active={false}
          onClick={() => {}}
        />

        {/* Inbox */}
        <div>
          <button
            onClick={() => { navigate('/inbox'); setInboxOpen(true) }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: isInbox && !location.pathname.includes('settings') ? '#f0fdf4' : 'transparent',
              color: '#111827',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: isInbox ? 600 : 500,
              textAlign: 'left',
            }}
          >
            <Inbox size={16} style={{ color: '#6b7280' }} />
            <span style={{ flex: 1 }}>Inbox</span>
            <ChevronDown
              size={13}
              style={{
                color: '#9ca3af',
                transform: inboxOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.15s',
              }}
            />
          </button>

          {inboxOpen && (
            <div style={{ marginLeft: 8, marginTop: 2 }}>
              {(
                [
                  { f: 'new' as InboxFilter, icon: <Sparkles size={13} />, label: 'New', count: filterCounts.new },
                  { f: 'starred' as InboxFilter, icon: <Star size={13} />, label: 'Starred', count: filterCounts.starred },
                  { f: 'assigned_me' as InboxFilter, icon: <UserCheck size={13} />, label: 'Assigned to me', count: filterCounts.assigned_me, dot: true },
                  { f: 'assigned_others' as InboxFilter, icon: <Users size={13} />, label: 'Assigned to others', count: filterCounts.assigned_others },
                  { f: 'archive' as InboxFilter, icon: <Archive size={13} />, label: 'Archive', count: filterCounts.archive },
                ] as const
              ).map(({ f, icon, label, count, ...rest }) => {
                const dot = 'dot' in rest ? rest.dot : false
                return (
                <button
                  key={f}
                  onClick={() => onFilterChange(f)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeFilter === f ? '#f0fdf4' : 'transparent',
                    color: activeFilter === f ? '#15803d' : '#374151',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: 'left',
                  }}
                >
                  {icon}
                  <span style={{ flex: 1 }}>{label}</span>
                  {dot && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#22c55e',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {count > 0 && !dot && (
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
                      {count > 999 ? '999+' : count}
                    </span>
                  )}
                </button>
              )})}
            </div>
          )}
        </div>

        {/* Comments */}
        <div>
          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#111827',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'left',
            }}
          >
            <MessageSquare size={16} style={{ color: '#6b7280' }} />
            <span style={{ flex: 1 }}>Comments</span>
            <ChevronDown
              size={13}
              style={{
                color: '#9ca3af',
                transform: commentsOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.15s',
              }}
            />
          </button>

          {commentsOpen && (
            <div style={{ marginLeft: 8, marginTop: 2 }}>
              {(
                [
                  { icon: <UserCheck size={13} />, label: 'Unread', count: commentCounts.unread },
                  { icon: <Pin size={13} />, label: 'Pinned', count: commentCounts.pinned },
                  { icon: <AlertCircle size={13} />, label: 'Action required', count: commentCounts.actionRequired },
                  { icon: <Eye size={13} />, label: 'Visible', count: 0 },
                  { icon: <EyeOff size={13} />, label: 'Hidden', count: 0 },
                  { icon: <Trash2 size={13} />, label: 'Deleted', count: 0 },
                  { icon: <CheckCheck size={13} />, label: 'Read', count: 0 },
                ] as const
              ).map(({ icon, label, count }) => (
                <button
                  key={label}
                  onClick={() => {}}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: '#374151',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: 'left',
                  }}
                >
                  {icon}
                  <span style={{ flex: 1 }}>{label}</span>
                  {count > 0 && (
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{count}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

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
        <NavItem icon={<BarChart2 size={16} />} label="Insights" active={false} onClick={() => {}} />
        <NavItem
          icon={<Folder size={16} />}
          label="Library"
          badge="BETA"
          active={false}
          onClick={() => {}}
        />

        {/* Brand settings */}
        <div style={{ marginTop: 8 }}>
          <NavLink
            to="/inbox/settings"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? '#15803d' : '#6b7280',
              background: isActive ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
            })}
          >
            <Sparkles size={14} style={{ color: 'inherit' }} />
            AI / Brand Settings
          </NavLink>
        </div>
      </nav>

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
