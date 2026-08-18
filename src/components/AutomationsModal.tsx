import { useState } from 'react'
import { X, Zap, Bot } from 'lucide-react'
import { AUTOMATIONS, AGENT_JOBS, type AppliesTo } from '../data/mockData'

type Tab = 'automations' | 'agents'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: on ? '#2563eb' : '#d1d5db', position: 'relative', padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.15s',
        }}
      />
    </button>
  )
}

export function AutomationsModal({ unit, onClose }: { unit: AppliesTo; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('automations')
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({})

  const automations = AUTOMATIONS.filter((a) => a.appliesTo.includes(unit))
  const jobs = AGENT_JOBS.filter((j) => j.appliesTo.includes(unit))

  function isOn(id: string, fallback: boolean) {
    return enabledOverrides[id] ?? fallback
  }

  function toggle(id: string, fallback: boolean) {
    setEnabledOverrides((prev) => ({ ...prev, [id]: !isOn(id, fallback) }))
  }

  const items = tab === 'automations' ? automations : jobs

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          background: '#fff', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <Zap size={16} style={{ color: '#5e6ad2' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', flex: 1 }}>
            {unit === 'comments' ? 'Comments' : 'Tickets'} automation
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: '10px 20px 0' }}>
          <button
            onClick={() => setTab('automations')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: '8px 8px 0 0',
              border: 'none', borderBottom: `2px solid ${tab === 'automations' ? '#5e6ad2' : 'transparent'}`,
              background: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, color: tab === 'automations' ? '#111827' : '#9ca3af',
            }}
          >
            <Zap size={14} /> Automations
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 99 }}>
              {automations.length}
            </span>
          </button>
          <button
            onClick={() => setTab('agents')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: '8px 8px 0 0',
              border: 'none', borderBottom: `2px solid ${tab === 'agents' ? '#5e6ad2' : 'transparent'}`,
              background: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, color: tab === 'agents' ? '#111827' : '#9ca3af',
            }}
          >
            <Bot size={14} /> Agents
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 99 }}>
              {jobs.length}
            </span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
          {items.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
              No {tab} apply to {unit === 'comments' ? 'comments' : 'tickets'} yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                    borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 3px' }}>{item.name}</p>
                    {item.description && (
                      <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                    )}
                  </div>
                  <Toggle on={isOn(item.id, item.enabled)} onClick={() => toggle(item.id, item.enabled)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
