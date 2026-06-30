import { useState } from 'react'
import { brands as initialBrands } from '../data/mockData'
import type { Brand, AutomationAction } from '../data/mockData'
import { Save, Plus, X, Sparkles, Shield, ArrowLeft, Bot, Smile, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BrandSettings() {
  const [brands, setBrands] = useState(initialBrands)
  const [activeBrandId, setActiveBrandId] = useState(brands[0].id)
  const [saved, setSaved] = useState(false)

  const brand = brands.find((b) => b.id === activeBrandId)!

  function updateBrand(updates: Partial<Brand['settings']>) {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === activeBrandId ? { ...b, settings: { ...b.settings, ...updates } } : b
      )
    )
  }

  function setAutomationRule(category: string, action: AutomationAction) {
    updateBrand({
      automationRules: brand.settings.automationRules.map((r) =>
        r.category === category ? { ...r, action } : r
      ),
    })
  }

  function setSentimentRule(sentiment: 'positive' | 'neutral' | 'negative', action: AutomationAction) {
    updateBrand({
      sentimentRules: { ...brand.settings.sentimentRules, [sentiment]: action },
    })
  }

  function addKeyword() {
    const kw = window.prompt('Add escalation keyword:')
    if (kw?.trim()) {
      updateBrand({ escalationKeywords: [...brand.settings.escalationKeywords, kw.trim()] })
    }
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', background: '#f8fafc' }}>

      {/* Brand selector */}
      <div style={{ width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <Link to="/inbox" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', textDecoration: 'none', marginBottom: 10 }}>
            <ArrowLeft size={13} /> Back to inbox
          </Link>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Brand Settings</h3>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>Tone, rules & AI behaviour</p>
        </div>
        <div style={{ flex: 1, paddingTop: 6 }}>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBrandId(b.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 16px', fontSize: 13, border: 'none', cursor: 'pointer',
                background: activeBrandId === b.id ? '#eff6ff' : 'transparent',
                color: activeBrandId === b.id ? '#1a7bc4' : '#475569',
                borderRight: activeBrandId === b.id ? '2px solid #1a7bc4' : '2px solid transparent',
                textAlign: 'left', fontFamily: 'inherit', fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 18 }}>{b.logo}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: 680 }}>

          {/* Brand header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <span style={{ fontSize: 36 }}>{brand.logo}</span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: 0 }}>{brand.name}</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Configure AI response behaviour for this brand</p>
            </div>
          </div>

          {/* ── Automation Rules ─────────────────────────────────────── */}
          <SettingsSection
            icon={<Bot size={16} style={{ color: '#7c3aed' }} />}
            title="Message Routing Rules"
            description="Define how each message type is handled. Auto-send lets AI reply instantly. Approve first creates a draft for human review. Escalate always routes to a team member — no AI."
          >
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
              {([
                { action: 'auto_send', label: 'Auto-send', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                { action: 'approve', label: 'Approve first', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                { action: 'escalate', label: 'Escalate', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
              ] as const).map(({ action, label, color, bg, border }) => (
                <span key={action} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color, fontWeight: 500 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: bg, border: `1.5px solid ${border}`, display: 'inline-block' }} />
                  {label}
                </span>
              ))}
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              {brand.settings.automationRules.map((rule, idx) => (
                <div
                  key={rule.category}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 16px',
                    borderBottom: idx < brand.settings.automationRules.length - 1 ? '1px solid #f1f5f9' : 'none',
                    background: '#fff',
                  }}
                >
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{rule.icon}</span>
                  <span style={{ fontSize: 13, color: '#334155', flex: 1, fontWeight: 500 }}>{rule.category}</span>
                  <ActionPicker
                    value={rule.action}
                    onChange={(a) => setAutomationRule(rule.category, a)}
                  />
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* ── Sentiment Rules ───────────────────────────────────────── */}
          <SettingsSection
            icon={<Smile size={16} style={{ color: '#0891b2' }} />}
            title="Sentiment-Based Routing"
            description="Override the category rule based on the detected emotional tone of the message."
          >
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              {([
                { key: 'positive', label: 'Positive sentiment', icon: '😊', hint: 'Praise, excitement, gratitude' },
                { key: 'neutral', label: 'Neutral sentiment', icon: '😐', hint: 'Questions, requests, general' },
                { key: 'negative', label: 'Negative sentiment', icon: '😠', hint: 'Frustration, complaints, anger' },
              ] as const).map(({ key, label, icon, hint }, idx) => (
                <div
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 16px',
                    borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none',
                    background: '#fff',
                  }}
                >
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#334155', fontWeight: 500, margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0' }}>{hint}</p>
                  </div>
                  <ActionPicker
                    value={brand.settings.sentimentRules[key]}
                    onChange={(a) => setSentimentRule(key, a)}
                  />
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* ── Tone of voice ─────────────────────────────────────────── */}
          <SettingsSection
            icon={<Sparkles size={16} style={{ color: '#1a7bc4' }} />}
            title="Tone of Voice"
            description="Describe how the AI should sound when replying on behalf of this brand."
          >
            <textarea
              value={brand.settings.toneOfVoice}
              onChange={(e) => updateBrand({ toneOfVoice: e.target.value })}
              rows={4}
              style={{
                width: '100%', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '10px 14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit',
                lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </SettingsSection>

          {/* ── Reply instructions ────────────────────────────────────── */}
          <SettingsSection
            icon={<Shield size={16} style={{ color: '#7c3aed' }} />}
            title="Reply Instructions & Rules"
            description="Specific rules the AI must follow. Use bullet points for clarity."
          >
            <textarea
              value={brand.settings.instructions}
              onChange={(e) => updateBrand({ instructions: e.target.value })}
              rows={10}
              style={{
                width: '100%', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '10px 14px', color: '#334155', outline: 'none',
                fontFamily: 'ui-monospace, monospace', lineHeight: 1.7,
                resize: 'vertical', boxSizing: 'border-box', background: '#f8fafc',
              }}
            />
          </SettingsSection>

          {/* ── Escalation keywords ───────────────────────────────────── */}
          <SettingsSection
            icon={<AlertTriangle size={16} style={{ color: '#dc2626' }} />}
            title="Escalation Keywords"
            description="If any of these words appear in a message, it is automatically flagged for human review — regardless of category or sentiment rules."
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {brand.settings.escalationKeywords.map((kw) => (
                <span
                  key={kw}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                    fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 99,
                  }}
                >
                  {kw}
                  <button
                    onClick={() => updateBrand({ escalationKeywords: brand.settings.escalationKeywords.filter((k) => k !== kw) })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                onClick={addKeyword}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b',
                  border: '1px dashed #cbd5e1', padding: '4px 10px', borderRadius: 99,
                  background: 'none', cursor: 'pointer',
                }}
              >
                <Plus size={12} /> Add keyword
              </button>
            </div>
          </SettingsSection>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingBottom: 40 }}>
            <button
              onClick={save}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px',
                borderRadius: 8, border: 'none',
                background: saved ? '#16a34a' : '#1a7bc4',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.2s', fontFamily: 'inherit',
              }}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ActionPicker ──────────────────────────────────────────────────────────────

