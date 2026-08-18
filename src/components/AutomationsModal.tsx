import { useState } from 'react'
import { X, Zap, Bot, Plus, Pencil, Trash2 } from 'lucide-react'
import type { Automation, AgentJob, AppliesTo } from '../data/mockData'

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

export function AutomationsModal({
  unit, automations, onChangeAutomations, agentJobs, onChangeAgentJobs, onClose,
}: {
  unit: AppliesTo
  automations: Automation[]
  onChangeAutomations: (next: Automation[]) => void
  agentJobs: AgentJob[]
  onChangeAgentJobs: (next: AgentJob[]) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState<Tab>('automations')

  const visibleAutomations = automations.filter((a) => a.appliesTo.includes(unit))
  const visibleJobs = agentJobs.filter((j) => j.appliesTo.includes(unit))
  const items = tab === 'automations' ? visibleAutomations : visibleJobs
  const noun = tab === 'automations' ? 'automation' : 'job'

  function addItem() {
    const name = window.prompt(`Name for the new ${noun}:`)
    if (!name?.trim()) return
    const description = window.prompt('Description (optional):')?.trim() ?? ''
    if (tab === 'automations') {
      const newItem: Automation = { id: `auto-${Date.now()}`, name: name.trim(), description, appliesTo: [unit], enabled: true }
      onChangeAutomations([...automations, newItem])
    } else {
      const newItem: AgentJob = { id: `job-${Date.now()}`, name: name.trim(), description, appliesTo: [unit], enabled: true }
      onChangeAgentJobs([...agentJobs, newItem])
    }
  }

  function editItem(item: Automation | AgentJob) {
    const name = window.prompt('Name:', item.name)
    if (!name?.trim()) return
    const description = window.prompt('Description:', item.description)
    const updated = { ...item, name: name.trim(), description: description?.trim() ?? item.description }
    if (tab === 'automations') onChangeAutomations(automations.map((a) => (a.id === item.id ? (updated as Automation) : a)))
    else onChangeAgentJobs(agentJobs.map((j) => (j.id === item.id ? (updated as AgentJob) : j)))
  }

  function deleteItem(item: Automation | AgentJob) {
    if (!window.confirm(`Delete "${item.name}"?`)) return
    if (tab === 'automations') onChangeAutomations(automations.filter((a) => a.id !== item.id))
    else onChangeAgentJobs(agentJobs.filter((j) => j.id !== item.id))
  }

  function toggleItem(item: Automation | AgentJob) {
    const updated = { ...item, enabled: !item.enabled }
    if (tab === 'automations') onChangeAutomations(automations.map((a) => (a.id === item.id ? (updated as Automation) : a)))
    else onChangeAgentJobs(agentJobs.map((j) => (j.id === item.id ? (updated as AgentJob) : j)))
  }

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
          width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 20px 0' }}>
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
              {visibleAutomations.length}
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
              {visibleJobs.length}
            </span>
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={addItem}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7,
              border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8,
            }}
          >
            <Plus size={13} /> Add new {noun}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
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
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 0',
                    borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 3px' }}>{item.name}</p>
                    {item.description && (
                      <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                    )}
                  </div>
                  <button
                    title="Edit"
                    onClick={() => editItem(item)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff',
                      color: '#6b7280', cursor: 'pointer',
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => deleteItem(item)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff',
                      color: '#6b7280', cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <Toggle on={item.enabled} onClick={() => toggleItem(item)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
