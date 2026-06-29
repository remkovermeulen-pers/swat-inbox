import { useState } from 'react'
import { brands as initialBrands } from '../data/mockData'
import type { Brand } from '../data/mockData'
import { Save, Plus, X, Sparkles, Shield, ChevronDown } from 'lucide-react'

export function BrandSettings() {
  const [brands, setBrands] = useState(initialBrands)
  const [activeBrandId, setActiveBrandId] = useState(brands[0].id)
  const [saved, setSaved] = useState(false)

  const brand = brands.find((b) => b.id === activeBrandId)!

  function updateBrand(updates: Partial<Brand['settings']>) {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === activeBrandId
          ? { ...b, settings: { ...b.settings, ...updates } }
          : b
      )
    )
  }

  function addKeyword() {
    const kw = window.prompt('Add escalation keyword:')
    if (kw?.trim()) {
      updateBrand({ escalationKeywords: [...brand.settings.escalationKeywords, kw.trim()] })
    }
  }

  function removeKeyword(kw: string) {
    updateBrand({
      escalationKeywords: brand.settings.escalationKeywords.filter((k) => k !== kw),
    })
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#f8f9fb]">
      {/* Brand selector sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-[#e4e7ec] flex flex-col">
        <div className="px-4 py-4 border-b border-[#e4e7ec]">
          <h3 className="text-sm font-semibold text-[#101828]">Brand Settings</h3>
          <p className="text-xs text-[#98a2b3] mt-0.5">Tone, rules & AI behaviour</p>
        </div>
        <div className="flex-1 py-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBrandId(b.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                activeBrandId === b.id
                  ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                  : 'text-[#475467] hover:bg-[#f8f9fb]'
              }`}
            >
              <span className="text-lg">{b.logo}</span>
              <span className="font-medium text-left truncate">{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings panel */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">{brand.logo}</span>
            <div>
              <h1 className="text-xl font-semibold text-[#101828]">{brand.name}</h1>
              <p className="text-sm text-[#98a2b3]">Configure AI response behaviour for this brand</p>
            </div>
          </div>

          {/* Tone of voice */}
          <Section
            icon={<Sparkles size={16} className="text-orange-500" />}
            title="Tone of Voice"
            description="Describe how the AI should sound when replying on behalf of this brand."
          >
            <textarea
              value={brand.settings.toneOfVoice}
              onChange={(e) => updateBrand({ toneOfVoice: e.target.value })}
              rows={4}
              className="w-full text-sm border border-[#e4e7ec] rounded-xl px-3.5 py-3 text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all resize-none"
              placeholder="e.g. Friendly, concise, and empathetic. Always acknowledge the customer's frustration first..."
            />
          </Section>

          {/* Instructions */}
          <Section
            icon={<Shield size={16} className="text-blue-500" />}
            title="Reply Instructions & Rules"
            description="Specific rules the AI must follow when drafting replies. Use bullet points or numbered lists."
          >
            <textarea
              value={brand.settings.instructions}
              onChange={(e) => updateBrand({ instructions: e.target.value })}
              rows={10}
              className="w-full text-sm border border-[#e4e7ec] rounded-xl px-3.5 py-3 text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all resize-none font-mono"
              placeholder="- Always apologize first&#10;- Never offer discounts without manager approval&#10;- Escalate if customer mentions legal action"
            />
          </Section>

          {/* Auto respond */}
          <Section
            icon={<Sparkles size={16} className="text-purple-500" />}
            title="Auto-Draft"
            description="Automatically generate AI drafts when new messages arrive. They'll still need human approval."
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateBrand({ autoRespond: !brand.settings.autoRespond })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  brand.settings.autoRespond ? 'bg-orange-500' : 'bg-[#d0d5dd]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    brand.settings.autoRespond ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
              <span className="text-sm text-[#344054]">
                {brand.settings.autoRespond ? 'Auto-drafts enabled' : 'Auto-drafts disabled'}
              </span>
            </label>
          </Section>

          {/* Escalation keywords */}
          <Section
            icon={<Shield size={16} className="text-red-500" />}
            title="Escalation Keywords"
            description="If any of these words appear in a message, it's automatically flagged for human review."
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {brand.settings.escalationKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-xs font-medium px-2.5 py-1.5 rounded-full"
                >
                  {kw}
                  <button
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-red-900 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                onClick={addKeyword}
                className="flex items-center gap-1 text-xs text-[#475467] border border-dashed border-[#d0d5dd] px-2.5 py-1.5 rounded-full hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                <Plus size={12} /> Add keyword
              </button>
            </div>
          </Section>

          {/* Save */}
          <div className="flex justify-end mt-2">
            <button
              onClick={save}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <Save size={15} />
              {saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({
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
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-sm font-semibold text-[#101828]">{title}</h3>
      </div>
      <p className="text-xs text-[#98a2b3] mb-3 ml-6">{description}</p>
      {children}
    </div>
  )
}
