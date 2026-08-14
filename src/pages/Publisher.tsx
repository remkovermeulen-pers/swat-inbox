import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, ChevronRight, CheckCheck,
  Clock, Mail,
  Edit3, Play,
  ArrowRight, Bot, Zap, Copy, Terminal, Send, Wand2,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
interface Ad { id: string; headline: string; body: string; cta: string; platform: 'linkedin' | 'instagram' | 'twitter' }
interface LinkedInMessage { id: string; subject: string; body: string; angle: string }
interface FollowUp { id: string; delay: number; unit: 'days'; condition: string; message: string }
interface CampaignContent { ads: Ad[]; messages: LinkedInMessage[]; followUps: FollowUp[] }
interface Campaign { id: string; name: string; goal: string; status: 'draft' | 'active' | 'paused'; leads: number; replies: number; createdAt: string; content?: CampaignContent }

/* ─── Example content ────────────────────────────────────────── */
const EXAMPLE_CONTENT: CampaignContent = {
  ads: [
    {
      id: 'a1', platform: 'linkedin',
      headline: '🚀 We\'re hiring a Social Media Manager — remote, creative, impactful',
      body: 'Swat is a social media management platform trusted by 5,000+ brands. We\'re looking for a Social Media Manager who can own our voice across LinkedIn, Instagram, and X.\n\nYou\'ll get full creative freedom, a 32-hour work week option, and real impact on a product that social teams actually love.\n\nSound like you?',
      cta: 'See the full role →',
    },
    {
      id: 'a2', platform: 'instagram',
      headline: 'Social Media Manager — own the whole strategy, not just the queue',
      body: 'Tired of waiting 3 days for copy approval? At Swat, you run the show.\n\nWe\'re a lean team building a product that 5,000+ social media managers use every day — and we need one more great person to tell that story.\n\nRemote-first · Competitive salary · Real ownership.',
      cta: 'Apply now',
    },
    {
      id: 'a3', platform: 'twitter',
      headline: 'We need a Social Media Manager who gets B2B — and makes it interesting',
      body: 'B2B social doesn\'t have to be boring. We\'re hiring someone to prove that.\n\nSwat helps 5,000+ brands manage their social inbox. We want a Social Media Manager to help us grow the brand that tools people actually love using.\n\nIf you\'ve grown a B2B audience before, let\'s talk.',
      cta: 'Learn more',
    },
  ],
  messages: [
    {
      id: 'm1', angle: 'Creative angle',
      subject: 'Saw your content — want to make more of it?',
      body: `Hi {first_name},

I came across your posts on LinkedIn and immediately thought: this is exactly the voice we're looking for.

We're Swat — a social media management platform used by 5,000+ brands — and we're hiring a Social Media Manager to own our channels.

Full creative freedom, remote-first, and a team that genuinely cares about good content. No approval bottlenecks.

Would you be open to a 20-minute call this week to learn more?`,
    },
    {
      id: 'm2', angle: 'Pain-point angle',
      subject: 'Quick question about your current setup',
      body: `Hi {first_name},

I have a hunch you've experienced this: great content ideas, but not enough time — or not enough approvals — to actually ship them.

We're building a team at Swat where the Social Media Manager calls the shots. Strategy, channel mix, content calendar — all yours.

We're at the stage where your work will directly shape how thousands of people see our brand.

Worth a quick chat?`,
    },
    {
      id: 'm3', angle: 'Results angle',
      subject: 'We grew from 2K → 47K followers — want to take it further?',
      body: `Hi {first_name},

In the past 18 months, we grew our LinkedIn from 2K to 47K followers with a team of two.

Now we're ready to scale — and we're looking for a Social Media Manager to expand that across all channels.

Given your background in {industry}, I think you'd find the challenge interesting. You'd be targeting a very similar audience to the one you've likely built before.

Happy to share more details if you're curious.`,
    },
  ],
  followUps: [
    { id: 'f1', delay: 3, unit: 'days', condition: 'No reply to initial message', message: 'Hi {first_name}, just bumping this up in case it got buried! Still think you\'d be a great fit. Happy to answer any questions about the role, team, or what day-to-day actually looks like.' },
    { id: 'f2', delay: 7, unit: 'days', condition: 'No reply to follow-up 1', message: 'Last note from me, {first_name}. If the timing isn\'t right, no worries at all. The role will be open for a few more weeks — feel free to reach out if anything changes.' },
    { id: 'f3', delay: 1, unit: 'days', condition: 'Replied with interest', message: 'Great to hear from you, {first_name}! Sending over a calendar link so we can find a time — I\'ll also include a short overview of the role and team for context. Talk soon!' },
  ],
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Q3 Social Media Manager Outreach', goal: 'Hire social media managers for our team', status: 'active', leads: 142, replies: 31, createdAt: '2026-06-01', content: EXAMPLE_CONTENT },
  { id: 'c2', name: 'Agency Partnership Program', goal: 'Find agency partners for our reseller programme', status: 'paused', leads: 87, replies: 14, createdAt: '2026-05-15' },
]

