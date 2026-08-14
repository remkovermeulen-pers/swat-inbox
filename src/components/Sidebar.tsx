import { NavLink, useLocation } from 'react-router-dom'
import { messages } from '../data/mockData'
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
  Sparkles,
  Bell,
} from 'lucide-react'

// Comments reuses the same mock message data as Inbox in this prototype, so both counts are identical for now.
const newItemsCount = messages.filter((m) => m.unread && !m.archived).length

export function Sidebar() {
  const location = useLocation()
  const isInbox = location.pathname.startsWith('/inbox') && !location.pathname.includes('settings')
  const isComments = location.pathname.startsWith('/comments')

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

      {/* Main nav — flat, no nested sub-items (those live as filter pills atop the Inbox/Comments list) */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        <NavItem icon={<Home size={16} />} label="Home" active={false} onClick={() => {}} />
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
