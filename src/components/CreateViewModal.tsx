import { useState } from 'react'
import { X, Sparkles, Plus, Trash2 } from 'lucide-react'
import {
  FIELD_DEFS,
  FILTER_FIELDS,
  operatorsForField,
  defaultOperatorForField,
  type CustomView,
  type FilterCondition,
  type FilterField,
} from '../lib/inboxScale'

const ICONS = ['🔥', '⭐', '💳', '🚨', '📌', '🧭', '💬', '🛑']

let rowIdCounter = 0
function nextRowId() {
  rowIdCounter += 1
  return rowIdCounter
}

interface Row {
  id: number
  field: FilterField
  operator: string
  value: string | string[]
}

function blankRow(): Row {
  const field: FilterField = 'tag'
  return { id: nextRowId(), field, operator: defaultOperatorForField(field), value: [] }
}

export function CreateViewModal({
  onCreate,
  onClose,
}: {
  onCreate: (view: CustomView) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [rows, setRows] = useState<Row[]>([blankRow()])

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function setRowField(id: number, field: FilterField) {
    updateRow(id, { field, operator: defaultOperatorForField(field), value: FIELD_DEFS[field].type === 'select' ? [] : '' })
  }

  function addRow() {
    setRows((prev) => [...prev, blankRow()])
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function toggleSelectValue(id: number, value: string) {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r
      const current = Array.isArray(r.value) ? r.value : []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...r, value: next }
    }))
  }

  function submit() {
    if (!name.trim()) return
    const conditions: FilterCondition[] = rows
      .filter((r) => (Array.isArray(r.value) ? r.value.length > 0 : r.value.trim() !== ''))
      .map((r) => ({ field: r.field, operator: r.operator, value: r.value }))
    onCreate({
      id: `view-${Date.now()}`,
      name: name.trim(),
      icon,
      color: '#5e6ad2',
      conditions: conditions.length ? conditions : undefined,
    })
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
          width: 560, maxHeight: '85vh', overflowY: 'auto', background: '#fff',
          borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <Sparkles size={16} style={{ color: '#5e6ad2' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', flex: 1 }}>New custom view</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name + icon */}
          <div>
            <Label>Name</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {ICONS.map((i) => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    style={{
                      width: 30, height: 30, borderRadius: 6, fontSize: 14, cursor: 'pointer',
                      border: `1px solid ${icon === i ? '#5e6ad2' : '#e5e7eb'}`,
                      background: icon === i ? '#eef2ff' : '#fff',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shitstorm 2026"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <Label>Filters</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map((row) => {
                const def = FIELD_DEFS[row.field]
                const operators = operatorsForField(row.field)
                return (
                  <div key={row.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <select
                      value={row.field}
                      onChange={(e) => setRowField(row.id, e.target.value as FilterField)}
                      style={{ ...selectStyle, width: 130, flexShrink: 0 }}
                    >
                      {FILTER_FIELDS.map((f) => (
                        <option key={f} value={f}>{FIELD_DEFS[f].label}</option>
                      ))}
                    </select>

                    <select
                      value={row.operator}
                      onChange={(e) => updateRow(row.id, { operator: e.target.value })}
                      style={{ ...selectStyle, width: 110, flexShrink: 0 }}
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {def.type === 'select' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '4px 0' }}>
                          {def.options?.map((opt) => {
                            const active = Array.isArray(row.value) && row.value.includes(opt)
                            return (
                              <button
                                key={opt}
                                onClick={() => toggleSelectValue(row.id, opt)}
                                style={{
                                  padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                                  textTransform: 'capitalize',
                                  border: `1px solid ${active ? '#5e6ad2' : '#e5e7eb'}`,
                                  background: active ? '#eef2ff' : '#fff',
                                  color: active ? '#4338ca' : '#6b7280',
                                }}
                              >
                                {opt.replace('_', ' ')}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <input
                          type={def.type === 'number' ? 'number' : 'text'}
                          value={Array.isArray(row.value) ? '' : row.value}
                          onChange={(e) => updateRow(row.id, { value: e.target.value })}
                          placeholder={def.type === 'number' ? 'e.g. 10000' : 'value'}
                          style={{ ...inputStyle, padding: '6px 10px' }}
                        />
                      )}
                    </div>

                    <button
                      onClick={() => removeRow(row.id)}
                      title="Remove filter"
                      style={{
                        flexShrink: 0, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 6, background: 'none', color: '#9ca3af', cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              onClick={addRow}
              style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: '#5e6ad2', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
              }}
            >
              <Plus size={13} /> Add filter
            </button>
            <p style={hintStyle}>All filters must match (AND). "is"/"is not" on multi-value fields match if ANY selected value applies.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={submit} disabled={!name.trim()} style={{ ...primaryBtn, opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? 'pointer' : 'not-allowed' }}>
            Create view
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>{children}</p>
}

const inputStyle: React.CSSProperties = {
  width: '100%', fontSize: 13, padding: '7px 10px', borderRadius: 7,
  border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', color: '#111827', boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  fontSize: 12, padding: '6px 8px', borderRadius: 7,
  border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', color: '#111827', background: '#fff',
}

const hintStyle: React.CSSProperties = { fontSize: 11, color: '#9ca3af', margin: '8px 0 0' }

const primaryBtn: React.CSSProperties = {
  flex: 1, padding: '8px 14px', borderRadius: 7, border: 'none',
  background: '#5e6ad2', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
}

const secondaryBtn: React.CSSProperties = {
  flex: 1, padding: '8px 14px', borderRadius: 7, border: '1px solid #e5e7eb',
  background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
}
