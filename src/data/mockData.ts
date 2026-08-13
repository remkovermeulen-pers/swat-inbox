export type MessageStatus = 'unanswered' | 'answered' | 'ai_pending'

export type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type InboxFilter = 'new' | 'starred' | 'assigned_me' | 'assigned_others' | 'archive' | 'all'

export interface SocialProfile {
  platform: Platform
  handle: string
  followers: number
}

export interface Customer {
  id: string
  name: string
  avatar: string
  email: string
  mrr: number
  sentiment: Sentiment
  renewalDate: string
  socialProfiles: SocialProfile[]
  totalReach: number
}

export interface TimelineEvent {
  id: string
  type: 'message' | 'reply' | 'note' | 'status_change' | 'ai_suggestion'
  content: string
  author: string
  authorAvatar?: string
  timestamp: string
  platform?: Platform
  isCustomer: boolean
  aiSuggestion?: string
}

export interface Tag {
  label: string
  color: string
}

export interface Message {
  id: string
  brandId: string
  customerId: string
  subject: string
  preview: string
  status: MessageStatus
  platform: Platform
  channel: string
  timestamp: string
  timeline: TimelineEvent[]
  unread: boolean
  starred: boolean
  assignedTo?: string
  ticketNumber: string
  replyCount: number
  newReplies: number
  tags: Tag[]
  aiDraft?: string
  archived?: boolean
}

export type AutomationAction = 'auto_send' | 'approve' | 'escalate'

export interface AutomationRule {
  category: string
  icon: string
  action: AutomationAction
}

export interface BrandSettings {
  toneOfVoice: string
  instructions: string
  autoRespond: boolean
  escalationKeywords: string[]
  automationRules: AutomationRule[]
  sentimentRules: {
    positive: AutomationAction
    neutral: AutomationAction
    negative: AutomationAction
  }
  highReachRule: {
    threshold: number
    action: AutomationAction
  }
}

export interface Brand {
  id: string
  name: string
  logo: string
  color: string
  settings: BrandSettings
  unreadCount: number
}

export interface Channel {
  id: string
  platform: Platform
  name: string
  brandId: string
}

export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=47',
    email: 'sarah.chen@acme.com',
    mrr: 4200,
    sentiment: 'positive',
    renewalDate: '2026-09-15',
    totalReach: 1240,
    socialProfiles: [
      { platform: 'twitter', handle: '@sarahchen', followers: 42300 },
      { platform: 'instagram', handle: '@sarahchen.co', followers: 86100 },
    ],
  },
  {
    id: 'c2',
    name: 'Marcus Webb',
    avatar: 'https://i.pravatar.cc/150?img=12',
    email: 'marcus@techflow.io',
    mrr: 890,
    sentiment: 'negative',
    renewalDate: '2026-07-22',
    totalReach: 312,
    socialProfiles: [
      { platform: 'twitter', handle: '@marcuswebb', followers: 18900 },
      { platform: 'linkedin', handle: 'marcuswebb', followers: 12300 },
    ],
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'priya@growthlab.com',
    mrr: 2100,
    sentiment: 'neutral',
    renewalDate: '2026-11-03',
    totalReach: 478,
    socialProfiles: [
      { platform: 'instagram', handle: '@priyanair', followers: 54200 },
      { platform: 'tiktok', handle: '@priya.nair', followers: 13600 },
    ],
  },
  {
    id: 'c4',
    name: 'James Holloway',
    avatar: 'https://i.pravatar.cc/150?img=33',
    email: 'james@brandstudio.com',
    mrr: 6800,
    sentiment: 'positive',
    renewalDate: '2026-12-01',
    totalReach: 8900,
    socialProfiles: [
      { platform: 'twitter', handle: '@jamesholloway', followers: 89400 },
      { platform: 'instagram', handle: '@james.holloway', followers: 221000 },
      { platform: 'linkedin', handle: 'james-holloway', followers: 101600 },
    ],
  },
  {
    id: 'c5',
    name: 'Lena Müller',
    avatar: 'https://i.pravatar.cc/150?img=9',
    email: 'lena@digitalvibe.de',
    mrr: 1450,
    sentiment: 'negative',
    renewalDate: '2026-07-08',
    totalReach: 890,
    socialProfiles: [
      { platform: 'instagram', handle: '@lenamueller', followers: 22100 },
    ],
  },
  {
    id: 'c6',
    name: 'Anonymous profile',
    avatar: '',
    email: '',
    mrr: 0,
    sentiment: 'neutral',
    renewalDate: '2027-01-01',
    totalReach: 0,
    socialProfiles: [],
  },
  {
    id: 'c7',
    name: 'Tom Eriksson',
    avatar: 'https://i.pravatar.cc/150?img=15',
    email: 'tom.eriksson@gmail.com',
    mrr: 3200,
    sentiment: 'positive',
    renewalDate: '2026-10-18',
    totalReach: 3400,
    socialProfiles: [
      { platform: 'instagram', handle: '@tomeriksson', followers: 61200 },
      { platform: 'tiktok', handle: '@tom.eriksson', followers: 33300 },
    ],
  },
  {
    id: 'c8',
    name: 'Yasmin Al-Rashid',
    avatar: 'https://i.pravatar.cc/150?img=22',
    email: 'yasmin.alrashid@outlook.com',
    mrr: 1190,
    sentiment: 'neutral',
    renewalDate: '2026-08-30',
    totalReach: 187,
    socialProfiles: [
      { platform: 'twitter', handle: '@yasminrashid', followers: 9400 },
      { platform: 'facebook', handle: 'yasmin.alrashid', followers: 9300 },
    ],
  },
  {
    id: 'c9',
    name: 'Felix Gruber',
    avatar: 'https://i.pravatar.cc/150?img=36',
    email: 'felix.gruber@web.de',
    mrr: 560,
    sentiment: 'negative',
    renewalDate: '2026-07-14',
    totalReach: 143,
    socialProfiles: [
      { platform: 'facebook', handle: 'felix.gruber.de', followers: 7800 },
    ],
  },
  {
    id: 'c10',
    name: 'Isabelle Fontaine',
    avatar: 'https://i.pravatar.cc/150?img=44',
    email: 'i.fontaine@laposte.fr',
    mrr: 2750,
    sentiment: 'positive',
    renewalDate: '2026-11-22',
    totalReach: 621,
    socialProfiles: [
      { platform: 'instagram', handle: '@isabellefontaine', followers: 38100 },
      { platform: 'linkedin', handle: 'isabelle-fontaine', followers: 14200 },
    ],
  },
  {
    id: 'c11',
    name: 'Daan van der Berg',
    avatar: 'https://i.pravatar.cc/150?img=60',
    email: 'daan@vdberg.nl',
    mrr: 1870,
    sentiment: 'neutral',
    renewalDate: '2026-09-05',
    totalReach: 2100,
    socialProfiles: [
      { platform: 'twitter', handle: '@daanvdberg', followers: 24600 },
      { platform: 'instagram', handle: '@daan.vdberg', followers: 16600 },
    ],
  },
  {
    id: 'c12',
    name: 'Aiko Tanaka',
    avatar: 'https://i.pravatar.cc/150?img=67',
    email: 'aiko.tanaka@icloud.com',
    mrr: 0,
    sentiment: 'positive',
    renewalDate: '2027-01-01',
    totalReach: 12400,
    socialProfiles: [
      { platform: 'tiktok', handle: '@aikotanaka', followers: 142000 },
      { platform: 'instagram', handle: '@aiko.tanaka', followers: 47000 },
    ],
  },
  {
    id: 'c13',
    name: 'Omar Khalil',
    avatar: 'https://i.pravatar.cc/150?img=68',
    email: 'omar.khalil@gmail.com',
    mrr: 1320,
    sentiment: 'negative',
    renewalDate: '2026-08-12',
    totalReach: 234,
    socialProfiles: [
      { platform: 'twitter', handle: '@omarkhalil', followers: 11200 },
      { platform: 'facebook', handle: 'omar.khalil.eg', followers: 8900 },
    ],
  },
  {
    id: 'c14',
    name: 'Sofia Ricci',
    avatar: 'https://i.pravatar.cc/150?img=25',
    email: 'sofia.ricci@gmail.it',
    mrr: 3100,
    sentiment: 'positive',
    renewalDate: '2026-10-05',
    totalReach: 5600,
    socialProfiles: [
      { platform: 'instagram', handle: '@sofiatravelista', followers: 88400 },
      { platform: 'tiktok', handle: '@sofiatravelista', followers: 41200 },
    ],
  },
  {
    id: 'c15',
    name: 'Noah Bergmann',
    avatar: 'https://i.pravatar.cc/150?img=51',
    email: 'noah.bergmann@web.de',
    mrr: 760,
    sentiment: 'neutral',
    renewalDate: '2026-09-20',
    totalReach: 167,
    socialProfiles: [
      { platform: 'twitter', handle: '@noahberg', followers: 5600 },
    ],
  },
  {
    id: 'c16',
    name: 'Camille Dubois',
    avatar: 'https://i.pravatar.cc/150?img=29',
    email: 'camille.dubois@orange.fr',
    mrr: 2400,
    sentiment: 'positive',
    renewalDate: '2026-11-14',
    totalReach: 920,
    socialProfiles: [
      { platform: 'instagram', handle: '@camillestyledubois', followers: 31400 },
      { platform: 'linkedin', handle: 'camille-dubois-style', followers: 9800 },
    ],
  },
  {
    id: 'c17',
    name: 'Ravi Sharma',
    avatar: 'https://i.pravatar.cc/150?img=57',
    email: 'ravi.sharma@outlook.in',
    mrr: 980,
    sentiment: 'negative',
    renewalDate: '2026-07-30',
    totalReach: 389,
    socialProfiles: [
      { platform: 'twitter', handle: '@ravisharma_dev', followers: 14300 },
      { platform: 'linkedin', handle: 'ravi-sharma-dev', followers: 22100 },
    ],
  },
  {
    id: 'c18',
    name: 'Elena Vasquez',
    avatar: 'https://i.pravatar.cc/150?img=20',
    email: 'elena.vasquez@gmail.es',
    mrr: 1780,
    sentiment: 'neutral',
    renewalDate: '2026-10-28',
    totalReach: 740,
    socialProfiles: [
      { platform: 'instagram', handle: '@elenavasquez_fit', followers: 27600 },
      { platform: 'youtube', handle: 'ElenaFit', followers: 18900 },
    ],
  },
  {
    id: 'c19',
    name: 'Lucas Petit',
    avatar: 'https://i.pravatar.cc/150?img=53',
    email: 'lucas.petit@gmail.com',
    mrr: 430,
    sentiment: 'neutral',
    renewalDate: '2026-08-05',
    totalReach: 112,
    socialProfiles: [
      { platform: 'facebook', handle: 'lucas.petit.31', followers: 820 },
    ],
  },
  {
    id: 'c20',
    name: 'Zoe Williams',
    avatar: 'https://i.pravatar.cc/150?img=16',
    email: 'zoe.williams@icloud.com',
    mrr: 5200,
    sentiment: 'positive',
    renewalDate: '2026-12-10',
    totalReach: 4100,
    socialProfiles: [
      { platform: 'twitter', handle: '@zoewilliams', followers: 67800 },
      { platform: 'instagram', handle: '@zoewilliams', followers: 54200 },
    ],
  },
  {
    id: 'c21',
    name: 'Kenji Nakamura',
    avatar: 'https://i.pravatar.cc/150?img=70',
    email: 'kenji.nakamura@gmail.jp',
    mrr: 1650,
    sentiment: 'positive',
    renewalDate: '2026-09-08',
    totalReach: 2700,
    socialProfiles: [
      { platform: 'instagram', handle: '@kenjiruns', followers: 41600 },
      { platform: 'youtube', handle: 'KenjiRunsChannel', followers: 28400 },
    ],
  },
  {
    id: 'c22',
    name: 'Amara Osei',
    avatar: 'https://i.pravatar.cc/150?img=26',
    email: 'amara.osei@gmail.com',
    mrr: 2200,
    sentiment: 'positive',
    renewalDate: '2026-11-01',
    totalReach: 1850,
    socialProfiles: [
      { platform: 'tiktok', handle: '@amaraosei', followers: 73400 },
      { platform: 'instagram', handle: '@amaraosei', followers: 34200 },
    ],
  },
  {
    id: 'c23',
    name: 'Henrik Sørensen',
    avatar: 'https://i.pravatar.cc/150?img=56',
    email: 'henrik.sorensen@gmail.dk',
    mrr: 890,
    sentiment: 'negative',
    renewalDate: '2026-07-18',
    totalReach: 198,
    socialProfiles: [
      { platform: 'facebook', handle: 'henrik.sorensen.dk', followers: 4200 },
      { platform: 'twitter', handle: '@hsorensen', followers: 5800 },
    ],
  },
  {
    id: 'c24',
    name: 'Maria Santos',
    avatar: 'https://i.pravatar.cc/150?img=31',
    email: 'maria.santos@gmail.com.br',
    mrr: 3400,
    sentiment: 'positive',
    renewalDate: '2026-10-22',
    totalReach: 6800,
    socialProfiles: [
      { platform: 'instagram', handle: '@mariasantosfitness', followers: 112000 },
      { platform: 'tiktok', handle: '@mariasantosfitness', followers: 89000 },
    ],
  },
  {
    id: 'c25',
    name: 'Alex Kowalski',
    avatar: 'https://i.pravatar.cc/150?img=48',
    email: 'alex.kowalski@gmail.pl',
    mrr: 670,
    sentiment: 'neutral',
    renewalDate: '2026-08-25',
    totalReach: 276,
    socialProfiles: [
      { platform: 'twitter', handle: '@alexkowalski', followers: 3400 },
      { platform: 'linkedin', handle: 'alex-kowalski-pl', followers: 8900 },
    ],
  },
  {
    id: 'c26',
    name: 'Nadia Petrov',
    avatar: 'https://i.pravatar.cc/150?img=39',
    email: 'nadia.petrov@mail.ru',
    mrr: 1120,
    sentiment: 'negative',
    renewalDate: '2026-07-25',
    totalReach: 341,
    socialProfiles: [
      { platform: 'instagram', handle: '@nadiapetrov', followers: 18700 },
    ],
  },
  {
    id: 'c27',
    name: 'Patrick O\'Brien',
    avatar: 'https://i.pravatar.cc/150?img=58',
    email: 'patrick.obrien@gmail.ie',
    mrr: 4800,
    sentiment: 'positive',
    renewalDate: '2026-12-18',
    totalReach: 3200,
    socialProfiles: [
      { platform: 'twitter', handle: '@patrickobrienfit', followers: 52300 },
      { platform: 'instagram', handle: '@patrickobrienfit', followers: 41800 },
    ],
  },
  {
    id: 'c28',
    name: 'Linh Tran',
    avatar: 'https://i.pravatar.cc/150?img=62',
    email: 'linh.tran@gmail.vn',
    mrr: 1560,
    sentiment: 'neutral',
    renewalDate: '2026-09-30',
    totalReach: 543,
    socialProfiles: [
      { platform: 'tiktok', handle: '@linhtranofficial', followers: 29800 },
      { platform: 'instagram', handle: '@linhtranofficial', followers: 17400 },
    ],
  },
  {
    id: 'c29',
    name: 'Tobias Keller',
    avatar: 'https://i.pravatar.cc/150?img=61',
    email: 'tobias.keller@gmx.de',
    mrr: 2050,
    sentiment: 'neutral',
    renewalDate: '2026-10-14',
    totalReach: 418,
    socialProfiles: [
      { platform: 'instagram', handle: '@tobiaskeller', followers: 14600 },
      { platform: 'youtube', handle: 'TobiasKellerDE', followers: 22100 },
    ],
  },
  {
    id: 'c30',
    name: 'Chiara Moretti',
    avatar: 'https://i.pravatar.cc/150?img=21',
    email: 'chiara.moretti@libero.it',
    mrr: 730,
    sentiment: 'positive',
    renewalDate: '2026-08-18',
    totalReach: 289,
    socialProfiles: [
      { platform: 'instagram', handle: '@chiaramoretti', followers: 9400 },
      { platform: 'tiktok', handle: '@chiaramoretti', followers: 11200 },
    ],
  },
]

