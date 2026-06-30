import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCheck,
  Megaphone,
  MessageSquare,
  GitBranch,
  Clock,
  Mail,
  Edit3,
  Play,
  Pause,
  MoreHorizontal,
  Users,
  BarChart2,
  ArrowRight,
  Bot,
  Zap,
  Copy,
  Terminal,
  Send,
  Wand2,
} from 'lucide-react'

interface Ad {
  id: string
  headline: string
  body: string
  cta: string
  platform: 'linkedin' | 'instagram' | 'twitter'
}

interface LinkedInMessage {
  id: string
  subject: string
  body: string
  angle: string
}

interface FollowUp {
  id: string
  delay: number
  unit: 'days' | 'hours'
  condition: string
  message: string
}

interface Campaign {
  id: string
  name: string
  goal: string
  status: 'draft' | 'active' | 'paused'
  leads: number
  replies: number
  createdAt: string
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Q3 Social Media Manager Outreach', goal: 'Hire social media managers', status: 'active', leads: 142, replies: 31, createdAt: '2026-06-01' },
  { id: 'c2', name: 'Agency Partnership Program', goal: 'Find agency partners', status: 'paused', leads: 87, replies: 14, createdAt: '2026-05-15' },
]

const DEFAULT_ADS: Ad[] = [
  {
    id: 'a1',
    headline: '🚀 Join Our Social Media Team',
    body: 'We\'re growing fast and looking for a creative Social Media Manager to own our brand voice across LinkedIn, Instagram & X. You\'ll get full creative freedom, a remote-first setup, and real impact on a product used by 5,000+ brands. Sound like you?',
    cta: 'Apply now →',
    platform: 'linkedin',
  },
  {
    id: 'a2',
    headline: 'Social Media Manager — Remote, Flexible, Impactful',
    body: 'Tired of approvals that take forever? At Swat, you own your content calendar. We\'re hiring a Social Media Manager who thinks in content series, not one-off posts. Competitive salary · 32-hr work week option · Full benefits.',
    cta: 'See the role',
    platform: 'instagram',
  },
  {
    id: 'a3',
    headline: 'We\'re Hiring a Social Media Manager Who Gets B2B',
    body: 'Most B2B social is boring. We\'re fixing that — and we need your help. Looking for someone who can turn complex SaaS features into stories people actually want to share. If you\'ve grown a B2B audience before, let\'s talk.',
    cta: 'Learn more',
    platform: 'twitter',
  },
]

const DEFAULT_MESSAGES: LinkedInMessage[] = [
  {
    id: 'm1',
    angle: 'Creative angle',
    subject: 'Saw your content — want to create more of it?',
    body: 'Hi {first_name},\n\nI came across your work and immediately thought: this is exactly the voice we\'re looking for at Swat.\n\nWe\'re a social media management platform used by 5,000+ brands, and we\'re looking for a Social Media Manager who can own our own channels with the same energy.\n\nFull creative freedom, remote-first, competitive comp. Would love to share more details if you\'re open to a quick chat?',
  },
  {
    id: 'm2',
    angle: 'Pain-point angle',
    subject: 'Quick question about your current role',
    body: 'Hi {first_name},\n\nI know the feeling: great ideas, not enough time (or budget approval) to execute them.\n\nWe\'re building a team at Swat where the Social Media Manager actually calls the shots — content strategy, channel mix, posting cadence, all of it.\n\nWe\'re early enough that your work will shape how thousands of people perceive us. If that sounds interesting, happy to tell you more.',
  },
  {
    id: 'm3',
    angle: 'Data-driven angle',
    subject: 'Growing from 2K → 40K followers — want to do it again?',
    body: 'Hi {first_name},\n\nWe grew our LinkedIn from 2K to 40K followers in 18 months with a team of two. Now we\'re hiring a Social Media Manager to take it further across all channels.\n\nI think your background in {industry} makes you a strong fit — you understand the audience we\'re trying to reach.\n\nWorth a 20-minute call to explore?',
  },
]

