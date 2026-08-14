import type { Customer, InboxFilter, Message, MessageStatus, Sentiment } from '../data/mockData'

export type SortCol = 'name' | 'ticket' | 'replies' | 'reach' | 'channel' | 'time' | 'priority'
export type SortDir = 'asc' | 'desc'

export const AGENTS = ['Remko', 'Emma', 'Jonas', 'Mei']

export const KNOWN_TAGS = [
  'account', 'app', 'billing', 'booking', 'bug', 'defect', 'feedback', 'host',
  'listing', 'mobile', 'partnership', 'profanity', 'refund', 'returns', 'review', 'safety',
  'shipping', 'stock', 'urgent', 'warranty',
]

/* ── Generic per-column filter conditions (used by the "New custom view" builder) ── */

export type FilterField =
  | 'customerName' | 'subject' | 'preview' | 'ticketNumber' | 'channel'
  | 'replies' | 'reach' | 'priority'
  | 'platform' | 'status' | 'sentiment' | 'tag'

export type FieldType = 'text' | 'number' | 'select'

export const FIELD_DEFS: Record<FilterField, { label: string; type: FieldType; options?: string[] }> = {
  customerName: { label: 'Name', type: 'text' },
  subject: { label: 'Subject', type: 'text' },
  preview: { label: 'Message', type: 'text' },
  ticketNumber: { label: 'Ticket #', type: 'number' },
  channel: { label: 'Channel', type: 'text' },
  replies: { label: 'Replies', type: 'number' },
  reach: { label: 'Reach', type: 'number' },
  priority: { label: 'Priority', type: 'select', options: ['Critical', 'High', 'Normal', 'Low'] },
  platform: { label: 'Platform', type: 'select', options: ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'] },
  status: { label: 'Status', type: 'select', options: ['unanswered', 'answered', 'ai_pending'] },
  sentiment: { label: 'Sentiment', type: 'select', options: ['negative', 'neutral', 'positive'] },
  tag: { label: 'Tag', type: 'select', options: KNOWN_TAGS },
}

export const FILTER_FIELDS = Object.keys(FIELD_DEFS) as FilterField[]

export const TEXT_OPERATORS = [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
]

export const NUMBER_OPERATORS = [
  { value: 'eq', label: '=' },
  { value: 'neq', label: '≠' },
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'gte', label: '≥' },
  { value: 'lte', label: '≤' },
  { value: 'between', label: 'between' },
]

/** Separator used to pack a "between" range's two numbers into a single FilterCondition value string. */
export const RANGE_SEPARATOR = '~'

export const SELECT_OPERATORS = [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
]

export function operatorsForField(field: FilterField) {
  const type = FIELD_DEFS[field].type
  return type === 'number' ? NUMBER_OPERATORS : type === 'select' ? SELECT_OPERATORS : TEXT_OPERATORS
}

export function defaultOperatorForField(field: FilterField) {
  return operatorsForField(field)[0].value
}

export interface FilterCondition {
  field: FilterField
  operator: string
  /** string for text/number fields, string[] for select fields (multi-value "is any of") */
  value: string | string[]
}

function getFieldValue(field: FilterField, msg: Message, customer: Customer | undefined): string | number {
  switch (field) {
    case 'customerName': return customer?.name ?? ''
    case 'subject': return msg.subject
    case 'preview': return msg.preview
    case 'ticketNumber': return Number(msg.ticketNumber.replace(/\D/g, ''))
    case 'channel': return msg.channel
    case 'replies': return msg.replyCount
    case 'reach': return customer?.totalReach ?? 0
    case 'priority': return priorityTier(getPriorityScore(msg, customer)).label
    case 'platform': return msg.platform
    case 'status': return msg.status
    case 'sentiment': return customer?.sentiment ?? ''
    default: return ''
  }
}

