import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { brands } from '../data/mockData'
import {
  Inbox,
  BarChart2,
  Settings,
  Calendar,
  Bell,
  ChevronDown,
  Rocket,
  HelpCircle,
  GraduationCap,
  Hash,
} from 'lucide-react'

export function Sidebar() {
  const [inboxOpen, setInboxOpen] = useState(true)

  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0 border-r"
      style={{
        width: 220,
        background: '#f0f4f8',
        borderColor: '#e2e8f0',
      }}
    >
      {/* Org header */}
      <div
        className="px-3 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: '#e2e8f0' }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: '#fef3c7' }}
        >
          ⭐
        </div>
        <span
          className="text-sm font-semibold truncate flex-1"
          style={{ color: '#0f172a' }}
        >
          Remko's organisation
        </span>
        <Bell size={15} style={{ color: '#94a3b8' }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {/* Inbox */}
        <div className="mb-1">
          <button
            onClick={() => setInboxOpen(!inboxOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ color: '#475569' }}
          >
            <Inbox size={15} style={{ color: '#64748b' }} />
            <span className="flex-1 text-left">Inbox</span>
            <ChevronDown
              size={13}
              style={{
                color: '#94a3b8',
                transform: inboxOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.15s',
              }}
            />
          </button>

          {inboxOpen && (
            <div className="mt-0.5 ml-1 space-y-0.5">
              <NavLink
                to="/inbox"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive ? 'active-nav' : ''
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? '#dbeafe' : 'transparent',
                  color: isActive ? '#1a7bc4' : '#475569',
                })}
              >
                <Hash size={12} style={{ color: 'inherit', opacity: 0.7 }} />
                <span className="flex-1">All inboxes</span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#dbeafe', color: '#1a7bc4' }}
                >
                  {brands.reduce((acc, b) => acc + b.unreadCount, 0)}
                </span>
              </NavLink>

              {brands.map((brand) => (
                <NavLink
                  key={brand.id}
                  to={`/inbox/${brand.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
                  style={({ isActive }) => ({
                    background: isActive ? '#dbeafe' : 'transparent',
                    color: isActive ? '#1a7bc4' : '#475569',
                  })}
                >
                  <span className="text-sm leading-none">{brand.logo}</span>
                  <span className="flex-1 truncate">{brand.name}</span>
                  {brand.unreadCount > 0 && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: '#fee2e2', color: '#dc2626' }}
                    >
                      {brand.unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Other nav */}
        {[
          { icon: Calendar, label: 'Publisher' },
          { icon: BarChart2, label: 'Analytics' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium"
            style={{ color: '#94a3b8', cursor: 'not-allowed' }}
          >
            <Icon size={15} style={{ color: '#94a3b8' }} />
            <span>{label}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="my-2 mx-1" style={{ height: 1, background: '#e2e8f0' }} />

        <NavLink
          to="/inbox/settings"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors"
          style={({ isActive }) => ({
            background: isActive ? '#dbeafe' : 'transparent',
            color: isActive ? '#1a7bc4' : '#475569',
          })}
        >
          <Settings size={15} style={{ color: 'inherit', opacity: 0.7 }} />
          <span>Brand Settings</span>
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 space-y-1" style={{ borderTop: '1px solid #e2e8f0' }}>
        {/* Trial badge */}
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs"
          style={{ background: '#eff6ff', color: '#1a7bc4' }}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-[10px]"
            style={{ background: '#1a7bc4' }}
          >
            2
          </span>
          <span style={{ color: '#475569' }}>Days left on trial</span>
        </div>

        {/* Upgrade */}
        <button
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors hover:opacity-90"
          style={{ background: '#d1fae5', color: '#065f46' }}
        >
          <Rocket size={13} />
          Upgrade
        </button>

        {/* User */}
        <div className="flex items-center gap-2 px-1 py-1">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: '#1a7bc4' }}
          >
            R
          </div>
          <span className="text-xs font-medium truncate" style={{ color: '#334155' }}>
            Remko Vermeulen
          </span>
        </div>

        {/* Help row */}
        <div className="flex items-center gap-1 px-1">
          <button
            className="flex items-center gap-1 text-[11px] hover:underline"
            style={{ color: '#64748b' }}
          >
            <HelpCircle size={11} /> Helpcenter
          </button>
          <span style={{ color: '#cbd5e1' }}>·</span>
          <button
            className="flex items-center gap-1 text-[11px] hover:underline"
            style={{ color: '#64748b' }}
          >
            <GraduationCap size={11} /> Tutorials
          </button>
        </div>
      </div>
    </aside>
  )
}
