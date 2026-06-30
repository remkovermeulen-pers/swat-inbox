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
}

export interface BrandSettings {
  toneOfVoice: string
  instructions: string
  autoRespond: boolean
  escalationKeywords: string[]
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
    totalReach: 128400,
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
    totalReach: 31200,
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
    totalReach: 67800,
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
    totalReach: 412000,
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
    totalReach: 22100,
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
    totalReach: 94500,
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
    totalReach: 18700,
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
    totalReach: 7800,
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
    totalReach: 52300,
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
    totalReach: 41200,
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
    totalReach: 189000,
    socialProfiles: [
      { platform: 'tiktok', handle: '@aikotanaka', followers: 142000 },
      { platform: 'instagram', handle: '@aiko.tanaka', followers: 47000 },
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
    },
  },
]

export const messages: Message[] = [
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