export const channels: Channel[] = [
  { id: 'ch-1', platform: 'facebook', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-2', platform: 'twitter', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-3', platform: 'instagram', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-4', platform: 'twitter', name: 'Spotify', brandId: 'brand-2' },
  { id: 'ch-5', platform: 'instagram', name: 'Spotify', brandId: 'brand-2' },
  { id: 'ch-6', platform: 'facebook', name: 'Spotify', brandId: 'brand-2' },
  { id: 'ch-7', platform: 'twitter', name: 'Airbnb', brandId: 'brand-3' },
  { id: 'ch-8', platform: 'instagram', name: 'Airbnb', brandId: 'brand-3' },
  { id: 'ch-9', platform: 'facebook', name: 'Airbnb', brandId: 'brand-3' },
]

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Nike Europe',
    logo: '👟',
    color: '#111827',
    unreadCount: 12,
    settings: {
      toneOfVoice: 'Energetic, motivational, and empowering. Use active voice and action-oriented language. Speak like a coach who believes in the customer.',
      instructions: `- Always acknowledge the customer's effort and passion first
- Never apologize excessively — be confident and solution-focused
- When handling complaints, offer immediate resolution + a motivational closing
- Use "you" language to keep it personal
- Sign off with an inspirational phrase like "Keep moving." or "Just do it."
- Escalate to human agent if order value > €200 or if customer mentions legal action`,
      autoRespond: true,
      escalationKeywords: ['lawyer', 'sue', 'refund escalation', 'manager'],
      automationRules: [
        { category: 'Compliments & praise', icon: '🙌', action: 'auto_send' },
        { category: 'General questions', icon: '💬', action: 'auto_send' },
        { category: 'Shipping & delivery', icon: '📦', action: 'approve' },
        { category: 'Returns & refunds', icon: '↩️', action: 'approve' },
        { category: 'Billing & payments', icon: '💳', action: 'approve' },
        { category: 'Technical issues', icon: '🔧', action: 'approve' },
        { category: 'Partnership inquiries', icon: '🤝', action: 'escalate' },
        { category: 'Complaints', icon: '😤', action: 'approve' },
        { category: 'Safety concerns', icon: '🚨', action: 'escalate' },
        { category: 'Legal / media', icon: '⚖️', action: 'escalate' },
      ],
      sentimentRules: {
        positive: 'auto_send',
        neutral: 'approve',
        negative: 'approve',
      },
      highReachRule: { threshold: 10000, action: 'escalate' },
    },
  },
  {
    id: 'brand-2',
    name: 'Spotify',
    logo: '🎵',
    color: '#1db954',
    unreadCount: 7,
    settings: {
      toneOfVoice: 'Friendly, music-savvy, and playful. Reference music culture naturally. Be concise — Spotify users are busy listening.',
      instructions: `- Keep replies short and punchy — 2-3 sentences max for simple issues
- Use music metaphors when appropriate but don't force it
- For billing issues: always offer immediate resolution first, then explain
- Be empathetic about Premium frustrations — people love music and expect it to work
- Never say "Unfortunately" — instead say "Here's what we can do:"`,
      autoRespond: false,
      escalationKeywords: ['fraud', 'hacked', 'unauthorized charge'],
      automationRules: [
        { category: 'Compliments & praise', icon: '🙌', action: 'auto_send' },
        { category: 'General questions', icon: '💬', action: 'auto_send' },
        { category: 'Playlist & library issues', icon: '🎵', action: 'approve' },
        { category: 'Billing & payments', icon: '💳', action: 'approve' },
        { category: 'Account access', icon: '🔑', action: 'approve' },
        { category: 'Technical issues', icon: '🔧', action: 'approve' },
        { category: 'Content & copyright', icon: '©️', action: 'escalate' },
        { category: 'Complaints', icon: '😤', action: 'approve' },
        { category: 'Safety concerns', icon: '🚨', action: 'escalate' },
        { category: 'Legal / media', icon: '⚖️', action: 'escalate' },
      ],
      sentimentRules: {
        positive: 'auto_send',
        neutral: 'approve',
        negative: 'escalate',
      },
      highReachRule: { threshold: 10000, action: 'approve' },
    },
  },
  {
    id: 'brand-3',
    name: 'Airbnb',
    logo: '🏠',
    color: '#ff5a5f',
    unreadCount: 4,
    settings: {
      toneOfVoice: 'Warm, inclusive, and community-minded. Sound like a knowledgeable friend who loves travel and hospitality.',
      instructions: `- Always validate the guest/host experience before jumping to solutions
- Use inclusive, global-friendly language (avoid regional slang)
- For safety concerns: treat as HIGH PRIORITY and escalate immediately
- Frame policies as protections, not restrictions`,
      autoRespond: true,
      escalationKeywords: ['unsafe', 'emergency', 'police', 'assault', 'robbery'],
      automationRules: [
        { category: 'Compliments & praise', icon: '🙌', action: 'auto_send' },
        { category: 'General questions', icon: '💬', action: 'auto_send' },
        { category: 'Booking questions', icon: '🗓️', action: 'approve' },
        { category: 'Refund requests', icon: '↩️', action: 'approve' },
        { category: 'Listing disputes', icon: '🏠', action: 'approve' },
        { category: 'Guest issues', icon: '👤', action: 'approve' },
        { category: 'Host disputes', icon: '🤝', action: 'escalate' },
        { category: 'Complaints', icon: '😤', action: 'approve' },
        { category: 'Safety concerns', icon: '🚨', action: 'escalate' },
        { category: 'Legal / media', icon: '⚖️', action: 'escalate' },
      ],
      sentimentRules: {
        positive: 'auto_send',
        neutral: 'approve',
        negative: 'escalate',
      },
      highReachRule: { threshold: 10000, action: 'escalate' },
    },
  },
]