const STEPS = ['Brief', 'Ads', 'Messages', 'Follow-up', 'Review']

type RightPanel = 'empty' | 'wizard' | 'chat' | 'mcp' | { campaignId: string }

/* ─── Root ───────────────────────────────────────────────────── */
export function Publisher() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [right, setRight] = useState<RightPanel>('empty')

  // Wizard state
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [campaignName, setCampaignName] = useState('')
  const [audience, setAudience] = useState('')
  const [draftContent, setDraftContent] = useState<CampaignContent>(EXAMPLE_CONTENT)
  const [wizardLaunched, setWizardLaunched] = useState(false)

  function startWizard() {
    setStep(0); setGoal(''); setCampaignName(''); setAudience('')
    setDraftContent(EXAMPLE_CONTENT); setWizardLaunched(false)
    setRight('wizard')
  }

  function launchWizard() {
    const c: Campaign = { id: `c${Date.now()}`, name: campaignName || goal.slice(0, 50) || 'New Campaign', goal, status: 'active', leads: 0, replies: 0, createdAt: new Date().toISOString().split('T')[0], content: draftContent }
    setCampaigns(p => [c, ...p])
    setWizardLaunched(true)
  }

  function addCampaign(name: string, goal: string) {
    const c: Campaign = { id: `c${Date.now()}`, name, goal, status: 'active', leads: 0, replies: 0, createdAt: new Date().toISOString().split('T')[0], content: EXAMPLE_CONTENT }
    setCampaigns(p => [c, ...p])
    setRight({ campaignId: c.id })
  }

  function updateCampaign(id: string, content: CampaignContent) {
    setCampaigns(p => p.map(c => c.id === id ? { ...c, content } : c))
  }

  const selectedCampaign = typeof right === 'object' ? campaigns.find(c => c.id === right.campaignId) : null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Publisher</h1>
      </div>

      {/* Body — split pane */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: Campaign list ── */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid #e5e7eb', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', flex: 1 }}>CAMPAIGNS</span>
            <button onClick={startWizard} style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 8px', borderRadius: 5, fontFamily: 'inherit' }}>+ New</button>
          </div>

          {/* Creation mode options */}
          <div style={{ padding: '10px 10px 6px', display: 'flex', gap: 6 }}>
            <MiniCard icon={<Wand2 size={13} style={{ color: '#7c3aed' }} />} label="Wizard" active={right === 'wizard'} onClick={startWizard} />
            <MiniCard icon={<Bot size={13} style={{ color: '#2563eb' }} />} label="Chat" active={right === 'chat'} onClick={() => setRight('chat')} />
            <MiniCard icon={<Zap size={13} style={{ color: '#d97706' }} />} label="MCP" active={right === 'mcp'} onClick={() => setRight('mcp')} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {campaigns.map(c => {
              const isSelected = typeof right === 'object' && right.campaignId === c.id
              return (
                <div key={c.id} onClick={() => setRight({ campaignId: c.id })} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', background: isSelected ? '#f0fdf4' : '#fff', borderLeft: isSelected ? '3px solid #22c55e' : '3px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.status === 'active' ? '#22c55e' : '#d1d5db', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3, paddingLeft: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.goal}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, paddingLeft: 14 }}>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>{c.leads} leads</span>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>{c.replies} replies</span>
                    <span style={{ fontSize: 11, color: c.status === 'active' ? '#15803d' : '#9ca3af', fontWeight: 500 }}>{c.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right: Content panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f9fafb' }}>
          {right === 'empty' && <EmptyState onWizard={startWizard} onChat={() => setRight('chat')} onMcp={() => setRight('mcp')} />}
          {right === 'wizard' && (
            <WizardPanel
              step={step} setStep={setStep}
              goal={goal} setGoal={setGoal}
              campaignName={campaignName} setCampaignName={setCampaignName}
              audience={audience} setAudience={setAudience}
              content={draftContent} setContent={setDraftContent}
              launched={wizardLaunched} onLaunch={launchWizard}
              onDone={() => { const last = campaigns[0]; if (last) setRight({ campaignId: last.id }) }}
            />
          )}
          {right === 'chat' && <ChatCreator onLaunch={addCampaign} />}
          {right === 'mcp' && <McpPanel />}
          {selectedCampaign && (
            <CampaignEditor
              campaign={selectedCampaign}
              onChange={content => updateCampaign(selectedCampaign.id, content)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function MiniCard({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px 0', borderRadius: 7, border: `1px solid ${active ? '#22c55e' : '#e5e7eb'}`, background: active ? '#f0fdf4' : '#f9fafb', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: active ? '#15803d' : '#6b7280' }}>
      {icon} {label}
    </button>
  )
}

/* ─── Empty state ────────────────────────────────────────────── */
function EmptyState({ onWizard, onChat, onMcp }: { onWizard: () => void; onChat: () => void; onMcp: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📣</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Select a campaign or create a new one</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Choose how you'd like to get started</p>
      </div>
      <div style={{ display: 'flex', gap: 14, maxWidth: 620 }}>
        <CreationCard icon={<Wand2 size={20} style={{ color: '#7c3aed' }} />} bg="#faf5ff" border="#e9d5ff" title="Step-by-step Wizard" description="Guided flow with AI-generated ads, messages, and follow-up sequence." cta="Open Wizard" ctaColor="#7c3aed" onClick={onWizard} />
        <CreationCard icon={<Bot size={20} style={{ color: '#2563eb' }} />} bg="#eff6ff" border="#bfdbfe" title="Chat with AI" description="Describe your campaign in plain language and the AI builds it for you." cta="Start Chat" ctaColor="#2563eb" onClick={onChat} />
        <CreationCard icon={<Zap size={20} style={{ color: '#d97706' }} />} bg="#fffbeb" border="#fde68a" title="Connect via MCP" description="Create campaigns directly from Claude, ChatGPT, or Cursor." cta="Setup MCP" ctaColor="#d97706" onClick={onMcp} />
      </div>
    </div>
  )
}

function CreationCard({ icon, bg, border, title, description, cta, ctaColor, onClick }: { icon: React.ReactNode; bg: string; border: string; title: string; description: string; cta: string; ctaColor: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${border}` }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</div>
      <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, flex: 1 }}>{description}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color: ctaColor }}>{cta} →</span>
    </div>
  )
}

/* ─── Campaign Editor ────────────────────────────────────────── */
type EditorTab = 'ads' | 'messages' | 'followup'

function CampaignEditor({ campaign, onChange }: { campaign: Campaign; onChange: (c: CampaignContent) => void }) {
  const [tab, setTab] = useState<EditorTab>('ads')
  const [editingId, setEditingId] = useState<string | null>(null)
  const content = campaign.content ?? EXAMPLE_CONTENT

  function updateAd(id: string, field: keyof Ad, value: string) {
    onChange({ ...content, ads: content.ads.map(a => a.id === id ? { ...a, [field]: value } : a) })
  }
  function updateMsg(id: string, field: keyof LinkedInMessage, value: string) {
    onChange({ ...content, messages: content.messages.map(m => m.id === id ? { ...m, [field]: value } : m) })
  }
  function updateFu(id: string, field: keyof FollowUp, value: string | number) {
    onChange({ ...content, followUps: content.followUps.map(f => f.id === id ? { ...f, [field]: value } : f) })
  }

  const platformColors: Record<string, string> = { linkedin: '#0077b5', instagram: '#e1306c', twitter: '#000' }
  const platformLabels: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', twitter: 'X / Twitter' }
  const angleColors = ['#7c3aed', '#2563eb', '#0891b2']
  const conditionColors: Record<string, { bg: string; text: string; border: string }> = {
    'No reply to initial message': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    'No reply to follow-up 1': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Replied with interest': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Campaign header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: campaign.status === 'active' ? '#22c55e' : '#d1d5db' }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, flex: 1 }}>{campaign.name}</h2>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{campaign.leads} leads · {campaign.replies} replies</span>
          {campaign.status === 'active'
            ? <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>Active</span>
            : <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: '#f3f4f6', color: '#6b7280' }}>Paused</span>}
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 12px 18px' }}>{campaign.goal}</p>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([['ads', 'Ads (3)'], ['messages', 'LinkedIn Messages (3)'], ['followup', 'Follow-up Flow']] as [EditorTab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setEditingId(null) }} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: tab === t ? '#111827' : 'transparent', color: tab === t ? '#fff' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {tab === 'ads' && content.ads.map((ad, i) => (
          <div key={ad.id} style={{ background: '#fff', borderRadius: 10, border: editingId === ad.id ? '2px solid #22c55e' : '1px solid #e5e7eb', marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: platformColors[ad.platform], color: '#fff', fontSize: 11, fontWeight: 700 }}>{platformLabels[ad.platform]}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Variant {i + 1}</span>
              <button onClick={() => setEditingId(editingId === ad.id ? null : ad.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Edit3 size={12} /> {editingId === ad.id ? 'Done' : 'Edit'}
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {editingId === ad.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={labelStyle}>Headline</label><input value={ad.headline} onChange={e => updateAd(ad.id, 'headline', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Body</label><textarea value={ad.body} onChange={e => updateAd(ad.id, 'body', e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                  <div><label style={labelStyle}>CTA</label><input value={ad.cta} onChange={e => updateAd(ad.id, 'cta', e.target.value)} style={inputStyle} /></div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{ad.headline}</div>
                  <pre style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 10px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{ad.body}</pre>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>{ad.cta}</span>
                </>
              )}
            </div>
          </div>
        ))}

        {tab === 'messages' && content.messages.map((msg, i) => (
          <div key={msg.id} style={{ background: '#fff', borderRadius: 10, border: editingId === msg.id ? '2px solid #22c55e' : '1px solid #e5e7eb', marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: angleColors[i] + '15', color: angleColors[i], fontSize: 11, fontWeight: 700, border: `1px solid ${angleColors[i]}30` }}>{msg.angle}</span>
              <button onClick={() => setEditingId(editingId === msg.id ? null : msg.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Edit3 size={12} /> {editingId === msg.id ? 'Done' : 'Edit'}
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {editingId === msg.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={labelStyle}>Opening line / subject</label><input value={msg.subject} onChange={e => updateMsg(msg.id, 'subject', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Message body</label><textarea value={msg.body} onChange={e => updateMsg(msg.id, 'body', e.target.value)} rows={10} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} /></div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>"{msg.subject}"</div>
                  <pre style={{ fontSize: 12, color: '#374151', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.body}</pre>
                </>
              )}
            </div>
          </div>
        ))}

        {tab === 'followup' && (
          <div style={{ maxWidth: 640 }}>
            <FlowNode icon={<Mail size={14} />} label="Initial outreach sent" color="#111827" bg="#111827" textColor="#fff" />
            {content.followUps.map((fu, i) => {
              const colors = conditionColors[fu.condition] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
              const isPositive = fu.condition.includes('interest')
              return (
                <div key={fu.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: isPositive ? 56 : 0, marginLeft: isPositive ? 0 : 19, marginTop: 4, marginBottom: 4 }}>
                    {isPositive ? <ArrowRight size={14} style={{ color: '#22c55e' }} /> : <div style={{ width: 1, height: 20, background: '#e5e7eb' }} />}
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: 500, whiteSpace: 'nowrap' }}>{fu.condition}</span>
                    {!isPositive && <span style={{ fontSize: 11, color: '#9ca3af' }}>→ wait <strong style={{ color: '#374151' }}>{fu.delay} {fu.unit}</strong></span>}
                  </div>
                  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%', overflow: 'hidden', marginLeft: isPositive ? 56 : 0 }}>
                    <div style={{ padding: '7px 12px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={12} style={{ color: '#9ca3af' }} />
                      {!isPositive && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>Send after</span>
                          <input type="number" value={fu.delay} onChange={e => updateFu(fu.id, 'delay', parseInt(e.target.value) || 1)} style={{ width: 38, padding: '2px 5px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', textAlign: 'center' }} />
                          <span style={{ fontSize: 11, color: '#6b7280' }}>days with no reply</span>
                        </div>
                      )}
                      {isPositive && <span style={{ fontSize: 11, color: '#6b7280' }}>Auto-reply when interest detected</span>}
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>Step {i + 1}</span>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <textarea value={fu.message} onChange={e => updateFu(fu.id, 'message', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', fontSize: 12 }} />
                    </div>
                  </div>
                  {i < content.followUps.length - 1 && <div style={{ width: 1, height: 12, background: '#e5e7eb', marginLeft: 19, marginTop: 4 }} />}
                </div>
              )
            })}
            <div style={{ marginTop: 8 }}>
              <div style={{ width: 1, height: 16, background: '#e5e7eb', marginLeft: 19 }} />
              <FlowNode icon={<CheckCheck size={13} />} label="Campaign ends / contact archived" color="#9ca3af" bg="#f3f4f6" textColor="#6b7280" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FlowNode({ icon, label, color, bg, textColor }: { icon: React.ReactNode; label: string; color: string; bg: string; textColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, flexShrink: 0 }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  )
}

/* ─── Wizard Panel ───────────────────────────────────────────── */
function WizardPanel({ step, setStep, goal, setGoal, campaignName, setCampaignName, audience, setAudience, content, setContent, launched, onLaunch, onDone }: {
  step: number; setStep: (n: number) => void
  goal: string; setGoal: (v: string) => void
  campaignName: string; setCampaignName: (v: string) => void
  audience: string; setAudience: (v: string) => void
  content: CampaignContent; setContent: (c: CampaignContent) => void
  launched: boolean; onLaunch: () => void; onDone: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (launched) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCheck size={24} style={{ color: '#22c55e' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Campaign launched! 🚀</h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, textAlign: 'center', maxWidth: 360 }}>
          <strong>{campaignName || 'Your campaign'}</strong> is live. Click it in the list to edit content anytime.
        </p>
        <button onClick={onDone} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#111827', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Open Campaign →</button>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Step tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', gap: 0, flexShrink: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, background: i === step ? '#f0fdf4' : 'transparent', cursor: i < step ? 'pointer' : 'default' }} onClick={() => { if (i < step) setStep(i) }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: i < step ? '#22c55e' : i === step ? '#111827' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: i === step ? 600 : 400, color: i === step ? '#111827' : i < step ? '#22c55e' : '#9ca3af', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 16, height: 1, background: i < step ? '#22c55e' : '#e5e7eb' }} />}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {step === 0 && <StepBrief goal={goal} setGoal={setGoal} name={campaignName} setName={setCampaignName} audience={audience} setAudience={setAudience} />}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>3 Ad Variants</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>AI-generated based on your brief. Click Edit to customise.</p>
            {content.ads.map((ad, i) => {
              const platformColors: Record<string, string> = { linkedin: '#0077b5', instagram: '#e1306c', twitter: '#000' }
              const platformLabels: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', twitter: 'X / Twitter' }
              return (
                <div key={ad.id} style={{ background: '#fff', borderRadius: 10, border: editingId === ad.id ? '2px solid #22c55e' : '1px solid #e5e7eb', marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '9px 14px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: platformColors[ad.platform], color: '#fff', fontSize: 11, fontWeight: 700 }}>{platformLabels[ad.platform]}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Variant {i + 1}</span>
                    <button onClick={() => setEditingId(editingId === ad.id ? null : ad.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><Edit3 size={12} /> {editingId === ad.id ? 'Done' : 'Edit'}</button>
                  </div>
                  <div style={{ padding: 16 }}>
                    {editingId === ad.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div><label style={labelStyle}>Headline</label><input value={ad.headline} onChange={e => setContent({ ...content, ads: content.ads.map(a => a.id === ad.id ? { ...a, headline: e.target.value } : a) })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Body</label><textarea value={ad.body} onChange={e => setContent({ ...content, ads: content.ads.map(a => a.id === ad.id ? { ...a, body: e.target.value } : a) })} rows={5} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                        <div><label style={labelStyle}>CTA</label><input value={ad.cta} onChange={e => setContent({ ...content, ads: content.ads.map(a => a.id === ad.id ? { ...a, cta: e.target.value } : a) })} style={inputStyle} /></div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{ad.headline}</div>
                        <pre style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 10px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{ad.body}</pre>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>{ad.cta}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>3 LinkedIn Messages</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>Three different angles for A/B testing. Edit any field directly.</p>
            {content.messages.map((msg, i) => {
              const angleColors = ['#7c3aed', '#2563eb', '#0891b2']
              return (
                <div key={msg.id} style={{ background: '#fff', borderRadius: 10, border: editingId === msg.id ? '2px solid #22c55e' : '1px solid #e5e7eb', marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '9px 14px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: angleColors[i] + '15', color: angleColors[i], fontSize: 11, fontWeight: 700, border: `1px solid ${angleColors[i]}30` }}>{msg.angle}</span>
                    <button onClick={() => setEditingId(editingId === msg.id ? null : msg.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><Edit3 size={12} /> {editingId === msg.id ? 'Done' : 'Edit'}</button>
                  </div>
                  <div style={{ padding: 16 }}>
                    {editingId === msg.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div><label style={labelStyle}>Opening line</label><input value={msg.subject} onChange={e => setContent({ ...content, messages: content.messages.map(m => m.id === msg.id ? { ...m, subject: e.target.value } : m) })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Body</label><textarea value={msg.body} onChange={e => setContent({ ...content, messages: content.messages.map(m => m.id === msg.id ? { ...m, body: e.target.value } : m) })} rows={10} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} /></div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>"{msg.subject}"</div>
                        <pre style={{ fontSize: 12, color: '#374151', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.body}</pre>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {step === 3 && (
          <div style={{ maxWidth: 580 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Follow-up Flow</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>Edit timing and messages. All fields are live.</p>
            <FlowNode icon={<Mail size={14} />} label="Initial outreach sent" color="#111827" bg="#111827" textColor="#fff" />
            {content.followUps.map((fu, i) => {
              const conditionColors: Record<string, { bg: string; text: string; border: string }> = { 'No reply to initial message': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }, 'No reply to follow-up 1': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }, 'Replied with interest': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' } }
              const colors = conditionColors[fu.condition] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
              const isPositive = fu.condition.includes('interest')
              return (
                <div key={fu.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: isPositive ? 56 : 0, marginLeft: isPositive ? 0 : 19, marginTop: 4, marginBottom: 4 }}>
                    {isPositive ? <ArrowRight size={14} style={{ color: '#22c55e' }} /> : <div style={{ width: 1, height: 20, background: '#e5e7eb' }} />}
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: 500, whiteSpace: 'nowrap' }}>{fu.condition}</span>
                    {!isPositive && <span style={{ fontSize: 11, color: '#9ca3af' }}>→ wait <strong style={{ color: '#374151' }}>{fu.delay} {fu.unit}</strong></span>}
                  </div>
                  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%', overflow: 'hidden', marginLeft: isPositive ? 56 : 0 }}>
                    <div style={{ padding: '7px 12px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={12} style={{ color: '#9ca3af' }} />
                      {!isPositive && <><span style={{ fontSize: 11, color: '#6b7280' }}>Send after</span><input type="number" value={fu.delay} onChange={e => setContent({ ...content, followUps: content.followUps.map(f => f.id === fu.id ? { ...f, delay: parseInt(e.target.value) || 1 } : f) })} style={{ width: 38, padding: '2px 5px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', textAlign: 'center' }} /><span style={{ fontSize: 11, color: '#6b7280' }}>days with no reply</span></>}
                      {isPositive && <span style={{ fontSize: 11, color: '#6b7280' }}>Auto-reply when interest detected</span>}
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>Step {i + 1}</span>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <textarea value={fu.message} onChange={e => setContent({ ...content, followUps: content.followUps.map(f => f.id === fu.id ? { ...f, message: e.target.value } : f) })} rows={3} style={{ ...inputStyle, resize: 'vertical', fontSize: 12 }} />
                    </div>
                  </div>
                  {i < content.followUps.length - 1 && <div style={{ width: 1, height: 10, background: '#e5e7eb', marginLeft: 19, marginTop: 4 }} />}
                </div>
              )
            })}
          </div>
        )}
        {step === 4 && (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Review & Launch</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>Everything looks good? Launch to activate the campaign.</p>
            {[['Campaign', goal || '—'], ['Name', campaignName || '—'], ['Audience', audience || '—']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 12, color: '#9ca3af', width: 80, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#111827' }}>{v}</span>
              </div>
            ))}
            {[['Ads', `${content.ads.length} variants`], ['Messages', `${content.messages.length} LinkedIn messages`], ['Follow-up', `${content.followUps.length} steps`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 12, color: '#9ca3af', width: 80, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>✓ {v}</span>
              </div>
            ))}
            <button onClick={onLaunch} style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 8, border: 'none', background: '#22c55e', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Play size={14} fill="#fff" /> Launch Campaign
            </button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} style={{ padding: '7px 18px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(step + 1)} disabled={step === 0 && !goal.trim()} style={{ padding: '7px 20px', borderRadius: 7, border: 'none', background: step === 0 && !goal.trim() ? '#d1d5db' : '#111827', fontSize: 13, fontWeight: 600, color: '#fff', cursor: step === 0 && !goal.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            Continue <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Step Brief ─────────────────────────────────────────────── */
function StepBrief({ goal, setGoal, name, setName, audience, setAudience }: { goal: string; setGoal: (v: string) => void; name: string; setName: (v: string) => void; audience: string; setAudience: (v: string) => void }) {
  const suggestions = ['Find social media managers for our team', 'Generate leads for our agency tier', 'Recruit content creators & influencers', 'Promote our new AI features to marketing teams']
  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>What's this campaign for?</h2>
      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>Describe your goal — AI will generate everything based on this.</p>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Campaign goal *</label>
        <textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Find social media managers with 2–5 years experience in B2B SaaS" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 8 }}>
          {suggestions.map(s => <button key={s} onClick={() => setGoal(s)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 11, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label style={labelStyle}>Campaign name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Q3 Social Media Manager Outreach" style={inputStyle} /></div>
        <div><label style={labelStyle}>Target audience</label><input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Social media managers, B2B SaaS" style={inputStyle} /></div>
      </div>
      <div style={{ marginTop: 20, padding: '12px 14px', background: '#f0fdf4', borderRadius: 9, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Sparkles size={13} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#15803d' }}><strong>AI will generate:</strong> 3 ad variants (LinkedIn, Instagram, X), 3 LinkedIn outreach messages, and a 3-step follow-up sequence.</div>
      </div>
    </div>
  )
}

/* ─── Chat Creator ───────────────────────────────────────────── */
interface ChatMsg { role: 'ai' | 'user'; text: string }
const CHAT_FLOW = [
  { key: 'goal', prompt: "Hi! I'll help you create a campaign in a few questions.\n\nWhat's the main goal? For example: find social media managers, generate agency leads, or promote a feature launch." },
  { key: 'audience', prompt: "Got it. Who are you targeting? Be as specific as you like — role, seniority, industry, company size, geography." },
  { key: 'tone', prompt: "What tone should the messages have? (e.g. friendly and direct, professional, bold and punchy, empathetic)" },
  { key: 'confirm', prompt: "Perfect. I'll generate:\n\n• 3 ad variants (LinkedIn, Instagram, X)\n• 3 LinkedIn outreach messages with different angles\n• A 3-step follow-up sequence with branching logic\n\nShall I go ahead?" },
]

function ChatCreator({ onLaunch }: { onLaunch: (name: string, goal: string) => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: 'ai', text: CHAT_FLOW[0].prompt }])
  const [input, setInput] = useState('')
  const [flowIdx, setFlowIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, generating])

  function send() {
    const text = input.trim(); if (!text) return
    const key = CHAT_FLOW[flowIdx]?.key ?? ''
    const newAnswers = { ...answers, [key]: text }
    setAnswers(newAnswers); setMsgs(p => [...p, { role: 'user', text }]); setInput('')
    const nextIdx = flowIdx + 1; setFlowIdx(nextIdx)
    if (nextIdx < CHAT_FLOW.length) {
      setTimeout(() => setMsgs(p => [...p, { role: 'ai', text: CHAT_FLOW[nextIdx].prompt }]), 600)
    } else {
      setGenerating(true)
      setTimeout(() => {
        setGenerating(false); setDone(true)
        const name = newAnswers.goal?.slice(0, 50) || 'New Campaign'
        setMsgs(p => [...p, { role: 'ai', text: `✅ Done! I've created **"${name}"** with 3 ads, 3 LinkedIn messages, and a follow-up sequence. It's in your campaign list.` }])
        onLaunch(name, newAnswers.goal || '')
      }, 2000)
    }
  }

  const chips: Record<string, string[]> = { goal: ['Find social media managers', 'Generate leads for agency tier', 'Promote our AI features', 'Recruit content creators'], tone: ['Friendly and direct', 'Professional and concise', 'Bold and punchy', 'Empathetic'] }
  const currentChips = chips[CHAT_FLOW[flowIdx]?.key ?? ''] ?? []

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Bot size={15} style={{ color: '#2563eb' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Chat Campaign Creator</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>· AI powered</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f9fafb' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
            {m.role === 'ai' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={14} style={{ color: '#2563eb' }} /></div>}
            <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: m.role === 'ai' ? '#fff' : '#2563eb', border: m.role === 'ai' ? '1px solid #e5e7eb' : 'none', fontSize: 13, lineHeight: 1.7, color: m.role === 'ai' ? '#111827' : '#fff', whiteSpace: 'pre-wrap' }}>
              {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
            </div>
            {m.role === 'user' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>R</div>}
          </div>
        ))}
        {generating && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={14} style={{ color: '#2563eb' }} /></div>
            <div style={{ padding: '10px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
              <Sparkles size={13} style={{ color: '#2563eb' }} /> Generating your campaign…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {currentChips.length > 0 && !done && (
        <div style={{ padding: '6px 16px 8px', display: 'flex', gap: 7, flexWrap: 'wrap', background: '#f9fafb' }}>
          {currentChips.map(c => <button key={c} onClick={() => setInput(c)} style={{ padding: '4px 10px', borderRadius: 99, border: '1px solid #e5e7eb', background: '#fff', fontSize: 11, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>{c}</button>)}
        </div>
      )}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder={done ? 'Campaign created!' : 'Type your answer…'} disabled={done || generating} style={{ flex: 1, padding: '8px 12px', borderRadius: 7, border: '1px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: done ? '#f9fafb' : '#fff' }} autoFocus />
          <button onClick={send} disabled={!input.trim() || done || generating} style={{ width: 36, height: 36, borderRadius: 7, border: 'none', background: input.trim() && !done ? '#2563eb' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !done ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
            <Send size={14} style={{ color: '#fff' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── MCP Panel ──────────────────────────────────────────────── */
function McpPanel() {
  const [copied, setCopied] = useState<string | null>(null)
  function copy(text: string, key: string) { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000) }
  const MCP_URL = 'https://mcp.swat.io/v1'
  const clients = [
    { name: 'Claude (Desktop)', logo: '🤖', description: 'Add to claude_desktop_config.json', config: `{\n  "mcpServers": {\n    "swat": {\n      "url": "${MCP_URL}",\n      "apiKey": "YOUR_API_KEY"\n    }\n  }\n}`, path: '~/.claude/claude_desktop_config.json' },
    { name: 'Cursor', logo: '⚡', description: 'Add to .cursor/mcp.json', config: `{\n  "servers": {\n    "swat": {\n      "url": "${MCP_URL}",\n      "apiKey": "YOUR_API_KEY"\n    }\n  }\n}`, path: '.cursor/mcp.json' },
    { name: 'ChatGPT (Actions)', logo: '💬', description: 'Import via OpenAPI spec URL', config: `https://mcp.swat.io/openapi.json`, path: 'GPT Editor → Actions → Import from URL' },
  ]
  const tools = [
    { name: 'create_campaign', description: 'Create a campaign with ads, messages, and follow-up flow' },
    { name: 'list_campaigns', description: 'List all campaigns with status and stats' },
    { name: 'update_campaign', description: 'Update content, status, or targeting' },
    { name: 'get_replies', description: 'Fetch incoming replies from any campaign' },
    { name: 'send_message', description: 'Send or approve a reply to a prospect' },
    { name: 'create_ad', description: 'Add an ad variant to an existing campaign' },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      <div style={{ maxWidth: 680 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Connect via MCP</h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px', lineHeight: 1.7 }}>Create and manage campaigns directly from Claude, ChatGPT, Cursor, or any MCP-compatible AI tool.</p>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 9, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Terminal size={14} style={{ color: '#d97706', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#92400e', marginBottom: 3 }}>Your MCP API Key</div>
            <code style={{ fontSize: 12, color: '#374151', background: '#fff', padding: '2px 7px', borderRadius: 4, border: '1px solid #fde68a' }}>swt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
          </div>
          <button onClick={() => copy('swt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'key')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, border: '1px solid #fde68a', background: '#fff', fontSize: 11, fontWeight: 500, color: '#92400e', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Copy size={11} /> {copied === 'key' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Connect your AI tool</div>
        <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
          {clients.map(c => (
            <div key={c.name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{c.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{c.description}</div>
                </div>
                <button onClick={() => copy(c.config, c.name)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 5, border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: 11, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Copy size={11} /> {copied === c.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ margin: 0, padding: '10px 14px', fontSize: 11, color: '#374151', lineHeight: 1.6, background: '#f8fafc', overflow: 'auto', fontFamily: 'monospace' }}>{c.config}</pre>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Available tools</div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9, overflow: 'hidden', marginBottom: 16 }}>
          {tools.map((t, i) => (
            <div key={t.name} style={{ padding: '9px 14px', borderBottom: i < tools.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', background: '#faf5ff', padding: '2px 7px', borderRadius: 4, flexShrink: 0 }}>{t.name}</code>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{t.description}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '11px 14px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 12, color: '#15803d' }}>
          <strong>Example in Claude:</strong> "Create a campaign to find social media managers targeting B2B SaaS companies in Europe, with a friendly tone."
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', color: '#111827', outline: 'none', boxSizing: 'border-box', background: '#fff' }
