import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const ICONS = ['🔥', '⭐', '💳', '🚨', '📌', '🧭', '💬', '🛑']

export function CreateViewModal({
  onCreate,
  onClose,
}: {
  onCreate: (name: string, icon: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])

  function submit() {
    if (!name.trim()) return
    onCreate(name.trim(), icon)
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
          width: 400, background: '#fff',
          borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <Sparkles size={16} style={{ color: '#5e6ad2' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', flex: 1 }}>Save current filters as a view</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
            Whatever's currently set in the filter row (Channels, Status, Sentiment, Tags, etc.) will be saved into this view.
          </p>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>Icon</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 6, fontSize: 15, cursor: 'pointer',
                    border: `1px solid ${icon === i ? '#5e6ad2' : '#e5e7eb'}`,
                    background: icon === i ? '#eef2ff' : '#fff',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shitstorm 2026"
              autoFocus
              style={{
                width: '100%', fontSize: 13, padding: '7px 10px', borderRadius: 7,
                border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', color: '#111827', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '8px 14px', borderRadius: 7, border: '1px solid #e5e7eb',
              background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            style={{
              flex: 1, padding: '8px 14px', borderRadius: 7, border: 'none',
              background: '#5e6ad2', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Create view
          </button>
        </div>
      </div>
    </div>
  )
}
