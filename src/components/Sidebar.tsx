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
  Hash,
} from 'lucide-react'

export function Sidebar() {
  const [inboxOpen, setInboxOpen] = useState(true)

  return (
    <aside className="w-60 bg-[#0f1117] flex flex-col h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/8">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">Swat.io</span>
        <div className="ml-auto">
          <Bell size={16} className="text-white/40" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Inbox section */}
        <div className="mb-1">
          <button
            onClick={() => setInboxOpen(!inboxOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-colors text-sm font-medium"
          >
            <Inbox size={16} />
            <span className="flex-1 text-left">Inbox</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${inboxOpen ? '' : '-rotate-90'}`}
            />
          </button>

          {inboxOpen && (
            <div className="ml-2 mt-0.5 space-y-0.5">
              <NavLink
                to="/inbox"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-orange-500/15 text-orange-400'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`
                }
              >
                <Hash size={13} />
                <span className="flex-1">All brands</span>
                <span className="bg-white/10 text-white/60 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {brands.reduce((acc, b) => acc + b.unreadCount, 0)}
                </span>
              </NavLink>

              {brands.map((brand) => (
                <NavLink
                  key={brand.id}
                  to={`/inbox/${brand.id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-400'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`
                  }
                >
                  <span className="text-sm leading-none">{brand.logo}</span>
                  <span className="flex-1 truncate">{brand.name}</span>
                  {brand.unreadCount > 0 && (
                    <span className="bg-orange-500/20 text-orange-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {brand.unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Other nav items */}
        {[
          { icon: Calendar, label: 'Publisher' },
          { icon: BarChart2, label: 'Analytics' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 text-sm cursor-not-allowed"
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-white/8">
        <NavLink
          to="/inbox/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'text-orange-400' : 'text-white/40 hover:text-white/70'
            }`
          }
        >
          <Settings size={16} />
          <span>Brand Settings</span>
        </NavLink>
        <div className="mt-3 px-3 flex items-center gap-2.5">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="You"
            className="w-7 h-7 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium truncate">Remko V.</p>
            <p className="text-white/30 text-[10px] truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
