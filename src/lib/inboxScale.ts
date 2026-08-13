import type { Customer, Message, MessageStatus, Sentiment } from '../data/mockData'

export type SortCol = 'name' | 'ticket' | 'replies' | 'reach' | 'channel' | 'time' | 'priority'
export type SortDir = 'asc' | 'desc'

export interface CustomView {
  id: string
  name: string
  icon: string
  color: string
  /** OR-matched against subject/preview text */
  keywords?: string[]
  /** OR-matched against message tag labels */
  tags?: string[]
  /** AND-narrowing: customer sentiment must be one of these */
  sentiments?: Sentiment[]
  /** AND-narrowing: customer.totalReach must be >= this */
  minReach?: number
  /** AND-narrowing: message status must be one of these */
  statuses?: MessageStatus[]
  /** AND-narrowing: restrict this view to one brand */
  brandId?: string
  /** AND-narrowing: restrict this view to one channel */
  channelId?: string
  /** Ordering to apply automatically when this view is selected */
  sortCol?: SortCol
  sortDir?: SortDir
}

export const AGENTS = ['Remko', 'Emma', 'Jonas', 'Mei']

export const KNOWN_TAGS = [
  'account', 'app', 'billing', 'booking', 'bug', 'defect', 'feedback', 'host',
  'listing', 'mobile', 'partnership', 'refund', 'returns', 'review', 'safety',
  'shipping', 'stock', 'urgent', 'warranty',
]

export const DEFAULT_CUSTOM_VIEWS: CustomView[] = [
  {
    id: 'view-crisis',
    name: 'Crisis Watch',
    icon: '🔥',
    color: '#dc2626',
    keywords: ['hacked', 'snapped', 'crushed', 'scam', 'unauthorized', 'smoke alarm', 'entered'],
    tags: ['urgent', 'safety'],
  },
  {
    id: 'view-vip',
    name: 'VIP Escalations',
    icon: '⭐',
    color: '#f59e0b',
    sentiments: ['negative'],
    minReach: 200,
  },
  {
    id: 'view-billing',
    name: 'Billing Disputes',
    icon: '💳',
    color: '#16a34a',
    keywords: ['charge', 'refund', 'billing', 'invoice', 'price'],
    tags: ['billing', 'refund'],
  },
]

export function messageMatchesView(msg: Message, customer: Customer | undefined, view: CustomView): boolean {
  const hasContentFilter = Boolean(view.keywords?.length || view.tags?.length)
  if (hasContentFilter) {
    const haystack = `${msg.subject} ${msg.preview}`.toLowerCase()
    const keywordMatch = view.keywords?.some((k) => haystack.includes(k.toLowerCase())) ?? false
    const tagMatch = view.tags?.some((t) => msg.tags.some((mt) => mt.label.toLowerCase() === t.toLowerCase())) ?? false
    if (!keywordMatch && !tagMatch) return false
  }
  if (view.sentiments?.length && (!customer || !view.sentiments.includes(customer.sentiment))) return false
  if (view.minReach != null && (!customer || customer.totalReach < view.minReach)) return false
  if (view.statuses?.length && !view.statuses.includes(msg.status)) return false
  if (view.brandId && msg.brandId !== view.brandId) return false
  return true
}

export function getPriorityScore(msg: Message, customer: Customer | undefined): number {
  let score = 0
  if (customer?.sentiment === 'negative') score += 30
  const tagLabels = msg.tags.map((t) => t.label.toLowerCase())
  if (tagLabels.includes('urgent')) score += 25
  if (tagLabels.includes('safety')) score += 25
  if (tagLabels.includes('bug') || tagLabels.includes('defect')) score += 10
  if (customer && customer.totalReach >= 10000) score += 20
  else if (customer && customer.totalReach >= 1000) score += 8
  if (msg.status === 'unanswered') {
    score += 10
    const hoursOpen = (Date.now() - new Date(msg.timestamp).getTime()) / 36e5
    score += Math.min(15, Math.max(0, hoursOpen) / 4)
  }
  if (msg.unread) score += 5
  return Math.round(Math.min(100, score))
}

export function priorityTier(score: number): { label: string; color: string } {
  if (score >= 55) return { label: 'Critical', color: '#dc2626' }
  if (score >= 30) return { label: 'High', color: '#f59e0b' }
  if (score >= 12) return { label: 'Normal', color: '#6b7280' }
  return { label: 'Low', color: '#d1d5db' }
}

const VIEWS_KEY = 'inbox-custom-views'

export function loadCustomViews(): CustomView[] {
  try {
    const raw = localStorage.getItem(VIEWS_KEY)
    if (!raw) return DEFAULT_CUSTOM_VIEWS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return DEFAULT_CUSTOM_VIEWS
  } catch {
    return DEFAULT_CUSTOM_VIEWS
  }
}

export function saveCustomViews(views: CustomView[]) {
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views))
}