export function evaluateCondition(cond: FilterCondition, msg: Message, customer: Customer | undefined): boolean {
  const def = FIELD_DEFS[cond.field]
  const values = (Array.isArray(cond.value) ? cond.value : [cond.value]).filter((v) => v !== '').map((v) => v.toLowerCase())

  if (cond.field === 'tag') {
    if (values.length === 0) return true
    const tagLabels = msg.tags.map((t) => t.label.toLowerCase())
    const has = values.some((v) => tagLabels.includes(v))
    return cond.operator === 'is_not' ? !has : has
  }

  if (def.type === 'select') {
    if (values.length === 0) return true
    const raw = String(getFieldValue(cond.field, msg, customer)).toLowerCase()
    const is = values.includes(raw)
    return cond.operator === 'is_not' ? !is : is
  }

  if (def.type === 'number') {
    const valueStr = Array.isArray(cond.value) ? cond.value[0] : cond.value
    if (!valueStr || valueStr === '') return true
    const num = Number(getFieldValue(cond.field, msg, customer))

    if (cond.operator === 'between') {
      const [minStr, maxStr] = valueStr.split(RANGE_SEPARATOR)
      const min = minStr ? Number(minStr) : -Infinity
      const max = maxStr ? Number(maxStr) : Infinity
      if (Number.isNaN(min) || Number.isNaN(max)) return true
      return num >= min && num <= max
    }

    const val = Number(valueStr)
    if (Number.isNaN(val)) return true
    switch (cond.operator) {
      case 'eq': return num === val
      case 'neq': return num !== val
      case 'gt': return num > val
      case 'lt': return num < val
      case 'gte': return num >= val
      case 'lte': return num <= val
      default: return true
    }
  }

  // text field
  const valueStr = Array.isArray(cond.value) ? cond.value[0] : cond.value
  if (!valueStr || !valueStr.trim()) return true
  const a = String(getFieldValue(cond.field, msg, customer)).toLowerCase()
  const v = valueStr.toLowerCase()
  switch (cond.operator) {
    case 'is': return a === v
    case 'is_not': return a !== v
    case 'contains': return a.includes(v)
    case 'not_contains': return !a.includes(v)
    default: return true
  }
}

export interface CustomView {
  id: string
  name: string
  icon: string
  color: string
  /** OR-matched against subject/preview text — legacy shorthand, still used by the seeded default views */
  keywords?: string[]
  /** OR-matched against message tag labels — legacy shorthand */
  tags?: string[]
  /** AND-narrowing: customer sentiment must be one of these — legacy shorthand */
  sentiments?: Sentiment[]
  /** AND-narrowing: customer.totalReach must be >= this — legacy shorthand */
  minReach?: number
  /** AND-narrowing: message status must be one of these — legacy shorthand */
  statuses?: MessageStatus[]
  /** AND-narrowing: restrict this view to one brand — legacy shorthand */
  brandId?: string
  /** Generic per-column conditions built by the "New custom view" filter builder — ANDed together */
  conditions?: FilterCondition[]
  /** Ordering to apply automatically when this view is selected */
  sortCol?: SortCol
  sortDir?: SortDir
}

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
  if (view.conditions?.length && !view.conditions.every((c) => evaluateCondition(c, msg, customer))) return false
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

/** A view pinned to the sidebar nav — either a built-in Inbox filter or a custom/smart view, in display order. */
export type PinnedItem = { kind: 'filter'; key: InboxFilter } | { kind: 'view'; id: string }

export function samePinnedItem(a: PinnedItem, b: PinnedItem): boolean {
  if (a.kind !== b.kind) return false
  return a.kind === 'filter' && b.kind === 'filter' ? a.key === b.key : a.kind === 'view' && b.kind === 'view' ? a.id === b.id : false
}

const PINNED_ITEMS_KEY = 'inbox-pinned-items'

export function loadPinnedItems(): PinnedItem[] {
  try {
    const raw = localStorage.getItem(PINNED_ITEMS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PinnedItem[]) : []
  } catch {
    return []
  }
}

export function savePinnedItems(items: PinnedItem[]) {
  localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(items))
}

/** Removes any existing occurrence of `item` from `list`, then inserts it at `atIndex` — used for both pinning and reordering. */
export function insertPinnedItemAt(list: PinnedItem[], item: PinnedItem, atIndex: number): PinnedItem[] {
  const withoutDup = list.filter((p) => !samePinnedItem(p, item))
  const idx = Math.min(Math.max(0, atIndex), withoutDup.length)
  return [...withoutDup.slice(0, idx), item, ...withoutDup.slice(idx)]
}

const VIEW_ORDER_KEY = 'inbox-view-order'

/** The display order of the view pills atop the Inbox/Comments list. Returns null when nothing has been saved yet. */
export function loadViewOrder(): PinnedItem[] | null {
  try {
    const raw = localStorage.getItem(VIEW_ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PinnedItem[]) : null
  } catch {
    return null
  }
}

export function saveViewOrder(items: PinnedItem[]) {
  localStorage.setItem(VIEW_ORDER_KEY, JSON.stringify(items))
}
