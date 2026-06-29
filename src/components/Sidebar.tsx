import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { brands, channels, messages } from '../data/mockData'
import type { InboxFilter } from '../data/mockData'
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Calendar,
  BarChart2,
  FileBarChart,
  Settings,
  GraduationCap,
  ChevronDown,
  Star,
  UserCheck,
  Users,
  Archive,
  Sparkles,
  Bell,
} from 'lucide-react'

const filterCounts: Record<InboxFilter, number> = {
  all: messages.length,
  new: messages.filter((m) => m.unread).length,
  starred: messages.filter((m) => m.starred).length,
  assigned_me: messages.filter((m) => m.assignedTo === 'Remko').length,
  assigned_others: messages.filter((m) => m.assignedTo && m.assignedTo !== 'Remko').length,
  archive: 999,
}

interface Props {
  activeFilter: InboxFilter
  onFilterChange: (f: InboxFilter) => void
  activeBrandId: string | null
  onBrandChange: (id: string | null) => void
  activeChannelId: string | null
  onChannelChange: (id: string | null) => void
}

export function Sidebar({
  activeFilter,
  onFilterChange,
  activeBrandId,
  onBrandChange,
  activeChannelId,
  onChannelChange,
}: Props) {
  const [inboxOpen, setInboxOpen] = useState(true)
  const [channelsOpen, setChannelsOpen] = useState(true)
  const location = useLocation()
  const isInbox = location.pathname.startsWith('/inbox') && !location.pathname.includes('settings')

  const totalUnread = messages.reduce((a, m) => a + (m.unread ? 1 : 0), 0)

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
        {/* Dashboard */}
        <NavItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          active={false}
          onClick={() => {}}
        />

        {/* Inbox */}
        <div>
          <button
            onClick={() => setInboxOpen(!inboxOpen)}
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
              {/* Brand sub-items */}
              {brands.map((brand) => (
                <div key={brand.id}>
                  <button
                    onClick={() => onBrandChange(activeBrandId === brand.id ? null : brand.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeBrandId === brand.id ? '#f0fdf4' : 'transparent',
                      color: activeBrandId === brand.id ? '#15803d' : '#374151',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{brand.logo}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {brand.name}
                    </span>
                    {brand.unreadCount > 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#6b7280',
                          minWidth: 18,
                          textAlign: 'right',
                        }}
                      >
                        {brand.unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Filter sub-items under brand */}
                  {activeBrandId === brand.id && (
                    <div style={{ marginLeft: 12 }}>
                      {(
                        [
                          { f: 'new' as InboxFilter, icon: <Sparkles size={13} />, label: 'New', count: filterCounts.new },
                          { f: 'starred' as InboxFilter, icon: <Star size={13} />, label: 'Starred', count: filterCounts.starred },
                          { f: 'assigned_me' as InboxFilter, icon: <UserCheck size={13} />, label: 'Assigned to me', count: filterCounts.assigned_me, dot: true },
                          { f: 'assigned_others' as InboxFilter, icon: <Users size={13} />, label: 'Assigned to others', count: filterCounts.assigned_others },
                          { f: 'archive' as InboxFilter, icon: <Archive size={13} />, label: 'Archive', count: filterCounts.archive },
                        ] as const
                      ).map(({ f, icon, label, count, dot }) => (
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
                            color: activeFilter === f ? '#15803d' : '#6b7280',
                            fontFamily: 'inherit',
                            fontSize: 12,
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
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <NavItem icon={<MessageSquare size={16} />} label="Comments" active={false} onClick={() => {}} />
        <NavItem icon={<Calendar size={16} />} label="Publisher" active={false} onClick={() => {}} />
        <NavItem icon={<BarChart2 size={16} />} label="Analytics" active={false} onClick={() => {}} />
        <NavItem icon={<FileBarChart size={16} />} label="Reports" active={false} onClick={() => {}} />

        {/* Channels */}
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => setChannelsOpen(!channelsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 11,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textAlign: 'left',
            }}
          >
            <ChevronDown
              size={12}
              style={{
                transform: channelsOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.15s',
              }}
            />
            Channels
          </button>

          {channelsOpen && (
            <div style={{ marginTop: 2 }}>
              {channels.map((ch) => {
                const active = activeChannelId === ch.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => onChannelChange(active ? null : ch.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? '#f0fdf4' : 'transparent',
                      fontFamily: 'inherit',
                      fontSize: 12,
                      color: active ? '#15803d' : '#374151',
                      textAlign: 'left',
                      fontWeight: 400,
                    }}
                  >
                    {/* Checkbox */}
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: `2px solid ${active ? '#22c55e' : '#d1d5db'}`,
                        background: active ? '#22c55e' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {active && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <PlatformDot platform={ch.platform} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ch.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

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
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
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
      {label}
    </button>
  )
}

function PlatformDot({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    facebook: '#1877f2',
    twitter: '#000',
    instagram: '#e1306c',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    tiktok: '#000',
  }
  const icons: Record<string, string> = {
    facebook: 'f',
    twitter: '𝕏',
    instagram: '◎',
    linkedin: 'in',
    youtube: '▶',
    tiktok: '♪',
  }
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: 3,
        background: colors[platform] || '#6b7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 9,
        color: '#fff',
        fontWeight: 700,
      }}
    >
      {icons[platform] || '?'}
    </span>
  )
}