const DEFAULT_FOLLOWUPS: FollowUp[] = [
  {
    id: 'f1',
    delay: 3,
    unit: 'days',
    condition: 'No reply to initial message',
    message: 'Hi {first_name}, just wanted to bump this up in case it got buried. Still think you\'d be a great fit — happy to answer any questions about the role or team culture.',
  },
  {
    id: 'f2',
    delay: 7,
    unit: 'days',
    condition: 'No reply to follow-up 1',
    message: 'Last nudge from me, {first_name}. If the timing isn\'t right, totally understand. If it ever is, feel free to reach out — the role will be open for a few more weeks.',
  },
  {
    id: 'f3',
    delay: 1,
    unit: 'days',
    condition: 'Replied with interest',
    message: 'Great to hear from you, {first_name}! I\'ll send over a calendar link so we can find a time that works. In the meantime, here\'s a bit more about what the day-to-day looks like: [link to job description].',
  },
]

const STEPS = ['Brief', 'Ads', 'LinkedIn Messages', 'Follow-up Flow', 'Review']

export function Publisher() {
  const [view, setView] = useState<'list' | 'wizard' | 'chat' | 'mcp'>('list')
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [campaignName, setCampaignName] = useState('')
  const [audience, setAudience] = useState('')
  const [ads, setAds] = useState<Ad[]>(DEFAULT_ADS)
  const [messages, setMessages] = useState<LinkedInMessage[]>(DEFAULT_MESSAGES)
  const [followUps, setFollowUps] = useState<FollowUp[]>(DEFAULT_FOLLOWUPS)
  const [editingAd, setEditingAd] = useState<string | null>(null)
  const [editingMsg, setEditingMsg] = useState<string | null>(null)
  const [launched, setLaunched] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)

  function startWizard() {
    setStep(0); setGoal(''); setCampaignName(''); setAudience('')
    setAds(DEFAULT_ADS); setMessages(DEFAULT_MESSAGES); setFollowUps(DEFAULT_FOLLOWUPS)
    setLaunched(false); setView('wizard')
  }

  function addCampaign(name: string, goal: string) {
    setCampaigns(prev => [{
      id: `c${Date.now()}`, name, goal, status: 'active', leads: 0, replies: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }, ...prev])
  }

  function launch() {
    setLaunched(true)
    addCampaign(campaignName || 'New Campaign', goal)
  }

  if (view === 'list') {
    return <CampaignList campaigns={campaigns} onWizard={startWizard} onChat={() => setView('chat')} onMcp={() => setView('mcp')} />
  }
  if (view === 'chat') {
    return <ChatCreator onBack={() => setView('list')} onLaunch={addCampaign} />
  }
  if (view === 'mcp') {
    return <McpPanel onBack={() => setView('list')} />
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#f9fafb', overflow: 'hidden' }}>
      {/* Wizard header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <ChevronLeft size={16} /> Campaigns
        </button>
        <span style={{ color: '#e5e7eb' }}>|</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>New Campaign</span>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginLeft: 'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 6,
                background: i === step ? '#f0fdf4' : 'transparent',
                cursor: i < step ? 'pointer' : 'default',
              }} onClick={() => { if (i < step) setStep(i) }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i < step ? '#22c55e' : i === step ? '#111827' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? '#111827' : i < step ? '#22c55e' : '#9ca3af', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? '#22c55e' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {step === 0 && (
          <StepBrief goal={goal} setGoal={setGoal} name={campaignName} setName={setCampaignName} audience={audience} setAudience={setAudience} />
        )}
        {step === 1 && (
          <StepAds ads={ads} setAds={setAds} editingId={editingAd} setEditingId={setEditingAd} />
        )}
        {step === 2 && (
          <StepMessages messages={messages} setMessages={setMessages} editingId={editingMsg} setEditingId={setEditingMsg} />
        )}
        {step === 3 && (
          <StepFollowUp followUps={followUps} setFollowUps={setFollowUps} />
        )}
        {step === 4 && (
          <StepReview
            name={campaignName} goal={goal} audience={audience}
            ads={ads} messages={messages} followUps={followUps}
            launched={launched} onLaunch={launch} onBack={() => setView('list')}
          />
        )}
      </div>

      {/* Footer nav */}
      {!launched && (
        <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button
            onClick={() => step > 0 ? setStep(step - 1) : setView('list')}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !goal.trim()}
              style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: step === 0 && !goal.trim() ? '#d1d5db' : '#111827', fontSize: 13, fontWeight: 600, color: '#fff', cursor: step === 0 && !goal.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Continue <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Campaign List ─────────────────────────────────────────── */
function CampaignList({ campaigns, onWizard, onChat, onMcp }: {
  campaigns: Campaign[]; onWizard: () => void; onChat: () => void; onMcp: () => void
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#f9fafb', overflow: 'hidden' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Publisher</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>Campaigns</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* Creation mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          <CreationCard
            icon={<Wand2 size={22} style={{ color: '#7c3aed' }} />}
            bg="#faf5ff" border="#e9d5ff"
            title="Step-by-step Wizard"
            description="Walk through a guided flow: set your goal, review AI-generated ads, LinkedIn messages, and a follow-up sequence."
            cta="Open Wizard"
            ctaColor="#7c3aed"
            onClick={onWizard}
          />
          <CreationCard
            icon={<Bot size={22} style={{ color: '#2563eb' }} />}
            bg="#eff6ff" border="#bfdbfe"
            title="Chat with AI"
            description="Describe your campaign in plain language. The AI asks follow-up questions and builds everything for you in one conversation."
            cta="Start Chat"
            ctaColor="#2563eb"
            onClick={onChat}
          />
          <CreationCard
            icon={<Zap size={22} style={{ color: '#d97706' }} />}
            bg="#fffbeb" border="#fde68a"
            title="Connect via MCP"
            description="Create and manage campaigns directly from Claude, ChatGPT, Cursor, or any MCP-compatible AI tool."
            cta="Setup MCP"
            ctaColor="#d97706"
            onClick={onMcp}
          />
        </div>

        {/* Campaign list */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Your campaigns</span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{campaigns.length} total</span>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {campaigns.map(c => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: c.status === 'active' ? '#f0fdf4' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.status === 'active' ? <Play size={15} style={{ color: '#22c55e' }} /> : <Pause size={15} style={{ color: '#9ca3af' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{c.goal}</div>
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <Stat icon={<Users size={13} />} label="Leads" value={c.leads} />
                <Stat icon={<MessageSquare size={13} />} label="Replies" value={c.replies} />
                <Stat icon={<BarChart2 size={13} />} label="Rate" value={`${c.leads ? Math.round((c.replies / c.leads) * 100) : 0}%`} />
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: c.status === 'active' ? '#dcfce7' : '#f3f4f6', color: c.status === 'active' ? '#15803d' : '#6b7280' }}>
                {c.status === 'active' ? 'Active' : 'Paused'}
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 4 }}>
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CreationCard({ icon, bg, border, title, description, cta, ctaColor, onClick }: {
  icon: React.ReactNode; bg: string; border: string
  title: string; description: string; cta: string; ctaColor: string; onClick: () => void
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${border}` }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{description}</div>
      </div>
      <button onClick={e => { e.stopPropagation(); onClick() }} style={{ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 7, border: `1px solid ${ctaColor}30`, background: '#fff', fontSize: 12, fontWeight: 600, color: ctaColor, cursor: 'pointer', fontFamily: 'inherit' }}>
        {cta} →
      </button>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', color: '#6b7280', marginBottom: 2 }}>{icon}<span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span></div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{value}</div>
    </div>
  )
}

/* ─── Step 1: Brief ─────────────────────────────────────────── */
function StepBrief({ goal, setGoal, name, setName, audience, setAudience }: {
  goal: string; setGoal: (v: string) => void
  name: string; setName: (v: string) => void
  audience: string; setAudience: (v: string) => void
}) {
  const suggestions = [
    'Find social media managers for our team',
    'Generate leads for our agency tier',
    'Recruit content creators & influencers',
    'Promote our new AI features to marketing teams',
  ]
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>What\'s this campaign for?</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Describe your goal in plain language. AI will generate ads, messages, and a follow-up flow based on this.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Campaign goal *</label>
        <textarea
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. Find social media managers for our growing team — targeting people with 2–5 years experience in B2B SaaS"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setGoal(s)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Campaign name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Q3 Social Media Manager Outreach" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Target audience</label>
          <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Social media managers, 2–5 yrs exp, B2B SaaS" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginTop: 24, padding: '14px 16px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Sparkles size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 13, color: '#15803d' }}>
          <strong>AI will generate for you:</strong> 3 ad variants (LinkedIn, Instagram, X), 3 LinkedIn outreach messages with different angles, and a 3-step follow-up sequence with branching logic.
        </div>
      </div>
    </div>
  )
}

/* ─── Step 2: Ads ───────────────────────────────────────────── */
function StepAds({ ads, setAds, editingId, setEditingId }: {
  ads: Ad[]; setAds: (ads: Ad[]) => void
  editingId: string | null; setEditingId: (id: string | null) => void
}) {
  const platformColors: Record<string, string> = { linkedin: '#0077b5', instagram: '#e1306c', twitter: '#000' }
  const platformLabels: Record<string, string> = { linkedin: 'LinkedIn Ad', instagram: 'Instagram Ad', twitter: 'X (Twitter) Ad' }

  function updateAd(id: string, field: keyof Ad, value: string) {
    setAds(ads.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>3 Ad Variants</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Each ad is tailored to a different platform and angle. Click any field to edit.</p>
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        {ads.map((ad, i) => (
          <div key={ad.id} style={{ background: '#fff', borderRadius: 10, border: editingId === ad.id ? '2px solid #22c55e' : '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: platformColors[ad.platform], color: '#fff', fontSize: 11, fontWeight: 700 }}>{platformLabels[ad.platform]}</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Variant {i + 1}</span>
              <button onClick={() => setEditingId(editingId === ad.id ? null : ad.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Edit3 size={13} /> {editingId === ad.id ? 'Done' : 'Edit'}
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {editingId === ad.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={labelStyle}>Headline</label><input value={ad.headline} onChange={e => updateAd(ad.id, 'headline', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Body</label><textarea value={ad.body} onChange={e => updateAd(ad.id, 'body', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                  <div><label style={labelStyle}>CTA</label><input value={ad.cta} onChange={e => updateAd(ad.id, 'cta', e.target.value)} style={inputStyle} /></div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{ad.headline}</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>{ad.body}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>{ad.cta}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 3: LinkedIn Messages ─────────────────────────────── */
function StepMessages({ messages, setMessages, editingId, setEditingId }: {
  messages: LinkedInMessage[]; setMessages: (m: LinkedInMessage[]) => void
  editingId: string | null; setEditingId: (id: string | null) => void
}) {
  function updateMsg(id: string, field: keyof LinkedInMessage, value: string) {
    setMessages(messages.map(m => m.id === id ? { ...m, [field]: value } : m))
  }
  const angleColors = ['#7c3aed', '#2563eb', '#0891b2']

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>3 LinkedIn Outreach Messages</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Each message uses a different hook. A/B test which angle resonates best with your audience.</p>
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={msg.id} style={{ background: '#fff', borderRadius: 10, border: editingId === msg.id ? '2px solid #22c55e' : '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: angleColors[i] + '15', color: angleColors[i], fontSize: 11, fontWeight: 700, border: `1px solid ${angleColors[i]}30` }}>{msg.angle}</span>
              <button onClick={() => setEditingId(editingId === msg.id ? null : msg.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Edit3 size={13} /> {editingId === msg.id ? 'Done' : 'Edit'}
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {editingId === msg.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={labelStyle}>Subject / Opening line</label><input value={msg.subject} onChange={e => updateMsg(msg.id, 'subject', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Message body</label><textarea value={msg.body} onChange={e => updateMsg(msg.id, 'body', e.target.value)} rows={8} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} /></div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 8 }}>"{msg.subject}"</div>
                  <pre style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.body}</pre>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 4: Follow-up Flow ────────────────────────────────── */
function StepFollowUp({ followUps, setFollowUps }: { followUps: FollowUp[]; setFollowUps: (f: FollowUp[]) => void }) {
  function updateFollowUp(id: string, field: keyof FollowUp, value: string | number) {
    setFollowUps(followUps.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const conditionColors: Record<string, { bg: string; text: string; border: string }> = {
    'No reply to initial message': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    'No reply to follow-up 1': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Replied with interest': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Follow-up Flow</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Automated messages sent based on how contacts respond. Timing and messages are fully editable.</p>
      </div>

      {/* Flow diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
        {/* Start node */}
        <FlowNode icon={<Mail size={14} />} label="Initial outreach sent" color="#111827" bg="#111827" textColor="#fff" />

        {followUps.map((fu, i) => {
          const colors = conditionColors[fu.condition] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
          const isPositive = fu.condition.includes('interest')
          return (
            <div key={fu.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              {/* Arrow + condition */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: isPositive ? 60 : 0, marginLeft: isPositive ? 0 : 20, marginTop: 4, marginBottom: 4 }}>
                {isPositive ? <ArrowRight size={14} style={{ color: '#22c55e', flexShrink: 0 }} /> : <div style={{ width: 1, height: 20, background: '#e5e7eb', marginLeft: 19 }} />}
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {fu.condition}
                </span>
                {!isPositive && (
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>→ wait <strong style={{ color: '#374151' }}>{fu.delay} {fu.unit}</strong></span>
                )}
              </div>

              {/* Message card */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', width: '100%', overflow: 'hidden', marginLeft: isPositive ? 60 : 0 }}>
                <div style={{ padding: '8px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={12} style={{ color: '#9ca3af' }} />
                  {!isPositive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>Send after</span>
                      <input
                        type="number"
                        value={fu.delay}
                        onChange={e => updateFollowUp(fu.id, 'delay', parseInt(e.target.value) || 1)}
                        style={{ width: 40, padding: '2px 6px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: 11, color: '#6b7280' }}>days with no reply</span>
                    </div>
                  )}
                  {isPositive && <span style={{ fontSize: 11, color: '#6b7280' }}>Auto-reply when interest detected</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>Step {i + 1}</span>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <textarea
                    value={fu.message}
                    onChange={e => updateFollowUp(fu.id, 'message', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          )
        })}

        {/* End node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: 1, height: 20, background: '#e5e7eb', marginLeft: 19, marginTop: 4 }} />
          <FlowNode icon={<CheckCheck size={14} />} label="Campaign ends / contact archived" color="#6b7280" bg="#f3f4f6" textColor="#6b7280" />
        </div>
      </div>
    </div>
  )
}

function FlowNode({ icon, label, color, bg, textColor }: { icon: React.ReactNode; label: string; color: string; bg: string; textColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  )
}

/* ─── Step 5: Review & Launch ───────────────────────────────── */
function StepReview({ name, goal, audience, ads, messages, followUps, launched, onLaunch, onBack }: {
  name: string; goal: string; audience: string
  ads: Ad[]; messages: LinkedInMessage[]; followUps: FollowUp[]
  launched: boolean; onLaunch: () => void; onBack: () => void
}) {
  if (launched) {
    return (
      <div style={{ maxWidth: 520, textAlign: 'center', margin: '80px auto 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCheck size={28} style={{ color: '#22c55e' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>Campaign launched! 🚀</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6 }}>
          <strong>{name || 'Your campaign'}</strong> is now live. We'll start sending outreach messages and you'll get notified as replies come in.
        </p>
        <button onClick={onBack} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#111827', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
          Back to Campaigns
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Review & Launch</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Everything looks good? Hit launch to start the campaign.</p>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <ReviewSection icon={<Megaphone size={15} />} title="Campaign Brief">
          <div style={{ fontSize: 13, color: '#374151' }}><strong>Goal:</strong> {goal || '—'}</div>
          {name && <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}><strong>Name:</strong> {name}</div>}
          {audience && <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}><strong>Audience:</strong> {audience}</div>}
        </ReviewSection>

        <ReviewSection icon={<BarChart2 size={15} />} title={`${ads.length} Ad Variants`}>
          {ads.map((ad, i) => (
            <div key={ad.id} style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              <strong>{i + 1}. {ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1)}:</strong> {ad.headline}
            </div>
          ))}
        </ReviewSection>

        <ReviewSection icon={<MessageSquare size={15} />} title={`${messages.length} LinkedIn Messages`}>
          {messages.map((m, i) => (
            <div key={m.id} style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              <strong>{i + 1}. {m.angle}:</strong> "{m.subject}"
            </div>
          ))}
        </ReviewSection>

        <ReviewSection icon={<GitBranch size={15} />} title={`${followUps.length}-step Follow-up Flow`}>
          {followUps.map((f, i) => (
            <div key={f.id} style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              <strong>Step {i + 1}:</strong> {f.condition} → {f.delay} {f.unit} later
            </div>
          ))}
        </ReviewSection>
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
        <button
          onClick={onLaunch}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px', borderRadius: 8, border: 'none', background: '#22c55e', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Play size={15} fill="#fff" /> Launch Campaign
        </button>
        <button style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
          Save as Draft
        </button>
      </div>
    </div>
  )
}

function ReviewSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#6b7280' }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{title}</span>
      </div>
      <div style={{ padding: '12px 16px' }}>{children}</div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid #e5e7eb',
  fontSize: 13, fontFamily: 'inherit', color: '#111827', outline: 'none',
  boxSizing: 'border-box', background: '#fff',
}

/* ─── Chat Creator ──────────────────────────────────────────── */
interface ChatMsg { role: 'ai' | 'user'; text: string; ts?: number }

const CHAT_FLOW: { prompt: string; key: string }[] = [
  { key: 'goal',     prompt: "Hi! I'll help you create a campaign in a few questions.\n\nWhat's the main goal of this campaign? For example: *find social media managers*, *generate leads for our agency tier*, or *promote a product launch*." },
  { key: 'audience', prompt: "Got it. Who are you targeting? Be as specific as you like — role, seniority, industry, company size, geography, etc." },
  { key: 'tone',     prompt: "What tone should the messages have? (e.g. friendly and direct, professional, bold and punchy, empathetic)" },
  { key: 'confirm',  prompt: "Perfect. Based on that I'll generate:\n\n• **3 ad variants** (LinkedIn, Instagram, X)\n• **3 LinkedIn outreach messages** (creative / pain-point / data-driven angles)\n• **A 3-step follow-up sequence** with branching logic\n\nShall I go ahead and create the campaign?" },
]

function ChatCreator({ onBack, onLaunch }: { onBack: () => void; onLaunch: (name: string, goal: string) => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: 'ai', text: CHAT_FLOW[0].prompt }])
  const [input, setInput] = useState('')
  const [flowIdx, setFlowIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, generating])

  function send() {
    const text = input.trim()
    if (!text) return
    const key = CHAT_FLOW[flowIdx]?.key ?? ''
    const newAnswers = { ...answers, [key]: text }
    setAnswers(newAnswers)
    setMsgs(prev => [...prev, { role: 'user', text }])
    setInput('')

    const nextIdx = flowIdx + 1
    setFlowIdx(nextIdx)

    if (nextIdx < CHAT_FLOW.length) {
      setTimeout(() => {
        setMsgs(prev => [...prev, { role: 'ai', text: CHAT_FLOW[nextIdx].prompt }])
      }, 600)
    } else {
      // User confirmed — simulate generation
      setGenerating(true)
      setTimeout(() => {
        setGenerating(false)
        setDone(true)
        const name = newAnswers.goal?.slice(0, 50) || 'New Campaign'
        setMsgs(prev => [...prev, { role: 'ai', text: `✅ Done! I've created **"${name}"** with 3 ads, 3 LinkedIn messages, and a follow-up sequence.\n\nThe campaign is now in your list and ready to launch.` }])
        onLaunch(name, newAnswers.goal || '')
      }, 2000)
    }
  }

  const suggestions: Record<string, string[]> = {
    goal: ['Find social media managers', 'Generate leads for agency tier', 'Promote our AI features', 'Recruit content creators'],
    tone: ['Friendly and direct', 'Professional and concise', 'Bold and punchy', 'Empathetic and human'],
  }
  const currentKey = CHAT_FLOW[flowIdx]?.key ?? ''
  const chips = suggestions[currentKey] ?? []

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <ChevronLeft size={16} /> Campaigns
        </button>
        <span style={{ color: '#e5e7eb' }}>|</span>
        <Bot size={16} style={{ color: '#2563eb' }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Chat Campaign Creator</span>
        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>Powered by AI</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 0, background: '#f9fafb' }}>
        <div style={{ maxWidth: 660, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
              {m.role === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Bot size={15} style={{ color: '#2563eb' }} />
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: m.role === 'ai' ? '#fff' : '#2563eb',
                border: m.role === 'ai' ? '1px solid #e5e7eb' : 'none',
                fontSize: 13, lineHeight: 1.7,
                color: m.role === 'ai' ? '#111827' : '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                whiteSpace: 'pre-wrap',
              }}>
                {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
              {m.role === 'user' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontSize: 12, fontWeight: 700, color: '#fff' }}>R</div>
              )}
            </div>
          ))}
          {generating && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={15} style={{ color: '#2563eb' }} />
              </div>
              <div style={{ padding: '12px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} style={{ color: '#2563eb' }} />
                <span style={{ fontSize: 13, color: '#6b7280' }}>Generating your campaign…</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', opacity: 0.4, animation: `pulse ${0.8 + i * 0.2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestion chips */}
      {chips.length > 0 && !done && (
        <div style={{ background: '#f9fafb', padding: '0 24px 10px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {chips.map(c => (
            <button key={c} onClick={() => { setInput(c) }} style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>{c}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '14px 24px', flexShrink: 0 }}>
        {done ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={onBack} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#111827', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>← Back to Campaigns</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, maxWidth: 660, margin: '0 auto', width: '100%' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send() }}
              placeholder={flowIdx >= CHAT_FLOW.length - 1 ? 'Type "yes" to confirm…' : 'Type your answer…'}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
              autoFocus
            />
            <button onClick={send} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', background: input.trim() ? '#2563eb' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
              <Send size={15} style={{ color: '#fff' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── MCP Panel ─────────────────────────────────────────────── */
function McpPanel({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const MCP_URL = 'https://mcp.swat.io/v1'
  const clients = [
    {
      name: 'Claude (Desktop)',
      logo: '🤖',
      description: 'Add Swat as an MCP server in Claude\'s settings.',
      config: `{
  "mcpServers": {
    "swat": {
      "url": "${MCP_URL}",
      "apiKey": "YOUR_API_KEY"
    }
  }
}`,
      path: '~/.claude/claude_desktop_config.json',
    },
    {
      name: 'Cursor',
      logo: '⚡',
      description: 'Add to your .cursor/mcp.json to use Swat tools in AI chat.',
      config: `{
  "servers": {
    "swat": {
      "url": "${MCP_URL}",
      "apiKey": "YOUR_API_KEY"
    }
  }
}`,
      path: '.cursor/mcp.json',
    },
    {
      name: 'ChatGPT (Actions)',
      logo: '💬',
      description: 'Import Swat as a GPT Action using the OpenAPI spec.',
      config: `https://mcp.swat.io/openapi.json`,
      path: 'GPT Editor → Actions → Import from URL',
    },
  ]

  const tools = [
    { name: 'create_campaign', description: 'Create a new campaign with ads, messages, and follow-up flow' },
    { name: 'list_campaigns', description: 'List all campaigns with status and performance stats' },
    { name: 'update_campaign', description: 'Update campaign content, status, or targeting' },
    { name: 'get_replies', description: 'Fetch incoming replies from any campaign' },
    { name: 'send_message', description: 'Send or approve a reply to a prospect' },
    { name: 'create_ad', description: 'Add a new ad variant to an existing campaign' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <ChevronLeft size={16} /> Campaigns
        </button>
        <span style={{ color: '#e5e7eb' }}>|</span>
        <Zap size={16} style={{ color: '#d97706' }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Connect via MCP</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Model Context Protocol</h2>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 }}>
              Connect Swat to any MCP-compatible AI tool and create campaigns, fetch replies, and manage your inbox directly from your AI assistant. No copy-paste, no switching tabs.
            </p>
          </div>

          {/* API Key */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Terminal size={16} style={{ color: '#d97706', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Your MCP API Key</div>
              <code style={{ fontSize: 12, color: '#374151', background: '#fff', padding: '3px 8px', borderRadius: 5, border: '1px solid #fde68a' }}>swt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
            </div>
            <button onClick={() => copy('swt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'key')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: '1px solid #fde68a', background: '#fff', fontSize: 12, fontWeight: 500, color: '#92400e', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Copy size={12} /> {copied === 'key' ? 'Copied!' : 'Copy key'}
            </button>
          </div>

          {/* Client configs */}
          <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 600, color: '#374151' }}>Connect your AI tool</div>
          <div style={{ display: 'grid', gap: 14, marginBottom: 28 }}>
            {clients.map(client => (
              <div key={client.name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{client.logo}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{client.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{client.description}</div>
                  </div>
                  <button onClick={() => copy(client.config, client.name)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: 12, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Copy size={12} /> {copied === client.name ? 'Copied!' : 'Copy config'}
                  </button>
                </div>
                <div style={{ padding: '12px 16px', background: '#f8fafc' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Add to <code style={{ background: '#e5e7eb', padding: '1px 5px', borderRadius: 3 }}>{client.path}</code></div>
                  <pre style={{ margin: 0, fontSize: 12, color: '#374151', lineHeight: 1.6, overflow: 'auto', fontFamily: 'monospace' }}>{client.config}</pre>
                </div>
              </div>
            ))}
          </div>

          {/* Available tools */}
          <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 600, color: '#374151' }}>Available MCP tools</div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            {tools.map((t, i) => (
              <div key={t.name} style={{ padding: '11px 16px', borderBottom: i < tools.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <code style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', background: '#faf5ff', padding: '2px 8px', borderRadius: 5, flexShrink: 0 }}>{t.name}</code>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{t.description}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 12, color: '#15803d' }}>
            <strong>Example prompt in Claude:</strong> "Create a campaign to find social media managers targeting B2B SaaS companies in Europe. Make it friendly and direct."
          </div>
        </div>
      </div>
    </div>
  )
}
