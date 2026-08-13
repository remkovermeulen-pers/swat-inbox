import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import type { Sentiment } from '../data/mockData'
import { KNOWN_TAGS, type CustomView } from '../lib/inboxScale'

const ICONS = ['🔥', '⭐', '💳', '🚨', '📌', '🧭', '💬', '🛑']

export function CreateViewModal({
  onCreate,
  onClose,
}: {
  onCreate: (view: CustomView) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [keywordsText, setKeywordsText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [sentiments, setSentiments] = useState<Sentiment[]>([])
  const [minReach, setMinReach] = useState('')

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function toggleSentiment(s: Sentiment) {
    setSentiments((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function submit() {
    if (!name.trim()) return
    const keywords = keywordsText.split(',').map((k) => k.trim()).filter(Boolean)
    onCreate({
      id: `view-${Date.now()}`,
      name: name.trim(),
      icon,
      color: '#5e6ad2',
      keywords: keywords.length ? keywords : undefined,
      tags: tags.length ? tags : undefined,
      sentiments: sentiments.length ? sentiments : undefined,
      minReach: minReach.trim() ? Number(minReach) : undefined,
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
          width: 420, maxHeight: '85vh', overflowY: 'auto', background: '#fff',
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

          {/* Keywords */}
          <div>
            <Label>Keywords (comma-separated)</Label>
            <input
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="e.g. recall, hacked, lawsuit"
              style={inputStyle}
            />
            <p style={hintStyle}>Matches if the subject or message text contains ANY of these.</p>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {KNOWN_TAGS.map((tag) => {
                const active = tags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                      border: `1px solid ${active ? '#5e6ad2' : '#e5e7eb'}`,
                      background: active ? '#eef2ff' : '#fff',
                      color: active ? '#4338ca' : '#6b7280',
                      fontFamily: 'inherit',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            <p style={hintStyle}>Matches if the message has ANY of the selected tags (combined with keywords above as OR).</p>
          </div>

          {/* Sentiment */}
          <div>
            <Label>Customer sentiment</Label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['negative', 'neutral', 'positive'] as Sentiment[]).map((s) => {
                const active = sentiments.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleSentiment(s)}
                    style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
                      border: `1px solid ${active ? '#5e6ad2' : '#e5e7eb'}`,
                      background: active ? '#eef2ff' : '#fff',
                      color: active ? '#4338ca' : '#6b7280',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Min reach */}
          <div>
            <Label>Minimum customer reach</Label>
            <input
              value={minReach}
              onChange={(e) => setMinReach(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 10000"
              style={inputStyle}
            />
            <p style={hintStyle}>Sentiment and reach must ALL match (AND) — keywords/tags match if ANY apply (OR).</p>
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
  flex: 1, fontSize: 13, padding: '7px 10px', borderRadius: 7,
  border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', color: '#111827',
}

const hintStyle: React.CSSProperties = { fontSize: 11, color: '#9ca3af', margin: '5px 0 0' }

const primaryBtn: React.CSSProperties = {
  flex: 1, padding: '8px 14px', borderRadius: 7, border: 'none',
  background: '#5e6ad2', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
}

const secondaryBtn: React.CSSProperties = {
  flex: 1, padding: '8px 14px', borderRadius: 7, border: '1px solid #e5e7eb',
  background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
}