const ACTION_OPTIONS: { value: AutomationAction; label: string; color: string; bg: string; activeBg: string; border: string }[] = [
  { value: 'auto_send', label: '🤖 Auto-send', color: '#15803d', bg: '#fff', activeBg: '#f0fdf4', border: '#bbf7d0' },
  { value: 'approve', label: '👤 Approve first', color: '#b45309', bg: '#fff', activeBg: '#fffbeb', border: '#fde68a' },
  { value: 'escalate', label: '🚨 Escalate', color: '#b91c1c', bg: '#fff', activeBg: '#fef2f2', border: '#fecaca' },
]

function ActionPicker({ value, onChange }: { value: AutomationAction; onChange: (a: AutomationAction) => void }) {
  return (
    <div style={{ display: 'flex', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
      {ACTION_OPTIONS.map((opt, idx) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '5px 12px',
              fontSize: 12, fontWeight: active ? 600 : 400,
              border: 'none',
              borderLeft: idx > 0 ? '1px solid #e2e8f0' : 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              background: active ? opt.activeBg : '#fafafa',
              color: active ? opt.color : '#94a3b8',
              transition: 'all 0.1s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── SettingsSection ───────────────────────────────────────────────────────────

function SettingsSection({ icon, title, description, children }: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px 28px', lineHeight: 1.5 }}>{description}</p>
      {children}
    </div>
  )
}
