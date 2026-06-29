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
]

export const channels: Channel[] = [
  { id: 'ch-1', platform: 'facebook', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-2', platform: 'twitter', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-3', platform: 'instagram', name: 'Nike Europe', brandId: 'brand-1' },
  { id: 'ch-4', platform: 'twitter', name: 'Spotify', brandId: 'brand-2' },
  { id: 'ch-5', platform: 'instagram', name: 'Spotify', brandId: 'brand-2' },
  { id: 'ch-6', platform: 'twitter', name: 'Airbnb', brandId: 'brand-3' },
  { id: 'ch-7', platform: 'instagram', name: 'Airbnb', brandId: 'brand-3' },
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
  {
    id: 'msg-1',
    brandId: 'brand-1',
    customerId: 'c1',
    subject: "My order hasn't arrived and I have a race this weekend!",
    preview: 'I ordered the Air Max Pro 3 weeks ago and still haven\'t received them. I have a half marathon this weekend...',
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
        id: 't2',
        type: 'status_change',
        content: 'Status changed to: Under Review',
        author: 'System',
        timestamp: '2026-06-27T08:45:00Z',
        isCustomer: false,
      },
      {
        id: 't3',
        type: 'note',
        content: 'Checked order system. Shipment delayed at Frankfurt hub due to customs. Carrier tracking shows delivery estimate June 30.',
        author: 'Emma (Agent)',
        timestamp: '2026-06-27T09:10:00Z',
        isCustomer: false,
      },
      {
        id: 't4',
        type: 'message',
        content: "Still nothing!! The race is Saturday. Can you expedite or send a replacement from a local store? I've been a Nike member for 8 years.",
        author: 'Sarah Chen',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        timestamp: '2026-06-29T09:14:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't5',
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
    timeline: [
      {
        id: 't6',
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
        id: 't7',
        type: 'message',
        content: "Hi Nike team! I'm James, a fitness content creator with 220k+ followers across Instagram, Twitter and LinkedIn. I'd love to discuss a potential brand partnership for the upcoming Fall collection. I've been wearing Nike exclusively for the past 3 years. Let's connect!",
        author: 'James Holloway',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        timestamp: '2026-06-28T14:05:00Z',
        platform: 'linkedin',
        isCustomer: true,
      },
      {
        id: 't8',
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
    timeline: [
      {
        id: 't9',
        type: 'message',
        content: 'Hey @Spotify — I was charged twice for Premium this month (€9.99 x2 on June 1). This happened because I tried to upgrade and the page crashed. My account shows only one subscription. Please refund the duplicate charge.',
        author: 'Priya Nair',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        timestamp: '2026-06-29T10:01:00Z',
        platform: 'twitter',
        isCustomer: true,
      },
      {
        id: 't10',
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
    subject: 'Playlist disappeared after update',
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
    timeline: [
      {
        id: 't11',
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
    timeline: [
      {
        id: 't12',
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
    id: 'msg-7',
    brandId: 'brand-1',
    customerId: 'c6',
    subject: "Let's play with colors! 🌈🚀",
    preview: 'Warna apa yang kamu suka dari koleksi terbaru Nike?',
    status: 'unanswered',
    platform: 'instagram',
    channel: 'Nike Europe',
    timestamp: '2026-06-29T10:20:00Z',
    unread: false,
    starred: false,
    assignedTo: undefined,
    ticketNumber: '#162195',
    replyCount: 0,
    newReplies: 0,
    tags: [],
    timeline: [
      {
        id: 't13',
        type: 'message',
        content: 'Warna apa yang kamu suka dari koleksi terbaru Nike? 🌈',
        author: 'Anonymous profile',
        timestamp: '2026-06-29T10:20:00Z',
        platform: 'instagram',
        isCustomer: true,
      },
    ],
  },
]
