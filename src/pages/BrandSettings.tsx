import { useState } from 'react'
import { brands as initialBrands } from '../data/mockData'
import type { Brand } from '../data/mockData'
import { Save, Plus, X, Sparkles, Shield, ArrowLeft } from 'lucide-react'
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
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <Link
            to="/inbox"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 10,
            }}
          >
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
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                background: activeBrandId === b.id ? '#eff6ff' : 'transparent',
                color: activeBrandId === b.id ? '#1a7bc4' : '#475569',
                borderRight: activeBrandId === b.id ? '2px solid #1a7bc4' : '2px solid transparent',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontWeight: 500,
                transition: 'all 0.1s',
              }}
            >
              <span style={{ fontSize: 18 }}>{b.logo}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: 640 }}>
          {/* Brand header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: 36 }}>{brand.logo}</span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: 0 }}>{brand.name}</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
                Configure AI response behaviour for this brand
              </p>
            </div>
          </div>

          {/* Tone of voice */}
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
                width: '100%',
                fontSize: 13,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#0f172a',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </SettingsSection>

          {/* Reply instructions */}
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
                width: '100%',
                fontSize: 12,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#334155',
                outline: 'none',
                fontFamily: 'ui-monospace, monospace',
                lineHeight: 1.7,
                resize: 'vertical',
                boxSizing: 'border-box',
                background: '#f8fafc',
              }}
            />
          </SettingsSection>

          {/* Auto-draft toggle */}
          <SettingsSection
            icon={<Sparkles size={16} style={{ color: '#7c3aed' }} />}
            title="Auto-Draft"
            description="Automatically generate AI drafts when new messages arrive. Humans still approve before sending."
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => updateBrand({ autoRespond: !brand.settings.autoRespond })}
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 99,
                  background: brand.settings.autoRespond ? '#1a7bc4' : '#cbd5e1',
                  position: 'relative',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    transform: brand.settings.autoRespond ? 'translateX(21px)' : 'translateX(3px)',
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
                {brand.settings.autoRespond ? 'Auto-drafts enabled' : 'Auto-drafts disabled'}
              </span>
            </label>
          </SettingsSection>

          {/* Escalation keywords */}
          <SettingsSection
            icon={<Shield size={16} style={{ color: '#dc2626' }} />}
            title="Escalation Keywords"
            description="If these words appear in a message, it's automatically flagged for human review."
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {brand.settings.escalationKeywords.map((kw) => (
                <span
                  key={kw}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 99,
                  }}
                >
                  {kw}
                  <button
                    onClick={() =>
                      updateBrand({
                        escalationKeywords: brand.settings.escalationKeywords.filter((k) => k !== kw),
                      })
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#dc2626',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                onClick={addKeyword}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: '#64748b',
                  border: '1px dashed #cbd5e1',
                  padding: '4px 10px',
                  borderRadius: 99,
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} /> Add keyword
              </button>
            </div>
          </SettingsSection>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              onClick={save}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: saved ? '#16a34a' : '#1a7bc4',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
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

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px 28px', lineHeight: 1.5 }}>
        {description}
      </p>
      {children}
    </div>
  )
}