const baseMessages: Message[] = [
  // ─── Nike Europe ─────────────────────────────────────────────────────────────

  {
    id: 'msg-1',
    brandId: 'brand-1',
    customerId: 'c1',
    subject: "My order hasn't arrived and I have a race this weekend!",
    preview: "I ordered the Air Max Pro 3 weeks ago and still haven't received them. I have a half marathon this weekend...",
    status: 'ai_pending',
    platform: 'twitter',
    channel: 'Nike Europe',
    timestamp: '2026-06-29T09:14:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162201',
    replyCount: 3,
    newReplies: 1,
    tags: [{ label: 'shipping', color: '#f97316' }, { label: 'urgent', color: '#dc2626' }],
    aiDraft: "Hey Sarah 👟 Your dedication to the race inspires us! We've flagged your order for priority handling — our logistics team is on it right now. We're arranging an express replacement from your nearest Nike store, arriving by Friday. You'll get a confirmation email within the hour. Race day is yours. Keep moving. 💪",
    timeline: [
      {
        id: 't1',
        type: 'message',
        content: "Hey @Nike — I ordered the Air Max Pro 3 weeks ago and still haven't received them. I have a half marathon this weekend and I'm freaking out. Order #NK-2847261. This is really disappointing from a brand I love.",
        author: 'Sarah Chen',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        timestamp: '2026-06-27T08:30:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't1b',
        type: 'status_change',
        content: 'Status changed to: Under Review',
        author: 'System',
        timestamp: '2026-06-27T08:45:00Z',
        isCustomer: false,
      },
      {
        id: 't1c',
        type: 'note',
        content: 'Checked order system. Shipment delayed at Frankfurt hub due to customs. Carrier tracking shows delivery estimate June 30.',
        author: 'Emma (Agent)',
        timestamp: '2026-06-27T09:10:00Z',
        isCustomer: false,
      },
      {
        id: 't1d',
        type: 'message',
        content: "Still nothing!! The race is Saturday. Can you expedite or send a replacement from a local store? I've been a Nike member for 8 years.",
        author: 'Sarah Chen',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        timestamp: '2026-06-29T09:14:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't1e',
        type: 'ai_suggestion',
        content: '',
        aiSuggestion: "Hey Sarah 👟 Your dedication to the race inspires us! We've flagged your order for priority handling — our logistics team is on it right now. We're arranging an express replacement from your nearest Nike store, arriving by Friday. You'll get a confirmation email within the hour. Race day is yours. Keep moving. 💪",
        author: 'AI Draft',
        timestamp: '2026-06-29T09:15:00Z',
        isCustomer: false,
      },
    ],
  },

  {
    id: 'msg-2',
    brandId: 'brand-1',
    customerId: 'c2',
    subject: 'Wrong size sent — this is the second time!',
    preview: 'I specifically ordered a EU 44 and you sent a 42 again. I want a full refund and a prepaid return label...',
    status: 'unanswered',
    platform: 'instagram',
    channel: 'Nike Europe',
    timestamp: '2026-06-29T07:22:00Z',
    unread: true,
    starred: true,
    assignedTo: 'Emma',
    ticketNumber: '#162198',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'returns', color: '#7c3aed' }],
    aiDraft: "Hey Marcus, getting the wrong size twice is completely unacceptable and we're sorry for putting you through this. Here's what we're doing right now: a EU 44 replacement is being expedited with express shipping, and a prepaid return label for both pairs will be in your inbox within the hour. No store visit needed — we're handling everything from our end. Keep pushing. 💪",
    timeline: [
      {
        id: 't2a',
        type: 'message',
        content: "This is the SECOND time you've sent me the wrong size. EU 44, not 42. I've been patient but this is ridiculous. I want a full refund and a prepaid return label immediately.",
        author: 'Marcus Webb',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        timestamp: '2026-06-29T07:22:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-3',
    brandId: 'brand-1',
    customerId: 'c4',
    subject: 'Collaboration inquiry — brand partnership',
    preview: 'Hi, I have 220k followers across platforms and would love to discuss a paid partnership...',
    status: 'answered',
    platform: 'linkedin',
    channel: 'Nike Europe',
    timestamp: '2026-06-28T14:05:00Z',
    unread: false,
    starred: false,
    assignedTo: 'Remko',
    ticketNumber: '#162163',
    replyCount: 2,
    newReplies: 0,
    tags: [{ label: 'partnership', color: '#0891b2' }],
    timeline: [
      {
        id: 't3a',
        type: 'message',
        content: "Hi Nike team! I'm James, a fitness content creator with 220k+ followers across Instagram, Twitter and LinkedIn. I'd love to discuss a potential brand partnership for the upcoming Fall collection. I've been wearing Nike exclusively for the past 3 years. Let's connect!",
        author: 'James Holloway',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        timestamp: '2026-06-28T14:05:00Z',
        platform: 'linkedin',
        isCustomer: true,
      },
      {
        id: 't3b',
        type: 'reply',
        content: "Hi James! Love your content and your dedication to fitness. Our partnerships team would love to connect. I'm forwarding your details to Emma from our Creator Program — she'll reach out within 2 business days. Keep pushing! 💪",
        author: 'Social Team',
        timestamp: '2026-06-28T15:30:00Z',
        isCustomer: false,
        platform: 'linkedin',
      },
    ],
  },

  {
    id: 'msg-8',
    brandId: 'brand-1',
    customerId: 'c9',
    subject: 'Sole detached after only 3 runs — €180 shoes!',
    preview: "The outer sole on my React Infinity Run completely peeled off. I've only worn them 3 times...",
    status: 'unanswered',
    platform: 'facebook',
    channel: 'Nike Europe',
    timestamp: '2026-06-29T06:48:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162196',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'defect', color: '#dc2626' }, { label: 'warranty', color: '#7c3aed' }],
    aiDraft: "Felix, a sole detaching after 3 runs is absolutely a manufacturing defect — this should never happen, especially at this price point. We're sending a replacement pair right away with express shipping; a prepaid return label for the defective pair will be included in the box. Your order #NK-3091445 is fully covered under our 2-year product guarantee. No further steps needed from your side. We're sorry for the hassle. Keep going. 💪",
    timeline: [
      {
        id: 't8a',
        type: 'message',
        content: "I bought the Nike React Infinity Run Flyknit 3 last month for €180. After literally 3 short runs the entire outer sole has peeled off from the heel. I take great care of my equipment. This is a manufacturing defect and I expect a replacement or full refund. Order #NK-3091445.",
        author: 'Felix Gruber',
        authorAvatar: 'https://i.pravatar.cc/150?img=36',
        timestamp: '2026-06-29T06:48:00Z',
        platform: 'facebook',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-9',
    brandId: 'brand-1',
    customerId: 'c12',
    subject: 'Dunk Low Panda restock — when??',
    preview: "Hi! Any idea when the Dunk Low Panda is restocking in EU42? I've been waiting for months 😭",
    status: 'answered',
    platform: 'instagram',
    channel: 'Nike Europe',
    timestamp: '2026-06-28T18:33:00Z',
    unread: false,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162177',
    replyCount: 2,
    newReplies: 0,
    tags: [{ label: 'stock', color: '#0891b2' }],
    timeline: [
      {
        id: 't9a',
        type: 'message',
        content: "Hi Nike! 👋 Do you have any info on when the Dunk Low Panda (white/black) will restock in EU42 for Europe? I've been checking every day for like 3 months and always miss it 😭 Pls tag me if you know!",
        author: 'Aiko Tanaka',
        authorAvatar: 'https://i.pravatar.cc/150?img=67',
        timestamp: '2026-06-28T18:33:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
      {
        id: 't9b',
        type: 'reply',
        content: "Hey Aiko! We feel that hunt 😄 We can't share exact restock dates, but we'd suggest turning on notifications for the Nike app — you'll get an instant alert the moment they drop. The SNKRS app also has early access drops. Don't give up! Just do it. 👟",
        author: 'Social Team',
        timestamp: '2026-06-28T19:10:00Z',
        isCustomer: false,
        platform: 'instagram',
      },
      {
        id: 't9c',
        type: 'message',
        content: "OMG thank you!! Installing SNKRS now. You're the best 🙏🙏",
        author: 'Aiko Tanaka',
        authorAvatar: 'https://i.pravatar.cc/150?img=67',
        timestamp: '2026-06-28T19:22:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-10',
    brandId: 'brand-1',
    customerId: 'c11',
    subject: 'Nike Run Club app not syncing with Apple Watch',
    preview: "Since the last update, my runs aren't syncing from Apple Watch to the NRC app. I'm losing all my data...",
    status: 'ai_pending',
    platform: 'twitter',
    channel: 'Nike Europe',
    timestamp: '2026-06-29T11:05:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162208',
    replyCount: 1,
    newReplies: 1,
    tags: [{ label: 'app', color: '#0891b2' }, { label: 'bug', color: '#dc2626' }],
    aiDraft: "Hey Daan! Losing training data mid-marathon prep is genuinely stressful and we hear you. Our team is aware of the Apple Watch sync issue introduced in v3.14 and a fix is shipping this week. In the meantime: go to Settings → Connected Apps → Apple Health → Sync Now to trigger a manual sync. If it still shows no data, toggling Bluetooth off and back on before opening NRC usually does the trick. Rotterdam is going to be amazing — keep moving! 🏃",
    timeline: [
      {
        id: 't10a',
        type: 'message',
        content: "@NikeRunClub ever since the v3.14 update last Tuesday, my Apple Watch Series 8 runs aren't syncing to the app. I've tried reinstalling, resetting permissions, everything. I'm training for Rotterdam marathon and losing my training data is really stressful.",
        author: 'Daan van der Berg',
        authorAvatar: 'https://i.pravatar.cc/150?img=60',
        timestamp: '2026-06-29T11:05:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't10b',
        type: 'ai_suggestion',
        content: '',
        aiSuggestion: "Hey Daan! We hear you — losing training data mid-marathon prep is the last thing you need. Our tech team is aware of the Apple Watch sync issue in v3.14 and a fix is being fast-tracked. In the meantime: try manually starting a sync from Settings > Connected Apps > Apple Health > Sync Now. Your Rotterdam run is going to be epic. Keep moving! 🏃",
        author: 'AI Draft',
        timestamp: '2026-06-29T11:06:00Z',
        isCustomer: false,
      },
    ],
  },

  {
    id: 'msg-11',
    brandId: 'brand-1',
    customerId: 'c7',
    subject: 'Just ran my first 10K in Nike — had to share!',
    preview: "Wore my new Pegasus 41s for my first ever 10K race today and they were PERFECT. Just had to tell you!",
    status: 'answered',
    platform: 'instagram',
    channel: 'Nike Europe',
    timestamp: '2026-06-28T20:17:00Z',
    unread: false,
    starred: true,
    assignedTo: undefined,
    ticketNumber: '#162181',
    replyCount: 1,
    newReplies: 0,
    tags: [{ label: 'feedback', color: '#16a34a' }],
    timeline: [
      {
        id: 't11a',
        type: 'message',
        content: "Just finished my first ever 10K race in 51:22 wearing the new Pegasus 41s 🏅 They felt incredible from km 1 to the finish line — zero blisters, perfect cushioning. I've been running in Adidas for 6 years and switching to Nike was the best decision I've made. THANK YOU!",
        author: 'Tom Eriksson',
        authorAvatar: 'https://i.pravatar.cc/150?img=15',
        timestamp: '2026-06-28T20:17:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
      {
        id: 't11b',
        type: 'reply',
        content: "Tom, this just made our entire day!! 🎉 51:22 in your first 10K is seriously impressive — and we're so glad the Pegasus 41s were there every step of the way. Welcome to the Nike family. Your next PB is already waiting for you. Keep moving! 🏃‍♂️💚",
        author: 'Social Team',
        timestamp: '2026-06-28T20:45:00Z',
        isCustomer: false,
        platform: 'instagram',
      },
    ],
  },

  // ─── Spotify ─────────────────────────────────────────────────────────────────

  {
    id: 'msg-4',
    brandId: 'brand-2',
    customerId: 'c3',
    subject: 'Charged twice for Premium subscription',
    preview: 'I see two charges of €9.99 on my bank statement this month. Please refund ASAP.',
    status: 'ai_pending',
    platform: 'twitter',
    channel: 'Spotify',
    timestamp: '2026-06-29T10:01:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162205',
    replyCount: 1,
    newReplies: 1,
    tags: [{ label: 'billing', color: '#16a34a' }],
    aiDraft: "Hey Priya! That's a sour note — here's what we can do: we've confirmed the duplicate charge and initiated a full refund of €9.99. It'll land back in your account within 3–5 business days. Your Premium is fully active and uninterrupted. Thanks for flagging this! 🎵",
    timeline: [
      {
        id: 't4a',
        type: 'message',
        content: 'Hey @Spotify — I was charged twice for Premium this month (€9.99 x2 on June 1). This happened because I tried to upgrade and the page crashed. My account shows only one subscription. Please refund the duplicate charge.',
        author: 'Priya Nair',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        timestamp: '2026-06-29T10:01:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't4b',
        type: 'ai_suggestion',
        content: '',
        aiSuggestion: "Hey Priya! That's a sour note — here's what we can do: We've confirmed the duplicate charge and initiated a full refund of €9.99. It'll land back in your account within 3-5 business days. Your Premium is all good and uninterrupted. Thanks for your patience! 🎵",
        author: 'AI Draft',
        timestamp: '2026-06-29T10:02:00Z',
        isCustomer: false,
      },
    ],
  },

  {
    id: 'msg-5',
    brandId: 'brand-2',
    customerId: 'c5',
    subject: 'All playlists disappeared after update',
    preview: 'All my liked songs and 3 playlists vanished after the latest app update. Years of curation!',
    status: 'unanswered',
    platform: 'instagram',
    channel: 'Spotify',
    timestamp: '2026-06-29T08:45:00Z',
    unread: true,
    starred: true,
    assignedTo: undefined,
    ticketNumber: '#162200',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'bug', color: '#dc2626' }],
    aiDraft: "Lena, we completely understand how devastating this feels — years of curated playlists are irreplaceable. The good news: your library is almost certainly still on our servers. Try opening Spotify on desktop at spotify.com and check if your playlists appear there. If yes, a fresh reinstall of the app (clear cache first in Settings → Storage) should restore everything. If they're still missing after that, DM us your account email and our team will recover them manually within 24 hours. 🎵",
    timeline: [
      {
        id: 't5a',
        type: 'message',
        content: "After the latest update, all 3 of my playlists and my entire liked songs library disappeared. I've had some of those playlists for 4 years. This is absolutely devastating. Please help urgently.",
        author: 'Lena Müller',
        authorAvatar: 'https://i.pravatar.cc/150?img=9',
        timestamp: '2026-06-29T08:45:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-12',
    brandId: 'brand-2',
    customerId: 'c8',
    subject: 'Family plan — wrong email invited, now I pay for a stranger',
    preview: "I accidentally invited the wrong email to my Family plan. I can't remove them and I'm being charged...",
    status: 'unanswered',
    platform: 'facebook',
    channel: 'Spotify',
    timestamp: '2026-06-29T09:30:00Z',
    unread: true,
    starred: false,
    assignedTo: 'Remko',
    ticketNumber: '#162202',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'billing', color: '#16a34a' }, { label: 'account', color: '#0891b2' }],
    aiDraft: "Hey Yasmin! Here's what we can do: go to your Account page → Manage your plan → Premium Family, and click 'Remove' next to the unknown member. If the button is greyed out, the invite is still pending — cancel it there and re-send to the correct email. If you're stuck at any point, reply here with your account email and we'll fix it on our end within 2 hours. 🎵",
    timeline: [
      {
        id: 't12a',
        type: 'message',
        content: "Hello Spotify support. I set up a Family plan and accidentally typed the wrong email when inviting a member. That person accepted (which is weird because it wasn't even their account?) and now I can't remove them from the family group. I'm paying for someone I don't know. How do I fix this?",
        author: 'Yasmin Al-Rashid',
        authorAvatar: 'https://i.pravatar.cc/150?img=22',
        timestamp: '2026-06-29T09:30:00Z',
        platform: 'facebook',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-13',
    brandId: 'brand-2',
    customerId: 'c11',
    subject: 'Spotify Wrapped — can I see 2024 again?',
    preview: "Hey! Is there a way to view my 2024 Wrapped results? I forgot to save the screenshots and I miss them...",
    status: 'answered',
    platform: 'twitter',
    channel: 'Spotify',
    timestamp: '2026-06-27T14:22:00Z',
    unread: false,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162148',
    replyCount: 2,
    newReplies: 0,
    tags: [],
    timeline: [
      {
        id: 't13a',
        type: 'message',
        content: "@SpotifyCares is there any way to still see my 2024 Wrapped stats? I forgot to screenshot them and now I can't find where to access the old results in the app. Miss seeing my top artists 😅",
        author: 'Daan van der Berg',
        authorAvatar: 'https://i.pravatar.cc/150?img=60',
        timestamp: '2026-06-27T14:22:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't13b',
        type: 'reply',
        content: "Hey Daan! Great news — your 2024 Wrapped is still accessible! Open Spotify → tap Search → scroll to 'Your 2024 in Review'. It'll be there until the end of the year. Let us know who your top artist was 👀🎶",
        author: 'Spotify Support',
        timestamp: '2026-06-27T14:50:00Z',
        isCustomer: false,
        platform: 'twitter',
      },
      {
        id: 't13c',
        type: 'message',
        content: "Found it! Rammstein was my #1 for the 4th year in a row 🤘 Thanks for the quick reply!",
        author: 'Daan van der Berg',
        authorAvatar: 'https://i.pravatar.cc/150?img=60',
        timestamp: '2026-06-27T15:02:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-14',
    brandId: 'brand-2',
    customerId: 'c10',
    subject: 'Podcast episodes keep disappearing mid-download',
    preview: "I download podcast episodes for my commute but they disappear before I can listen offline. This has been happening for 2 weeks...",
    status: 'unanswered',
    platform: 'instagram',
    channel: 'Spotify',
    timestamp: '2026-06-29T07:11:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162194',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'bug', color: '#dc2626' }, { label: 'mobile', color: '#f97316' }],
    aiDraft: "Isabelle, this is a known iOS 17.5 issue affecting overnight downloads — we're working on a fix. In the meantime: go to Settings → Storage and toggle 'Remove unplayed episodes' OFF, and make sure Low Power Mode is disabled (it can interrupt background downloads). That should keep your episodes intact. If it still happens after trying this, DM us your account email and we'll escalate directly to our iOS team. 🎵",
    timeline: [
      {
        id: 't14a',
        type: 'message',
        content: "I download 4-5 podcast episodes every Sunday evening for my Monday commute. Since 2 weeks, the downloads disappear overnight — they show as downloaded but then 'not available offline' in the morning. iPhone 15 Pro, iOS 17.5, Spotify Premium. This is really frustrating, I pay for offline listening.",
        author: 'Isabelle Fontaine',
        authorAvatar: 'https://i.pravatar.cc/150?img=44',
        timestamp: '2026-06-29T07:11:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-15',
    brandId: 'brand-2',
    customerId: 'c7',
    subject: 'Why was my account suspended? I did nothing wrong',
    preview: "I woke up to find my Spotify account suspended with no explanation. I've had this account for 7 years...",
    status: 'unanswered',
    platform: 'twitter',
    channel: 'Spotify',
    timestamp: '2026-06-29T06:02:00Z',
    unread: true,
    starred: true,
    assignedTo: 'Remko',
    ticketNumber: '#162192',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'account', color: '#0891b2' }, { label: 'urgent', color: '#dc2626' }],
    aiDraft: "Tom, we're really sorry — 7 years of listening history and playlists deserve better than this. Our account team is reviewing your case right now. To speed things up, could you DM us the email address on the account? Suspensions like this are often triggered by unusual login activity (new device, VPN, etc.) and are typically resolved within a few hours. We'll get your music back on. 🎵",
    timeline: [
      {
        id: 't15a',
        type: 'message',
        content: "@SpotifyCares my account has been suspended and I have absolutely no idea why. I received no email, no warning, nothing. 7 years of playlists, followed artists, everything — gone. I haven't violated any terms. This is completely unacceptable. Please reinstate my account immediately.",
        author: 'Tom Eriksson',
        authorAvatar: 'https://i.pravatar.cc/150?img=15',
        timestamp: '2026-06-29T06:02:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
    ],
  },

  // ─── Airbnb ───────────────────────────────────────────────────────────────────

  {
    id: 'msg-6',
    brandId: 'brand-3',
    customerId: 'c4',
    subject: 'Host cancelled 2 hours before check-in',
    preview: "I'm standing outside the property with my family. Host cancelled and Airbnb support put me on hold...",
    status: 'unanswered',
    platform: 'twitter',
    channel: 'Airbnb',
    timestamp: '2026-06-29T11:30:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162210',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'urgent', color: '#dc2626' }, { label: 'safety', color: '#7c3aed' }],
    aiDraft: "James, we are so sorry — being left without accommodation with your family is completely unacceptable and we're treating this as our highest priority. Our team is finding you an equivalent or better listing nearby right now at zero extra cost to you. If you need a hotel immediately, please call our 24/7 Priority Line: +1-844-234-2500 and reference booking #AIR-7731892 — we'll cover the cost. We will not stop until your family has a place to stay tonight.",
    timeline: [
      {
        id: 't6a',
        type: 'message',
        content: "@Airbnb URGENT — Host just cancelled 2 hours before check-in. I'm at the location with my wife and two kids, we have nowhere to go. I've been on hold with support for 45 minutes. Booking #AIR-7731892. Please help us NOW.",
        author: 'James Holloway',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        timestamp: '2026-06-29T11:30:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-16',
    brandId: 'brand-3',
    customerId: 'c10',
    subject: 'Listing photos completely different from real apartment',
    preview: "The apartment in the photos looked spacious and bright. What we found was a dark basement with mold on the walls...",
    status: 'ai_pending',
    platform: 'instagram',
    channel: 'Airbnb',
    timestamp: '2026-06-28T22:14:00Z',
    unread: true,
    starred: true,
    assignedTo: undefined,
    ticketNumber: '#162188',
    replyCount: 1,
    newReplies: 1,
    tags: [{ label: 'listing', color: '#f97316' }, { label: 'refund', color: '#dc2626' }],
    aiDraft: "Isabelle, we are truly sorry — a listing that so severely misrepresents the property is completely unacceptable, and you were right to leave. We've opened case CS-2026-044821 and a Trust & Safety specialist will contact you within the hour. Under our Guest Refund Policy, this situation is fully covered and you will receive a complete refund. Please attach your photos to the case thread — they'll help us take action against this host immediately. You shouldn't have had to experience this.",
    timeline: [
      {
        id: 't16a',
        type: 'message',
        content: "We booked a 'bright 2BR apartment in Montmartre' (Booking #AIR-8819034). The listing photos showed a sunny, renovated flat. What we found was a dark, mouldy basement with a broken shower and no hot water. We left immediately and found a hotel. I have photos proving the mismatch. I want a full refund.",
        author: 'Isabelle Fontaine',
        authorAvatar: 'https://i.pravatar.cc/150?img=44',
        timestamp: '2026-06-28T22:14:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
      {
        id: 't16b',
        type: 'ai_suggestion',
        content: '',
        aiSuggestion: "Isabelle, we are so sorry this happened — this is not the experience we stand for. We've opened a case (ref: CS-2026-044821) and a specialist from our Trust & Safety team will reach out within the hour. Please send your photos directly to that case thread. Under our Guest Refund Policy, misrepresented listings are fully covered — you will not be out of pocket for this. We're on it.",
        author: 'AI Draft',
        timestamp: '2026-06-28T22:15:00Z',
        isCustomer: false,
      },
    ],
  },

  {
    id: 'msg-17',
    brandId: 'brand-3',
    customerId: 'c7',
    subject: 'Guest left a false 1-star review — how do I dispute?',
    preview: "A guest trashed my place, left a 1-star review calling me 'unresponsive'. I replied to every message within minutes...",
    status: 'unanswered',
    platform: 'facebook',
    channel: 'Airbnb',
    timestamp: '2026-06-29T08:00:00Z',
    unread: true,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162197',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'review', color: '#0891b2' }, { label: 'host', color: '#16a34a' }],
    aiDraft: "Tom, we understand how damaging a false review feels, especially when you have the evidence to prove otherwise. Here's what to do: go to airbnb.com/help → Report a Review, and attach your message screenshots — our Content team reviews disputes within 72 hours, and reviews with false claims are eligible for removal under our Review Policy. For the property damage, submit a claim through AirCover for Hosts within 14 days of checkout. We'll be with you every step of the way.",
    timeline: [
      {
        id: 't17a',
        type: 'message',
        content: "Hello Airbnb team. A recent guest left a 1-star review claiming I was 'unresponsive and unhelpful'. I have screenshots of every single message thread showing I replied within minutes every time. They also caused damage to my apartment (broken mirror, stained sofa) which they denied. This review is completely false and damaging to my listing. How do I escalate a formal dispute?",
        author: 'Tom Eriksson',
        authorAvatar: 'https://i.pravatar.cc/150?img=15',
        timestamp: '2026-06-29T08:00:00Z',
        platform: 'facebook',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-18',
    brandId: 'brand-3',
    customerId: 'c8',
    subject: 'Question about flexible cancellation before booking',
    preview: "If I book the 'flexible' cancellation option, can I cancel the day before and get a full refund? Just want to confirm...",
    status: 'answered',
    platform: 'facebook',
    channel: 'Airbnb',
    timestamp: '2026-06-27T16:05:00Z',
    unread: false,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162152',
    replyCount: 2,
    newReplies: 0,
    tags: [],
    timeline: [
      {
        id: 't18a',
        type: 'message',
        content: "Hi! I'm looking at a listing with 'Flexible' cancellation. If I need to cancel, can I do so the day before check-in and receive a full refund? I want to book but my travel plans are uncertain due to a work conference. Thanks!",
        author: 'Yasmin Al-Rashid',
        authorAvatar: 'https://i.pravatar.cc/150?img=22',
        timestamp: '2026-06-27T16:05:00Z',
        platform: 'facebook',
        isCustomer: true,
      },
      {
        id: 't18b',
        type: 'reply',
        content: "Hi Yasmin! Great news — with a Flexible cancellation policy, you can cancel up to 24 hours before check-in (based on the listing's timezone) for a full refund. If you cancel less than 24 hours before, the first night is non-refundable. You can always verify the exact policy on the listing page under 'Cancellation policy' before confirming. Hope your conference goes well! 🌍",
        author: 'Airbnb Support',
        timestamp: '2026-06-27T16:28:00Z',
        isCustomer: false,
        platform: 'facebook',
      },
      {
        id: 't18c',
        type: 'message',
        content: "Perfect, that's exactly what I needed to know! Just booked. Thank you for the quick answer 😊",
        author: 'Yasmin Al-Rashid',
        authorAvatar: 'https://i.pravatar.cc/150?img=22',
        timestamp: '2026-06-27T16:40:00Z',
        platform: 'facebook',
        isCustomer: true,
      },
    ],
  },

  {
    id: 'msg-19',
    brandId: 'brand-3',
    customerId: 'c3',
    subject: 'Hidden camera found in Airbnb — I am horrified',
    preview: "I found what appears to be a hidden camera in the smoke detector in the bedroom. I am scared and don't know what to do...",
    status: 'unanswered',
    platform: 'twitter',
    channel: 'Airbnb',
    timestamp: '2026-06-29T02:41:00Z',
    unread: true,
    starred: true,
    assignedTo: undefined,
    ticketNumber: '#162190',
    replyCount: 0,
    newReplies: 0,
    tags: [{ label: 'safety', color: '#7c3aed' }, { label: 'urgent', color: '#dc2626' }],
    aiDraft: "Priya, your safety is our only priority right now. Please do not touch or move the device — this is critical for any investigation. If you feel unsafe, leave the property immediately and call local emergency services (112 in Portugal). Our Trust & Safety emergency team has been alerted and will call you within 15 minutes. Booking #AIR-8924117 is suspended and the host has been removed from our platform pending investigation. We will cover your accommodation tonight — you are not alone in this.",
    timeline: [
      {
        id: 't19a',
        type: 'message',
        content: "@Airbnb I need URGENT help. I'm a solo female traveller staying in an Airbnb in Lisbon (Booking #AIR-8924117) and I just found what looks like a hidden camera built into the smoke detector in the bedroom, pointed at the bed. I am shaking. I have photos. What do I do RIGHT NOW??",
        author: 'Priya Nair',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        timestamp: '2026-06-29T02:41:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
    ],
  },
]

// ── Generated messages to reach ~200 total ───────────────────────────────────

type Seed = {
  id: string; brandId: string; customerId: string; subject: string; preview: string
  status: MessageStatus; platform: Platform; channel: string; timestamp: string
  unread: boolean; starred: boolean; assignedTo?: string; ticketNumber: string
  replyCount: number; newReplies: number; tags: Tag[]
  aiDraft?: string; reply?: string; customerMsg2?: string
}

function makeMsg(s: Seed): Message {
  const timeline: TimelineEvent[] = []
  const cust = customers.find(c => c.id === s.customerId)!
  timeline.push({
    id: s.id + '-a', type: 'message', content: s.preview,
    author: cust.name, authorAvatar: cust.avatar || undefined,
    timestamp: s.timestamp, platform: s.platform, isCustomer: true,
  })
  if (s.reply) {
    const h = parseInt(s.timestamp.slice(11, 13))
    const nextH = String(Math.min(h + 1, 23)).padStart(2, '0')
    const nextTs = s.timestamp.slice(0, 11) + nextH + s.timestamp.slice(13)
    timeline.push({
      id: s.id + '-b', type: 'reply', content: s.reply,
      author: 'Support Team', timestamp: nextTs,
      isCustomer: false, platform: s.platform,
    })
  }
  if (s.customerMsg2) {
    const h = parseInt(s.timestamp.slice(11, 13))
    const nextH = String(Math.min(h + 2, 23)).padStart(2, '0')
    const nextTs = s.timestamp.slice(0, 11) + nextH + s.timestamp.slice(13)
    timeline.push({
      id: s.id + '-c', type: 'message', content: s.customerMsg2,
      author: cust.name, authorAvatar: cust.avatar || undefined,
      timestamp: nextTs, platform: s.platform, isCustomer: true,
    })
  }
  if (s.aiDraft) {
    timeline.push({
      id: s.id + '-ai', type: 'ai_suggestion', content: '',
      aiSuggestion: s.aiDraft, author: 'AI Draft',
      timestamp: s.timestamp, isCustomer: false,
    })
  }
  return {
    id: s.id, brandId: s.brandId, customerId: s.customerId, subject: s.subject,
    preview: s.preview, status: s.status, platform: s.platform, channel: s.channel,
    timestamp: s.timestamp, unread: s.unread, starred: s.starred, assignedTo: s.assignedTo,
    ticketNumber: s.ticketNumber, replyCount: s.replyCount, newReplies: s.newReplies,
    tags: s.tags, aiDraft: s.aiDraft, timeline,
  }
}

const seeds: Seed[] = [
  // ─── Nike Europe ─────────────────────────────────────────────────────────
  { id:'msg-20', brandId:'brand-1', customerId:'c20', ticketNumber:'#162170', platform:'instagram', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-27T10:00:00Z', tags:[{label:'shipping',color:'#f97316'}], subject:'No tracking update for 5 days', preview:"My order #NK-2847001 hasn't had a tracking update in 5 days. Getting worried.", reply:"Hi Sarah! We checked with DHL — your parcel is at the sorting hub in Amsterdam and will be out for delivery tomorrow. You'll get a text notification. Apologies for the delay!", customerMsg2:"Got it, thank you! 🙏" },
  { id:'msg-21', brandId:'brand-1', customerId:'c13', ticketNumber:'#162169', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T08:10:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Charged for membership I never signed up for', preview:"There's a €14.99 Nike Plus charge on my card and I never signed up for any membership.", aiDraft:"Hey Marcus — that charge should never have appeared without your consent. We've initiated an immediate refund of €14.99 and cancelled the membership. You'll see the money back in 3–5 days. So sorry for the confusion. Keep pushing! 💪" },
  { id:'msg-22', brandId:'brand-1', customerId:'c27', ticketNumber:'#162168', platform:'facebook', channel:'Nike Europe', status:'answered', unread:false, starred:true, replyCount:3, newReplies:0, timestamp:'2026-06-26T15:30:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'New training streak feature is so motivating', preview:"Just want to say the new training streak feature in NRC is so motivating. Hit a 30-day streak today!", reply:"Priya, 30 days straight is INCREDIBLE!! 🔥 We're so glad the streaks are keeping you motivated. Keep going!", customerMsg2:"Gunning for 60 days now 🏃‍♀️" },
  { id:'msg-23', brandId:'brand-1', customerId:'c4', ticketNumber:'#162167', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T12:00:00Z', tags:[{label:'stock',color:'#0891b2'}], subject:'Air Jordan 1 Bred — limited drop notification didn\'t fire', preview:"I had notifications enabled for the Bred drop and got nothing. Sold out in seconds.", aiDraft:"James, we're really sorry the notification didn't reach you in time — this was a SNKRS app push issue affecting some users during the Bred drop. Our team will flag you for priority access on the next restock. Just do it! 👟" },
  { id:'msg-24', brandId:'brand-1', customerId:'c22', ticketNumber:'#162166', platform:'instagram', channel:'Nike Europe', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T09:00:00Z', tags:[{label:'returns',color:'#7c3aed'}], subject:'3 weeks into return with no refund', preview:"I sent my return 3 weeks ago with the prepaid label and still no refund.", aiDraft:"Lena, a 3-week wait for a return refund is way too long — we're escalating this now. Your return was received on June 8 at our Venlo warehouse. The refund of €94.99 has been manually triggered and will appear in your account within 48 hours. Keep going! 💪" },
  { id:'msg-25', brandId:'brand-1', customerId:'c21', ticketNumber:'#162165', platform:'twitter', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-25T14:00:00Z', tags:[], subject:'Can I exchange size in store if I ordered online?', preview:"I ordered EU43 but need a 44. Can I walk into a Nike store and swap?", reply:"Hi Tom! Yes — bring the shoes (unworn, original box) + your order confirmation to any Nike store and they'll swap the size on the spot. Just do it! 👟", customerMsg2:"Going to the Amsterdam store tomorrow. Thanks!" },
  { id:'msg-26', brandId:'brand-1', customerId:'c15', ticketNumber:'#162164', platform:'facebook', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T07:00:00Z', tags:[{label:'app',color:'#0891b2'},{label:'bug',color:'#dc2626'}], subject:'NRC heart rate zones not calibrating correctly', preview:"My heart rate zones in Nike Run Club haven't updated after I set my max HR.", aiDraft:"Yasmin, it's a known sync issue with manual HR zone settings in v3.14. Quick fix: force-close NRC, go to Settings → Training → Heart Rate → Reset Zones, then re-enter your max HR. That should recalibrate immediately. 🏃" },
  { id:'msg-27', brandId:'brand-1', customerId:'c9', ticketNumber:'#162162', platform:'instagram', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-24T11:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Pegasus 41 — best daily trainer I\'ve owned', preview:"Just finished my first month with the Pegasus 41. Best daily trainer I've ever owned.", reply:"Felix, this is exactly the feedback that makes our design team's day! 🙌 The energy return on the Pegasus 41 was 2 years in the making. Keep running!", customerMsg2:"Already eyeing the Vaporfly for my next race 😅" },
  { id:'msg-28', brandId:'brand-1', customerId:'c24', ticketNumber:'#162161', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:true, replyCount:0, newReplies:0, timestamp:'2026-06-29T10:30:00Z', tags:[{label:'urgent',color:'#dc2626'},{label:'safety',color:'#7c3aed'}], subject:'Shoe lace snapped mid-race', preview:"My Nike lace snapped at km 18 of a marathon. Had to stop mid-race. This could have caused injury.", aiDraft:"Isabelle, first — we're so relieved you weren't injured. A lace failure mid-marathon is unacceptable and we're treating this as a product safety report. Please DM us your shoe model and we'll arrange a full replacement and escalate to our product quality team. 💪" },
  { id:'msg-29', brandId:'brand-1', customerId:'c16', ticketNumber:'#162160', platform:'instagram', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-23T09:00:00Z', tags:[], subject:'How do I redeem Nike member reward points?', preview:"I have 2,340 Nike member points but can't find where to redeem them in the app.", reply:"Hey Daan! Go to Nike app → Profile → Membership → Rewards. Points can be used at checkout on Nike.com too! 👟", customerMsg2:"Just redeemed for 20% off. Thanks! 🎉" },
  { id:'msg-30', brandId:'brand-1', customerId:'c14', ticketNumber:'#162159', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T08:30:00Z', tags:[{label:'partnership',color:'#0891b2'}], subject:'TikTok collab proposal — 140k followers', preview:"Hi Nike! I'm a fitness TikToker with 140k followers. Would love to collab on a shoe review.", aiDraft:"Hey Aiko! Love your energy 🔥 Email our creator partnerships team at nike-creators@nike.com — include your handle, engagement stats, and a few videos. Our team reviews all submissions within 2 weeks. Just do it! 💪" },
  { id:'msg-31', brandId:'brand-1', customerId:'c30', ticketNumber:'#162158', platform:'instagram', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:3, newReplies:0, timestamp:'2026-06-22T16:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'NTC yoga sessions are incredible', preview:"The new yoga and recovery sessions on NTC are incredible. Finally something for rest days.", reply:"Sarah, we're so glad you found the recovery sessions! 🧘 Our NTC team put a lot of love into the new yoga series. Which instructor is your favourite?", customerMsg2:"The Adrienne series hits different after long runs 🙌" },
  { id:'msg-32', brandId:'brand-1', customerId:'c17', ticketNumber:'#162157', platform:'facebook', channel:'Nike Europe', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T11:45:00Z', tags:[{label:'defect',color:'#dc2626'}], subject:'Flyknit upper tearing after 2 months', preview:"The Flyknit upper on my Zoom Fly 5 is tearing at the toe box after less than 2 months.", aiDraft:"Marcus, tearing in the upper after 2 months is a clear manufacturing defect. Send us your order number and a photo of the damage and we'll send a replacement pair. Keep pushing! 💪" },
  { id:'msg-33', brandId:'brand-1', customerId:'c18', ticketNumber:'#162156', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T13:00:00Z', tags:[{label:'shipping',color:'#f97316'}], subject:'Express shipping ordered but standard delivered', preview:"I paid €12.99 for express 2-day shipping but it's been 4 days.", aiDraft:"Priya, paying for express and waiting 4 days is unacceptable. We've refunded your €12.99 shipping fee immediately. The carrier delay was outside our control but the cost is yours to keep back. So sorry! 🏃" },
  { id:'msg-34', brandId:'brand-1', customerId:'c4', ticketNumber:'#162155', platform:'linkedin', channel:'Nike Europe', status:'answered', unread:false, starred:true, replyCount:2, newReplies:0, timestamp:'2026-06-20T10:00:00Z', tags:[{label:'partnership',color:'#0891b2'}], subject:'Follow-up: Creator program application', preview:"Following up on my creator program application from last week. Haven't heard back from Emma yet.", reply:"James! Emma just reached out — she had a system glitch with the email. Check your LinkedIn DMs. So excited to work with you! 💪", customerMsg2:"Got her email! Meeting scheduled for Thursday 🙌" },
  { id:'msg-35', brandId:'brand-1', customerId:'c29', ticketNumber:'#162154', platform:'instagram', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T17:00:00Z', tags:[{label:'stock',color:'#0891b2'}], subject:'Size 38 Metcon 9 always out of stock', preview:"Every time I check the Metcon 9 in size 38, it's sold out. Do you restock regularly?", aiDraft:"Lena, the Metcon 9 in size 38 is popular! Restocks happen every 2-3 weeks. Enable size notifications on the product page (bell icon) and check the Nike app — members often get 24h early access. Don't give up! 💪" },
  { id:'msg-36', brandId:'brand-1', customerId:'c25', ticketNumber:'#162153', platform:'twitter', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-21T08:00:00Z', tags:[], subject:'Gift card not working at checkout', preview:"I got a Nike gift card for my birthday but the code isn't working at checkout. Keep getting an error.", reply:"Tom, try entering it in lowercase without spaces. If it still fails, DM us the last 4 digits and we'll manually apply the balance. 🎁", customerMsg2:"It worked in lowercase! Thanks 🙌" },
  { id:'msg-37', brandId:'brand-1', customerId:'c23', ticketNumber:'#162151', platform:'instagram', channel:'Nike Europe', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T08:00:00Z', tags:[{label:'app',color:'#0891b2'}], subject:'Apple Watch integration broke with watchOS 11', preview:"After updating to watchOS 11, my Nike watch face disappeared and NRC won't start from the watch.", aiDraft:"Yasmin, watchOS 11 broke some Nike complications. Fix: Watch app → Face Gallery → Nike+ Run → re-add the complication. Then NRC → Settings → Watch → Re-pair. Should take 2 minutes. Keep running! 🏃" },
  { id:'msg-38', brandId:'brand-1', customerId:'c19', ticketNumber:'#162150', platform:'facebook', channel:'Nike Europe', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-26T14:00:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Order total changed after I placed it', preview:"I paid €129 at checkout but my confirmation email shows €134.", aiDraft:"Felix, prices should never change after you place an order. Your total is locked at €129. If your bank statement shows €134, that's a foreign exchange fee on their end — check with your bank. Your order is correct on our side! 💪" },
  { id:'msg-39', brandId:'brand-1', customerId:'c28', ticketNumber:'#162149', platform:'twitter', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-19T09:00:00Z', tags:[], subject:'When does the Summer Sale start?', preview:"Heard there's a Nike Summer Sale coming. Any dates? Want to buy Vaporfly.", reply:"Isabelle, great news — our Summer Sale starts July 4th! Vaporfly is usually included. Sign in as a Nike Member for early access on July 3rd. 🎉", customerMsg2:"Set my alarm! Thank you! 😍" },
  { id:'msg-40', brandId:'brand-1', customerId:'c26', ticketNumber:'#162148', platform:'instagram', channel:'Nike Europe', status:'unanswered', unread:true, starred:true, assignedTo:'Remko', replyCount:0, newReplies:0, timestamp:'2026-06-29T13:00:00Z', tags:[{label:'urgent',color:'#dc2626'},{label:'shipping',color:'#f97316'}], subject:'Shoes arrived damaged — box completely crushed', preview:"My new Nike Air Max arrived in a completely crushed box with scuff marks on the shoes.", aiDraft:"Daan, receiving damaged goods is completely unacceptable. We're sending a brand new pair with express shipping immediately — keep the damaged ones, no return needed. New pair will be with you by Friday. Keep moving! 💪" },

  // ─── Spotify ─────────────────────────────────────────────────────────────
  { id:'msg-41', brandId:'brand-2', customerId:'c13', ticketNumber:'#162147', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-25T10:00:00Z', tags:[], subject:'Can I use Spotify on 2 devices simultaneously?', preview:"Can I listen on my phone and laptop at the same time with one Premium account?", reply:"Hey Sarah! Standard Premium streams on one device at a time. Tap the speaker icon to switch between devices without interruption. For simultaneous streams, Duo or Family plans work great. 🎵", customerMsg2:"The device-switching tip is perfect — thanks!" },
  { id:'msg-42', brandId:'brand-2', customerId:'c23', ticketNumber:'#162146', platform:'instagram', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T09:00:00Z', tags:[{label:'account',color:'#0891b2'}], subject:'Can\'t log in after resetting password', preview:"I reset my password 10 minutes ago and Spotify says my new password is incorrect. Completely locked out.", aiDraft:"Marcus, password changes take a few minutes to propagate. Clear your browser cookies, wait 5 minutes, then try logging in at open.spotify.com in an incognito window. If it still fails, DM us your account email and we'll manually reset. 🎵" },
  { id:'msg-43', brandId:'brand-2', customerId:'c16', ticketNumber:'#162145', platform:'facebook', channel:'Spotify', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T09:30:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Cancelled Premium but still being charged', preview:"I cancelled Spotify Premium 2 months ago but I've been charged €9.99 every month since.", aiDraft:"Priya, charges after cancellation should never happen. We're processing a full refund for 2 months incorrectly charged (€19.98) immediately. Confirmation email arriving within the hour. Your account shows no active subscription now. 🎵" },
  { id:'msg-44', brandId:'brand-2', customerId:'c4', ticketNumber:'#162144', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:true, replyCount:3, newReplies:0, timestamp:'2026-06-23T14:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Spotify DJ AI feature is genuinely incredible', preview:"The AI DJ feature has been my daily driver for 2 weeks. Feels like a personal radio station.", reply:"James, this genuinely makes our team happy! 🎉 The DJ took 18 months of training. Any genres you wish it covered more?", customerMsg2:"More instrumental focus music for work would be amazing 😄" },
  { id:'msg-45', brandId:'brand-2', customerId:'c29', ticketNumber:'#162143', platform:'instagram', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T11:00:00Z', tags:[{label:'bug',color:'#dc2626'},{label:'mobile',color:'#f97316'}], subject:'Shuffle broken — same 10 songs on repeat', preview:"My shuffle only cycles through the same 10 songs from a 200-song playlist. Been like this for weeks.", aiDraft:"Lena, the repeat-shuffle issue has been reported. Quickest fix: tap the three dots on the playlist → Download (even if already downloaded) — forces a re-index and shuffle should work properly. 🎵" },
  { id:'msg-46', brandId:'brand-2', customerId:'c27', ticketNumber:'#162142', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-21T10:00:00Z', tags:[], subject:'Where did friend activity go in the sidebar?', preview:"I used to see what my friends are listening to but it disappeared from my sidebar.", reply:"Hey Tom! Friend activity is in the right sidebar in the desktop app (person icon top right). On mobile: Home → Friend Activity. Make sure friends have 'Share my listening activity' enabled in Privacy settings. 🎵", customerMsg2:"Found it! My friend listens to Taylor Swift at 2am apparently 😂" },
  { id:'msg-47', brandId:'brand-2', customerId:'c18', ticketNumber:'#162141', platform:'facebook', channel:'Spotify', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T10:30:00Z', tags:[{label:'account',color:'#0891b2'}], subject:'Merged two accounts accidentally — lost playlists', preview:"I accidentally merged my Facebook login and email login. All playlists from the Facebook account are gone.", aiDraft:"Yasmin, your playlists aren't lost — they're linked to the original Facebook-login account. Our Account team can recover and transfer them. DM us both email addresses and we'll sort this within 24 hours. 🎵" },
  { id:'msg-48', brandId:'brand-2', customerId:'c25', ticketNumber:'#162140', platform:'instagram', channel:'Spotify', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-26T08:00:00Z', tags:[], subject:'Student discount — docs uploaded but no confirmation', preview:"I uploaded my student ID for the student discount 5 days ago. Still being charged full price.", aiDraft:"Felix, 5 days without a response is too long. We're escalating your verification now. If approved, we'll credit back the difference for this month. Confirmation by email within 24 hours. 🎵" },
  { id:'msg-49', brandId:'brand-2', customerId:'c14', ticketNumber:'#162139', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-20T09:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Spotify Blend with my partner is our favourite feature', preview:"We do a Spotify Blend every week and it's the best conversation starter.", reply:"Isabelle, Blend dates sound adorable!! 💕 Any dream feature you'd add to Blend?", customerMsg2:"A monthly recap of songs we both loved would be perfect! Hint hint 😄" },
  { id:'msg-50', brandId:'brand-2', customerId:'c17', ticketNumber:'#162138', platform:'instagram', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T15:00:00Z', tags:[{label:'bug',color:'#dc2626'}], subject:'Lyrics feature disappeared from my app', preview:"The lyrics button is gone from my player. I'm on the latest version. Premium account.", aiDraft:"Daan, lyrics were temporarily hidden in v8.9.58 due to a rights issue — restored in v8.9.60. Update via your app store and it should be back. Sorry for the disruption! 🎵" },
  { id:'msg-51', brandId:'brand-2', customerId:'c12', ticketNumber:'#162137', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:true, replyCount:2, newReplies:0, timestamp:'2026-06-22T12:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Made For You playlist was literally perfect today', preview:"I got a 'Made for You' playlist and every single song was a hit. How does the algorithm know me this well??", reply:"Aiko, we'll pass your compliments to our recommendation engine 🤖🎵 Any song that surprised you?", customerMsg2:"'Homesick' by Noah Kahan appeared and I cried 😭 iconic" },
  { id:'msg-52', brandId:'brand-2', customerId:'c19', ticketNumber:'#162136', platform:'facebook', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T07:30:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Premium price increased without notice', preview:"My Spotify Premium went from €9.99 to €11.99 and I was never notified.", aiDraft:"Sarah, we sent price change emails in April but understand they're easy to miss. The new price reflects increased content costs. If budget is tight, our Spotify Mini option at €0.99/day might help. We value you as a listener! 🎵" },
  { id:'msg-53', brandId:'brand-2', customerId:'c30', ticketNumber:'#162135', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-18T11:00:00Z', tags:[], subject:'Offline downloads limit — how many songs?', preview:"I hit a download limit. Getting an error saying I can't save more songs offline.", reply:"Hey Marcus! Premium allows up to 10,000 songs offline across 5 devices. Removing old downloaded podcasts (they count toward the total) should free up space. 🎵", customerMsg2:"Didn't know podcasts count! Removed some and it worked. Thanks!" },
  { id:'msg-54', brandId:'brand-2', customerId:'c22', ticketNumber:'#162134', platform:'instagram', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T16:00:00Z', tags:[{label:'bug',color:'#dc2626'},{label:'mobile',color:'#f97316'}], subject:'Spotify not connecting to Android Auto', preview:"Spotify stopped connecting to Android Auto after the last update. Car screen shows 'Connection failed'.", aiDraft:"Priya, Android Auto issues started in v8.9.56. Fix: Spotify Settings → Car → Disable Car Mode → re-enable Android Auto from your car screen. Also make sure USB Debugging is off in developer settings — most common culprit. 🎵" },
  { id:'msg-55', brandId:'brand-2', customerId:'c21', ticketNumber:'#162133', platform:'facebook', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-17T09:00:00Z', tags:[], subject:'Are podcasts included in Spotify Wrapped?', preview:"I listen to a lot of podcasts. Are they in my Wrapped stats or only music?", reply:"James, starting from 2024 Wrapped, podcasts have their own section — top shows and total hours. 🎙️🎵", customerMsg2:"Oh that's actually really cool. Can't wait to see my stats at year end!" },
  { id:'msg-56', brandId:'brand-2', customerId:'c5', ticketNumber:'#162132', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:true, assignedTo:'Remko', replyCount:0, newReplies:0, timestamp:'2026-06-29T11:30:00Z', tags:[{label:'account',color:'#0891b2'},{label:'urgent',color:'#dc2626'}], subject:'Account hacked — email and password changed', preview:"Someone has taken over my Spotify account. They changed the email and password. 7 years of playlists.", aiDraft:"Lena, go to spotify.com/account/recover and use your original email. Our Account Security team has flagged your account for manual review — they'll contact you at your original email within 30 minutes. Do NOT click any links sent via email. We're on it. 🎵" },
  { id:'msg-57', brandId:'brand-2', customerId:'c6', ticketNumber:'#162131', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T12:00:00Z', tags:[{label:'account',color:'#0891b2'}], subject:'Can\'t create account — SMS verification not sending', preview:"Trying to create a Spotify account but the SMS verification code never arrives. Tried 5 times.", aiDraft:"Sorry you're hitting this! Try verifying via email instead: tap 'Send via email' on the verification screen. If you don't see that option, DM us and we'll verify your account manually. 🎵" },
  { id:'msg-58', brandId:'brand-2', customerId:'c20', ticketNumber:'#162130', platform:'instagram', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-11T10:00:00Z', tags:[], subject:'Is there a sleep timer?', preview:"Is there a sleep timer feature? I fall asleep to podcasts and wake up at 3am.", reply:"Sarah, yes! Three dots on Now Playing → Sleep Timer. Set for 5–45 minutes or 'End of track'. Perfect for bedtime! 🌙🎵", customerMsg2:"I've wanted this for years and it was right there! Thank you!!" },
  { id:'msg-59', brandId:'brand-2', customerId:'c26', ticketNumber:'#162129', platform:'facebook', channel:'Spotify', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T10:00:00Z', tags:[{label:'bug',color:'#dc2626'}], subject:'Spotify freezes when opening with CarPlay', preview:"Every time I open Spotify via CarPlay, it loads for 10 seconds then freezes my iPhone.", aiDraft:"Marcus, CarPlay freezing is a known conflict with iOS 17.5.1 and Spotify v8.9.60. Fix: iPhone Settings → Spotify → Reset all settings → force-quit Spotify → unplug from CarPlay → wait 30 seconds → reconnect. 🎵" },
  { id:'msg-60', brandId:'brand-2', customerId:'c15', ticketNumber:'#162128', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T08:00:00Z', tags:[], subject:'How do I listen to Spotify on my smart TV?', preview:"Can I get Spotify on my Samsung TV? Can't find the app in the smart TV store.", aiDraft:"Priya! Spotify is available on most Samsung Smart TVs from 2016 onwards. Go to your TV's app store → search 'Spotify' → install. If it's not there, Chromecast or AirPlay from your phone as an alternative. 🎵📺" },
  { id:'msg-61', brandId:'brand-2', customerId:'c28', ticketNumber:'#162127', platform:'facebook', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-09T14:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Daylist feature is weirdly accurate', preview:"The 'Monday morning indie folk' Daylist this morning was exactly what I wanted to hear.", reply:"James, we'll tell our algorithm it's doing dark magic 🔮🎵 You're clearly an indie folk Monday morning person — and we respect it!", customerMsg2:"'Tuesday afternoon hip-hop with a hint of nostalgia' also nailed it 😂" },
  { id:'msg-62', brandId:'brand-2', customerId:'c24', ticketNumber:'#162126', platform:'twitter', channel:'Spotify', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-24T09:00:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Family plan member can\'t verify home address', preview:"One of my family members can't verify their home address for the Family plan.", aiDraft:"Lena, make sure the address exactly matches Google Maps format (including apartment number). If it still fails after 2 attempts, DM us both account emails and we'll manually verify. 🎵" },
  { id:'msg-63', brandId:'brand-2', customerId:'c13', ticketNumber:'#162125', platform:'facebook', channel:'Spotify', status:'answered', unread:false, starred:true, replyCount:3, newReplies:0, timestamp:'2026-06-08T10:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'800 hours of podcasts in a year', preview:"I just checked my Spotify stats and I've listened to 800+ hours of podcasts in the last year 😂", reply:"Tom, 800 hours?? Simultaneously concerned and impressed 🎙️😂 What's your all-time favourite show?", customerMsg2:"Serial Season 1 changed my life. Everything else is measured against it." },
  { id:'msg-64', brandId:'brand-2', customerId:'c16', ticketNumber:'#162124', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T15:00:00Z', tags:[{label:'bug',color:'#dc2626'},{label:'mobile',color:'#f97316'}], subject:'Search results showing songs in wrong language', preview:"When I search in English, results show Dutch/German versions of songs instead of the originals.", aiDraft:"Yasmin, go to Settings → Language → set your preferred content language to 'English' and restart the app. This tells our catalog which version to prioritize. Should fix immediately after the restart. 🎵" },
  { id:'msg-65', brandId:'brand-2', customerId:'c19', ticketNumber:'#162123', platform:'instagram', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-07T09:00:00Z', tags:[], subject:'How do I turn on the crossfade feature?', preview:"I want songs to blend into each other. Is there a crossfade option on mobile?", reply:"Felix! Settings → Playback → Crossfade. Drag the slider up to 12 seconds. Great for DJ playlists or workout mixes! 🎵🎧", customerMsg2:"12 seconds of crossfade for my gym playlist is *chef's kiss* 🙌" },
  { id:'msg-66', brandId:'brand-2', customerId:'c30', ticketNumber:'#162122', platform:'facebook', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T12:00:00Z', tags:[{label:'account',color:'#0891b2'}], subject:'How do I permanently delete my Spotify account?', preview:"I want to permanently delete my Spotify account and all my data.", aiDraft:"Isabelle, go to spotify.com/account → Privacy Settings → Close Account. This permanently deletes all playlists and history. If there's something we can fix to keep you, we'd love the chance! 🎵" },
  { id:'msg-67', brandId:'brand-2', customerId:'c25', ticketNumber:'#162121', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-06T11:00:00Z', tags:[], subject:'Can I import my Apple Music library?', preview:"I'm switching from Apple Music and have 3,000 songs saved. Is there an import tool?", reply:"Daan, try Soundiiz (soundiiz.com) — it transfers Apple Music playlists and liked songs to Spotify in under 5 minutes. Free tier works great! 🎵", customerMsg2:"Used Soundiiz and it worked perfectly! Every playlist transferred. Thank you!!" },
  { id:'msg-68', brandId:'brand-2', customerId:'c12', ticketNumber:'#162120', platform:'instagram', channel:'Spotify', status:'unanswered', unread:true, starred:true, replyCount:0, newReplies:0, timestamp:'2026-06-29T08:30:00Z', tags:[{label:'feedback',color:'#16a34a'},{label:'partnership',color:'#0891b2'}], subject:'My lo-fi playlist has 40k Spotify followers from TikTok', preview:"I made a 'study with me lo-fi' playlist that has 40k followers on Spotify from my TikTok. Can we collab?", aiDraft:"Aiko, a 40k-follower playlist is seriously impressive! Submit for editorial consideration at artists.spotify.com/playlists — include your TikTok audience stats. Our editorial team actively looks for creator-driven playlists. 🎵" },

  // ─── Airbnb ───────────────────────────────────────────────────────────────
  { id:'msg-69', brandId:'brand-3', customerId:'c14', ticketNumber:'#162119', platform:'facebook', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-05T10:00:00Z', tags:[], subject:'Can I get VAT receipts for business expenses?', preview:"I use Airbnb for work travel. Can I download proper VAT invoices for expense reports?", reply:"Sarah, yes! airbnb.com/account/payments → Receipts → any booking → 'Download Receipt'. For EU VAT invoices: Account → Business Travel → Tax Documents. 🧾", customerMsg2:"The tax documents section was exactly what I needed. Thank you!" },
  { id:'msg-70', brandId:'brand-3', customerId:'c17', ticketNumber:'#162118', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T07:00:00Z', tags:[{label:'booking',color:'#0891b2'}], subject:'Double-charged for a booking', preview:"I was charged twice for the same booking. My bank shows two identical charges of €347 on the same day.", aiDraft:"Marcus, we've reviewed your account and confirmed the duplicate — the second €347 charge is being refunded immediately. You'll see it reversed within 3–5 business days. Sincere apologies for the alarm this caused." },
  { id:'msg-71', brandId:'brand-3', customerId:'c22', ticketNumber:'#162117', platform:'instagram', channel:'Airbnb', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T04:00:00Z', tags:[{label:'safety',color:'#7c3aed'}], subject:'Host entered apartment without notice at 11pm', preview:"My host knocked and then entered my apartment at 11pm without permission while I was there.", aiDraft:"Priya, an unauthorized entry is a serious violation. We've suspended this host pending investigation. You can check out immediately — we will provide a full refund and free alternative accommodation tonight. Please call +1-844-234-2500 if you need immediate assistance." },
  { id:'msg-72', brandId:'brand-3', customerId:'c20', ticketNumber:'#162116', platform:'facebook', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-04T14:00:00Z', tags:[], subject:'Long-term stay discount for 28+ nights?', preview:"Considering a 4-week stay in Lisbon. Do longer bookings come with a discount?", reply:"James! Most hosts offer 20–50% monthly discount for 28+ nights — applied automatically at checkout. Filter by 'Monthly stay' to find listings with this enabled. 🌍", customerMsg2:"Just found a place for 35% off the weekly rate. Booking now!" },
  { id:'msg-73', brandId:'brand-3', customerId:'c26', ticketNumber:'#162115', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-25T09:00:00Z', tags:[{label:'refund',color:'#dc2626'}], subject:'€150 cleaning fee for a studio — is this normal?', preview:"A studio apartment in Berlin is charging a €150 cleaning fee. Almost as much as one night.", aiDraft:"Lena, cleaning fees are set by individual hosts and we can't cap them. We do show the fee clearly before booking. Try filtering for 'No cleaning fee' or listings with fees under €50 as alternatives. Happy to help! 🏠" },
  { id:'msg-74', brandId:'brand-3', customerId:'c21', ticketNumber:'#162114', platform:'instagram', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-03T10:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'3 years hosting — met people from 47 countries', preview:"I started hosting 3 years ago to cover my mortgage. Now it's my main income and I've met people from 47 countries.", reply:"Tom, this is what hosting is all about 🏠🌍 47 countries! We'd love to feature you in our Superhost spotlight. Would you be open to it?", customerMsg2:"Absolutely! A guest from Bhutan just left yesterday — each one is a story 🙏" },
  { id:'msg-75', brandId:'brand-3', customerId:'c13', ticketNumber:'#162113', platform:'facebook', channel:'Airbnb', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T09:00:00Z', tags:[{label:'refund',color:'#dc2626'},{label:'listing',color:'#f97316'}], subject:'No hot water for entire 4-night stay', preview:"There was no hot water for the entire 4 nights. Host kept saying 'it'll be fixed tomorrow'. Never was.", aiDraft:"Yasmin, no hot water for 4 nights is completely unacceptable. Under our Rebooking and Refund Policy, you're entitled to a significant partial refund. We're processing 75% of your booking cost (€284) immediately — in your account within 5 days." },
  { id:'msg-76', brandId:'brand-3', customerId:'c29', ticketNumber:'#162112', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-25T14:00:00Z', tags:[], subject:'Can I leave a review after the 14-day window?', preview:"I forgot to leave a review for my last stay and it's been 16 days. Can I still submit one?", aiDraft:"Felix, the 14-day review window is a firm policy on both sides — once it closes, neither guest nor host can submit for that stay. For your next stay, set a reminder right after check-out. 🏠" },
  { id:'msg-77', brandId:'brand-3', customerId:'c18', ticketNumber:'#162111', platform:'instagram', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-19T10:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Airbnb Plus in Barcelona was magazine-worthy', preview:"The Airbnb Plus apartment in Barcelona (Booking #AIR-7831002) was stunning. Every detail was perfect.", reply:"Isabelle, this made our curation team smile so wide 😍 Airbnb Plus properties go through a 100-point inspection. We've passed your message to the host. Buen viaje! 🌞", customerMsg2:"Already looking at returning next summer. The host left us a bottle of cava — 10/10! 🥂" },
  { id:'msg-78', brandId:'brand-3', customerId:'c15', ticketNumber:'#162110', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T18:00:00Z', tags:[{label:'booking',color:'#0891b2'}], subject:'Can I extend my stay during check-in?', preview:"I'm checking in tomorrow. Can I extend my stay by 2 extra nights if I like it?", aiDraft:"Daan, request an extension through the Airbnb app — go to your trip → Modify Reservation → Add nights. The host needs to approve, but most are happy if they don't have another booking. Do this as soon as you arrive! 🏠" },
  { id:'msg-79', brandId:'brand-3', customerId:'c12', ticketNumber:'#162109', platform:'twitter', channel:'Airbnb', status:'answered', unread:false, starred:true, replyCount:2, newReplies:0, timestamp:'2026-06-21T15:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Solo travel in Japan — every Airbnb host was incredible', preview:"Did a 3-week solo trip through Japan. Every single Airbnb host was incredible. Felt completely safe.", reply:"Aiko, your solo Japan adventure sounds absolutely incredible 🇯🇵 So glad you felt safe and welcomed. Where was your favourite stay?", customerMsg2:"A tiny cabin in Kyoto with a cedar wood onsen. I cried when I left 😭✨" },
  { id:'msg-80', brandId:'brand-3', customerId:'c27', ticketNumber:'#162108', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T10:00:00Z', tags:[{label:'urgent',color:'#dc2626'}], subject:'Host asking me to pay €200 cash — is this a scam?', preview:"My host is messaging me on WhatsApp asking me to pay a €200 'security deposit' in cash. This feels wrong.", aiDraft:"James, this is a scam attempt — do NOT pay any money outside of the Airbnb platform. All security deposits are handled by Airbnb. We've flagged this host's account. Screenshot and forward the WhatsApp messages to trust@airbnb.com. Your booking is fully secure." },
  { id:'msg-81', brandId:'brand-3', customerId:'c24', ticketNumber:'#162107', platform:'twitter', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-24T10:00:00Z', tags:[], subject:'What extra benefits do Superhost stays have?', preview:"What benefits do I get booking a Superhost listing compared to a regular one?", reply:"Hi Sarah! Superhost listings have hosts with 4.8+ ratings, <1h response time, and 10+ stays/year. More reliable check-ins and descriptions that match reality. Worth the filter! 🌟", customerMsg2:"Didn't know about that filter — using it from now on. Thanks!" },
  { id:'msg-82', brandId:'brand-3', customerId:'c23', ticketNumber:'#162106', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T14:00:00Z', tags:[{label:'refund',color:'#dc2626'}], subject:'Host refuses refund despite written cancellation policy', preview:"The listing said free cancellation up to 48h before. I cancelled 72h before and the host refuses my refund.", aiDraft:"Marcus, if the listing clearly stated free cancellation up to 48 hours and you cancelled 72 hours in advance, you're entitled to a full refund — the host cannot override this. We've opened case CS-2026-048812. Your refund will be processed within 5 business days." },
  { id:'msg-83', brandId:'brand-3', customerId:'c28', ticketNumber:'#162105', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T17:00:00Z', tags:[{label:'listing',color:'#f97316'}], subject:'Listing says WiFi but there is none — I work remotely', preview:"The listing listed WiFi as an amenity. There's no WiFi and the host says 'use your data'.", aiDraft:"Lena, listing WiFi as an amenity when none exists is a policy violation. You're eligible for a €50 daily credit under our Listing Accuracy Policy. We've opened case CS-2026-048891 and are reviewing the host's listing. So sorry this disrupted your remote work." },
  { id:'msg-84', brandId:'brand-3', customerId:'c16', ticketNumber:'#162104', platform:'twitter', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-20T08:00:00Z', tags:[], subject:'How do I block dates for personal use?', preview:"I want to block 2 weeks in August for personal use of my listing. How do I do this quickly?", reply:"Hey Tom! Host Dashboard → Calendar → click and drag across any dates to block them. Blocked dates won't appear in search. 📅", customerMsg2:"Done in 30 seconds. Thanks 🙏" },
  { id:'msg-85', brandId:'brand-3', customerId:'c19', ticketNumber:'#162103', platform:'facebook', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-28T11:00:00Z', tags:[], subject:'Pet-friendly filter showing non-pet listings', preview:"I filtered for pet-friendly listings but search still shows listings that say 'no pets' in the rules.", reply:"Yasmin, some hosts add 'no pets' in house rules as extra precaution — those should be hidden but are slipping through. We've logged this as a priority filter bug. In the meantime, always check House Rules before booking. Fix rolling out next week. 🏠", customerMsg2:"Thanks! Found a great dog-friendly place after checking manually." },
  { id:'msg-86', brandId:'brand-3', customerId:'c9', ticketNumber:'#162102', platform:'twitter', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-02T09:00:00Z', tags:[], subject:'What does AirCover actually cover?', preview:"I see 'AirCover for Hosts' mentioned everywhere. What does it actually cover and how do I claim?", reply:"Felix, AirCover for Hosts covers up to €3M in property damage. Claim via Resolution Centre within 14 days of checkout → Request money from guest. Photo documentation is key! 🏠", customerMsg2:"Good to know. Had a guest break a lamp — will submit now. Thanks!" },
  { id:'msg-87', brandId:'brand-3', customerId:'c30', ticketNumber:'#162101', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T08:00:00Z', tags:[{label:'booking',color:'#0891b2'}], subject:'Can I add a co-host while I\'m travelling?', preview:"I'm travelling for 3 weeks and need someone to manage my Airbnb listing. Can I add a co-host?", aiDraft:"Isabelle! Yes — Your Listings → Edit → Co-Hosts → Add Co-host and enter their email. Co-hosts can manage reservations, message guests, and update the calendar. You control the permissions. Perfect for travel! 🏠" },
  { id:'msg-88', brandId:'brand-3', customerId:'c25', ticketNumber:'#162100', platform:'facebook', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-06-01T10:00:00Z', tags:[], subject:'How do I become an Airbnb Experiences host?', preview:"I'm a professional chef and want to host cooking classes as an Airbnb Experience. How do I apply?", reply:"Daan, apply at airbnb.com/host/experiences — our team reviews in 2–3 weeks. Cooking classes are one of the most popular categories. 🍳🌟", customerMsg2:"Applied! Teaching Dutch stroopwafel making. Fingers crossed 🤞" },
  { id:'msg-89', brandId:'brand-3', customerId:'c12', ticketNumber:'#162099', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:true, replyCount:0, newReplies:0, timestamp:'2026-06-29T09:30:00Z', tags:[{label:'feedback',color:'#16a34a'},{label:'partnership',color:'#0891b2'}], subject:'My Kyoto Airbnb vlog got 2M views — can we collab?', preview:"My Airbnb stay in Kyoto went viral — 2M views and 400 comments asking about the listing. Can we collab?", aiDraft:"Aiko, 2M views is incredible 😄🇯🇵 Email creators@airbnb.com with your video link, channel stats and contact info. Our team will be in touch within 5 business days." },
  { id:'msg-90', brandId:'brand-3', customerId:'c3', ticketNumber:'#162098', platform:'facebook', channel:'Airbnb', status:'ai_pending', unread:true, starred:false, replyCount:1, newReplies:1, timestamp:'2026-06-29T03:00:00Z', tags:[{label:'safety',color:'#7c3aed'},{label:'urgent',color:'#dc2626'}], subject:'Smoke alarm not working — host not responding', preview:"I tested the smoke alarm in my Airbnb and it's dead. No battery. Asked host 3 times, no response.", aiDraft:"Priya, a non-functional smoke alarm is a serious safety issue. We've escalated to Trust & Safety — a specialist will call you within 20 minutes. If you feel unsafe, please leave and call local authorities — we will cover your accommodation tonight. Safety first, always." },
  { id:'msg-91', brandId:'brand-3', customerId:'c4', ticketNumber:'#162097', platform:'twitter', channel:'Airbnb', status:'answered', unread:false, starred:true, replyCount:3, newReplies:0, timestamp:'2026-06-22T11:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Best Airbnb stay ever — host in Tuscany went above and beyond', preview:"2-week stay in Tuscany — host left local wine, handwritten restaurant recs, and arranged a private cooking class.", reply:"James, your host Giulia has been nominated for a Superhost Spotlight based on your feedback 🥂🌿 Hope Tuscany treated you beautifully!", customerMsg2:"Please tell Giulia she was incredible! Already looking for our next long-stay. 🙏" },
  { id:'msg-92', brandId:'brand-3', customerId:'c9', ticketNumber:'#162096', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:false, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-26T14:00:00Z', tags:[{label:'booking',color:'#0891b2'}], subject:'Airbnb listing in wrong city in search results', preview:"My listing is in Amsterdam Noord but Airbnb shows it as Amsterdam Centrum in search results.", aiDraft:"Felix, go to Your Listings → Edit → Location → drag the map pin to the exact location and save. That overrides the automatic classification. If still incorrect after 24 hours, DM us your listing ID and we'll manually adjust. 🏠" },

  // ─── More mixed ───────────────────────────────────────────────────────────
  { id:'msg-93', brandId:'brand-1', customerId:'c17', ticketNumber:'#162095', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T07:00:00Z', tags:[{label:'shipping',color:'#f97316'}], subject:'Click & Collect ready email but store has no record', preview:"Got an email saying my Click & Collect is ready at the Amsterdam store but they have no record of my order.", aiDraft:"Marcus, a Click & Collect sync error is frustrating — especially when you've made the trip. Check your order confirmation for the exact store address. If it's correct, call the store and quote your order number — the manager can pull it from our back end. Sorry for the inconvenience! 💪" },
  { id:'msg-94', brandId:'brand-2', customerId:'c18', ticketNumber:'#162094', platform:'instagram', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-30T10:00:00Z', tags:[], subject:'Can I see my full listening history?', preview:"Is there a way to see everything I've listened to? Not just Wrapped but the full log.", reply:"Priya! Go to spotify.com/account/privacy → Request your data. Within 30 days you'll get your complete streaming history as a JSON file. 🎵", customerMsg2:"Requested it! Can't wait to see 6 years of terrible decisions 😂" },
  { id:'msg-95', brandId:'brand-1', customerId:'c22', ticketNumber:'#162093', platform:'facebook', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-29T09:00:00Z', tags:[], subject:'NRC vs NTC — what\'s the difference?', preview:"I keep confusing these two Nike apps. What does each one do?", reply:"Lena, easy breakdown: NRC is for running (GPS, training plans, audio coaching). NTC is for strength, yoga, HIIT — everything not running. Both free with Nike membership! 🏃‍♀️💪", customerMsg2:"Downloaded both. Starting a 6-week strength plan today! 🙌" },
  { id:'msg-96', brandId:'brand-2', customerId:'c21', ticketNumber:'#162092', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T14:00:00Z', tags:[{label:'bug',color:'#dc2626'}], subject:'Spotify Greenroom / Live — where did it go?', preview:"I used to use Spotify Greenroom for live audio. Can't find it anywhere in the app anymore.", aiDraft:"Tom, Spotify Greenroom was discontinued in 2024 as we shifted our live audio strategy. Live content is now through podcasts and shows. If you're looking for live audio alternatives, live content through anchor.fm is the closest current option. 🎵" },
  { id:'msg-97', brandId:'brand-1', customerId:'c29', ticketNumber:'#162091', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T08:30:00Z', tags:[{label:'returns',color:'#7c3aed'}], subject:'Return QR code won\'t scan at DHL', preview:"The return QR code Nike sent won't scan at the DHL drop-off point. Three locations have tried.", aiDraft:"Felix, a QR code that won't scan is most likely corrupted in transit. DM us your order number and we'll generate a new return label immediately in PDF format. Sorry for the hassle! 💪" },
  { id:'msg-98', brandId:'brand-2', customerId:'c20', ticketNumber:'#162090', platform:'facebook', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-27T10:00:00Z', tags:[], subject:'How do I switch playback to my TV?', preview:"I'm playing music on my phone and want to move playback to my Sony TV without restarting the song.", reply:"Isabelle! Tap the speaker icon at the bottom of Now Playing. You'll see all Spotify Connect devices — tap your Sony TV to transfer instantly. 🎵📺", customerMsg2:"Worked perfectly! Had no idea this feature existed!" },
  { id:'msg-99', brandId:'brand-3', customerId:'c11', ticketNumber:'#162089', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T09:00:00Z', tags:[{label:'booking',color:'#0891b2'}], subject:'How do I message a host before booking?', preview:"I want to ask the host a few questions before committing to a booking.", aiDraft:"Daan, on any listing page, click 'Contact host' (below the price) to send a message before booking. Hosts typically respond within a few hours — great for confirming pet policies or early check-in. 🏠" },
  { id:'msg-100', brandId:'brand-1', customerId:'c30', ticketNumber:'#162088', platform:'facebook', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-26T09:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Love the minimal eco packaging', preview:"I noticed my last 3 Nike orders came in recycled cardboard with no plastic. Small thing but I appreciate it.", reply:"Aiko, this genuinely matters to us 🌱 We've moved to 100% recycled packaging across Europe as part of Move to Zero. Thank you for caring! 👟", customerMsg2:"The tissue paper is recycled too right? Because it even smells better 😄" },
  { id:'msg-101', brandId:'brand-2', customerId:'c13', ticketNumber:'#162087', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T11:00:00Z', tags:[{label:'bug',color:'#dc2626'},{label:'mobile',color:'#f97316'}], subject:'Spotify widget disappeared from iPhone lock screen', preview:"My Spotify lock screen widget stopped showing after I updated to iOS 17.5.1.", aiDraft:"Sarah, the lock screen widget disappears on iOS 17.5.1 if Spotify isn't set as default media app. Long press your lock screen → Customize → add the Spotify widget back. If it's missing from the picker, enable Background App Refresh in iPhone Settings → Spotify first. 🎵" },
  { id:'msg-102', brandId:'brand-3', customerId:'c26', ticketNumber:'#162086', platform:'instagram', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-25T14:00:00Z', tags:[], subject:'Is it safe to share my passport for Airbnb verification?', preview:"The app is asking me to upload my passport for identity verification. Is this secure?", reply:"Marcus, all document uploads are encrypted with AES-256 and processed by Stripe Identity (EU GDPR-compliant). We never store the raw document after verification. Same technology banks use. 🔒", customerMsg2:"Completed the verification. Feels much more trustworthy now." },
  { id:'msg-103', brandId:'brand-1', customerId:'c15', ticketNumber:'#162085', platform:'instagram', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T08:00:00Z', tags:[{label:'app',color:'#0891b2'}], subject:'NRC not counting elevation on hilly routes', preview:"I run a hilly route with 150m elevation but Nike Run Club shows 0m elevation gain every time.", aiDraft:"Priya, elevation tracking requires the barometric altimeter and needs location permission set to 'Always'. Go to Settings → Privacy → Location Services → Nike Run Club → set to 'Always'. That should fix elevation tracking immediately. 🏃" },
  { id:'msg-104', brandId:'brand-2', customerId:'c27', ticketNumber:'#162084', platform:'facebook', channel:'Spotify', status:'answered', unread:false, starred:true, replyCount:3, newReplies:0, timestamp:'2026-05-24T10:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Podcast recommendations better than YouTube suggestions', preview:"Spotify's podcast algorithm has sent me down the best rabbit holes. Educational content specifically.", reply:"James, we'll take that comparison as the highest possible compliment 😄🎙️ Any specific shows that knocked your socks off?", customerMsg2:"Huberman Lab, 99% Invisible, and Darknet Diaries in one week. My brain expanded 3 sizes." },
  { id:'msg-105', brandId:'brand-3', customerId:'c24', ticketNumber:'#162083', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T16:00:00Z', tags:[{label:'listing',color:'#f97316'}], subject:'Pool in listing photos is shared — wasn\'t disclosed', preview:"The listing showed a pool in the photos. It's a shared building pool, not private. Felt misled.", aiDraft:"Lena, listing amenities must accurately reflect whether they are private or shared. If the listing implied a private pool and it's shared, that's a disclosure failure. You may be eligible for a partial refund under our Listing Accuracy Policy. DM us your booking number and we'll review and compensate appropriately. 🏠" },
  { id:'msg-106', brandId:'brand-1', customerId:'c28', ticketNumber:'#162082', platform:'instagram', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-23T09:00:00Z', tags:[], subject:'Alphafly 3 runs small — size guide issue?', preview:"I always wear EU44 in Nike but the Alphafly 3 in 44 is definitely more like a 43.", reply:"Tom, the Alphafly 3 does run narrow — our guide notes 'go half a size up' for this model. Exchange a 44.5 and it should feel perfect. Exchange is free. 🏃", customerMsg2:"The 44.5 fits perfectly. Thanks for the honest answer!" },
  { id:'msg-107', brandId:'brand-2', customerId:'c8', ticketNumber:'#162081', platform:'twitter', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T10:00:00Z', tags:[{label:'billing',color:'#16a34a'}], subject:'Why am I being charged in USD instead of EUR?', preview:"I'm in the Netherlands and my Spotify is charging me in USD. I want EUR.", aiDraft:"Yasmin, USD charges happen when the App Store or Google Play handles the subscription. To switch to EUR: cancel the subscription through App Store/Play Store, then re-subscribe at spotify.com/premium — that routes through our EU payment system. 🎵" },
  { id:'msg-108', brandId:'brand-3', customerId:'c9', ticketNumber:'#162080', platform:'instagram', channel:'Airbnb', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-22T10:00:00Z', tags:[], subject:'What happens if a host cancels my booking?', preview:"My host just sent a message hinting they might need to cancel. What are my rights if they do?", reply:"Felix, if a host cancels, Airbnb automatically covers your rebooking — we'll find you an equivalent or better listing, or issue a full refund. Host cancellations also affect their standing on the platform. You're fully protected! 🏠", customerMsg2:"Good to know. Will keep communicating with them but reassured either way." },
  { id:'msg-109', brandId:'brand-1', customerId:'c14', ticketNumber:'#162079', platform:'facebook', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T07:30:00Z', tags:[{label:'shipping',color:'#f97316'}], subject:'Order stuck in customs for 12 days', preview:"My order has been stuck in Dutch customs for 12 days. Tracking says 'Customs clearance in progress'.", aiDraft:"Isabelle, 12 days in customs is well outside the norm and we're escalating with DHL right now. If not released within 48 hours, we'll send a replacement at no cost. We'll email you an update by tomorrow morning. Keep moving! 💪" },
  { id:'msg-110', brandId:'brand-2', customerId:'c16', ticketNumber:'#162078', platform:'instagram', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-21T11:00:00Z', tags:[], subject:'Can I import my Apple Music library?', preview:"I'm switching from Apple Music and have 3,000 songs. Is there an import tool?", reply:"Daan, try Soundiiz (soundiiz.com) — transfers Apple Music playlists to Spotify in under 5 minutes. Free tier works great! 🎵", customerMsg2:"Used Soundiiz and it worked perfectly! Every playlist transferred. Thank you!!" },
  { id:'msg-111', brandId:'brand-3', customerId:'c12', ticketNumber:'#162077', platform:'twitter', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T11:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'My TikTok Airbnb video went viral — want to collab', preview:"I featured an Airbnb in my travel vlog and got 2M views. 400 comments asking about the listing. Can we collab?", aiDraft:"Aiko, 2M views is incredible! Email creators@airbnb.com with your video link, channel stats and contact details. Our team reviews within 5 business days." },
  { id:'msg-112', brandId:'brand-1', customerId:'c11', ticketNumber:'#162076', platform:'twitter', channel:'Nike Europe', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-20T10:00:00Z', tags:[], subject:'Nike By You — when will more base models be added?', preview:"Love Nike By You but the base model options feel limited. Any new models coming?", reply:"Daan, the Nike By You catalog expands every quarter — keep an eye on Nike.com/nikebyyou in July. Big things coming! 👟✨", customerMsg2:"July noted! Please add the Pegasus 41 to the builder 🙏" },
  { id:'msg-113', brandId:'brand-2', customerId:'c12', ticketNumber:'#162075', platform:'instagram', channel:'Spotify', status:'answered', unread:false, starred:true, replyCount:2, newReplies:0, timestamp:'2026-05-19T12:00:00Z', tags:[{label:'feedback',color:'#16a34a'}], subject:'Spotify playlist with 40k followers from TikTok', preview:"Made a study lo-fi playlist that has 40k Spotify followers from my TikTok. Can we work together?", reply:"Aiko, submit at artists.spotify.com/playlists with your TikTok stats — our editorial team actively looks for creator-driven playlists. 🎵", customerMsg2:"Submitted! This would be a dream collab 🙏" },
  { id:'msg-114', brandId:'brand-1', customerId:'c19', ticketNumber:'#162074', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T06:30:00Z', tags:[{label:'app',color:'#0891b2'},{label:'bug',color:'#dc2626'}], subject:'NRC challenge progress reset overnight', preview:"I was on Day 19 of the 30-day challenge and this morning my progress shows Day 1. Everything gone.", aiDraft:"Sarah, losing 19 days of challenge progress is awful and we're so sorry. Our team has restored your streak data — you're back to Day 19. This was a server sync bug in v3.14.2 fixed in today's update. Keep going — Day 30 is yours! 🏃‍♀️" },
  { id:'msg-115', brandId:'brand-3', customerId:'c23', ticketNumber:'#162073', platform:'facebook', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T13:00:00Z', tags:[{label:'refund',color:'#dc2626'}], subject:'Refund promised by host but not received after 2 weeks', preview:"My host agreed to refund the cleaning fee (€80) 2 weeks ago but I've never received it.", aiDraft:"Marcus, if a host agreed to a refund but hasn't processed it, Airbnb can step in. Go to Resolution Centre → Case #AIR-{booking} → 'Request money from Airbnb' — our team will process the €80 directly to you within 3–5 days. We'll also follow up with the host." },
  { id:'msg-116', brandId:'brand-2', customerId:'c30', ticketNumber:'#162072', platform:'twitter', channel:'Spotify', status:'answered', unread:false, starred:false, replyCount:2, newReplies:0, timestamp:'2026-05-18T09:00:00Z', tags:[], subject:'How does Spotify handle artist royalties?', preview:"I'm a musician and curious how Spotify pays artists. Is there a minimum threshold before payout?", reply:"Priya, great question! Artists are paid per stream based on their share of total streams. Payouts go to rights holders (labels/distributors) who then pay artists per their contracts. Direct artists using DistroKid etc. are paid monthly with no minimum threshold. 🎵", customerMsg2:"Thanks for the honest breakdown. Uploading my first single next month!" },
  { id:'msg-117', brandId:'brand-1', customerId:'c4', ticketNumber:'#162071', platform:'instagram', channel:'Nike Europe', status:'ai_pending', unread:true, starred:true, replyCount:1, newReplies:1, timestamp:'2026-06-29T10:00:00Z', tags:[{label:'partnership',color:'#0891b2'},{label:'urgent',color:'#dc2626'}], subject:'Creator contract question — urgent before 5pm deadline', preview:"I have a question about exclusivity clauses in the creator contract Emma sent. Need to respond by 5pm today.", aiDraft:"James, for contract questions please reply directly to Emma at emma.creator@nike.com and CC partnerships@nike.com — they can answer exclusivity questions and adjust terms. Emma is available until 6pm today. Go get it! 💪" },
  { id:'msg-118', brandId:'brand-3', customerId:'c25', ticketNumber:'#162070', platform:'instagram', channel:'Airbnb', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T10:00:00Z', tags:[{label:'listing',color:'#f97316'}], subject:'Listing says "central location" but it\'s 45 min from city', preview:"The listing describes itself as 'central location, 5 min walk to everything'. It's 45 minutes from the city centre.", aiDraft:"Lena, a listing claiming 'central location' that is 45 minutes from the city centre is a clear misrepresentation. Under our Listing Accuracy Policy you're entitled to a partial refund. DM us your booking number and we'll open a case immediately. We're also reviewing the listing description. 🏠" },
  { id:'msg-119', brandId:'brand-2', customerId:'c6', ticketNumber:'#162069', platform:'facebook', channel:'Spotify', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-28T12:00:00Z', tags:[{label:'account',color:'#0891b2'}], subject:'Can\'t create account — SMS verification never arrives', preview:"Trying to create a Spotify account but the SMS code never arrives. Tried 5 times on different phones.", aiDraft:"Sorry you're hitting this! Try verifying via email instead: tap 'Send via email' on the verification screen. If you don't see that option, DM us and we'll verify your account manually — usually done within an hour. 🎵" },
  { id:'msg-120', brandId:'brand-1', customerId:'c6', ticketNumber:'#162068', platform:'twitter', channel:'Nike Europe', status:'unanswered', unread:true, starred:false, replyCount:0, newReplies:0, timestamp:'2026-06-29T06:00:00Z', tags:[{label:'shipping',color:'#f97316'}], subject:'Package delivered to wrong address', preview:"Your courier delivered my package to the wrong address. Tracking says delivered but I have nothing.", aiDraft:"We're so sorry your package wasn't delivered correctly. Share your order number via DM and we'll open a carrier investigation immediately — if not resolved within 24 hours, we'll send a replacement at no cost. Keep moving! 💪" },
]

const generatedMessages: Message[] = seeds.map(makeMsg)

export const messages: Message[] = [...baseMessages, ...generatedMessages]
