import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { messages, customers, brands, channels } from '../data/mockData'
import type { Message, InboxFilter, Tag, Sentiment, Platform, MessageStatus } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { CreateViewModal } from './CreateViewModal'
import { CommentCard } from './CommentCard'
import {
  AGENTS, KNOWN_TAGS, getPriorityScore, messageMatchesView, priorityTier, samePinnedItem,
  FIELD_DEFS, operatorsForField, defaultOperatorForField, evaluateCondition, RANGE_SEPARATOR,
  type CustomView, type FilterCondition, type FilterField, type SortCol, type SortDir, type PinnedItem,
} from '../lib/inboxScale'
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Tag as TagIcon,
  CheckCheck,
  Archive,
  BookmarkPlus,
  Columns3,
  SlidersHorizontal,
  X,
  Sparkles,
  UserCheck,
  AtSign,
  Eye,
  Rows3,
  Calendar,
  List,
  LayoutList,
  Plus,
  BellOff,
} from 'lucide-react'

const PLATFORMS: Platform[] = ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube']
const SENTIMENTS: Sentiment[] = ['negative', 'neutral', 'positive']

// Matches the colors priorityTier() uses for each label, so the Priority filter's pills look like the column badges.
const PRIORITY_TIER_COLORS: Record<string, string> = {
  Critical: '#dc2626', High: '#f59e0b', Normal: '#6b7280', Low: '#d1d5db',
}

const BASE_FILTER_META: Partial<Record<InboxFilter, { icon: React.ReactNode; label: string }>> = {
  new: { icon: <Sparkles size={13} />, label: 'New' },
  assigned_me: { icon: <UserCheck size={13} />, label: 'Assigned to me' },
  starred: { icon: <Star size={13} />, label: 'Starred' },
}

function ViewDropIndicator() {
  return <div style={{ width: 2, height: 28, borderRadius: 1, background: '#5e6ad2', flexShrink: 0 }} />
}

function ColDropIndicator() {
  return <div style={{ width: 2, height: 16, borderRadius: 1, background: '#5e6ad2', flexShrink: 0 }} />
}

interface Props {
  brandId: string | null
  channelId: string | null
  filter: InboxFilter
  onFilterChange: (f: InboxFilter) => void
  customViews: CustomView[]
  activeViewId: string | null
  onAddView: (view: CustomView) => void
  onViewChange: (id: string | null) => void
  onDeleteView: (id: string) => void
  onUpdateView: (id: string, patch: Partial<CustomView>) => void
  viewOrder: PinnedItem[]
  onReorderView: (item: PinnedItem, atIndex: number) => void
}

const STATUS_LABELS: Record<MessageStatus, string> = {
  unanswered: 'Unanswered',
  ai_pending: 'AI pending',
  answered: 'Answered',
}

const COLUMN_FILTER_FIELDS = ['customerName', 'priority', 'ticketNumber', 'replies', 'reach'] as const

type TimeRangePreset = 'all' | 'today' | '7d' | '30d' | 'custom'

const TIME_RANGE_LABELS: Record<TimeRangePreset, string> = {
  all: 'All time', today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', custom: 'Custom range',
}

type GroupField = 'platform' | 'status' | 'sentiment' | 'channel' | 'thread'

const GROUP_LABELS: Record<GroupField, string> = {
  platform: 'Platform', status: 'Status', sentiment: 'Sentiment', channel: 'Channel', thread: 'Thread',
}

type ColKey = 'tags' | 'priority' | 'ticket' | 'replies' | 'reach' | 'channel' | 'time'

const TOGGLEABLE_COLUMNS: { key: ColKey; label: string; width: number }[] = [
  { key: 'tags', label: 'Tags', width: 200 },
  { key: 'priority', label: 'Priority', width: 72 },
  { key: 'ticket', label: 'Ticket #', width: 80 },
  { key: 'replies', label: 'Replies', width: 60 },
  { key: 'reach', label: 'Reach', width: 70 },
  { key: 'channel', label: 'Channel', width: 130 },
  { key: 'time', label: 'Time', width: 56 },
]

type ColWidthKey = 'name' | 'tags' | ColKey

const DEFAULT_COL_WIDTHS: Record<ColWidthKey, number> = {
  name: 140, tags: 200, priority: 72, ticket: 80, replies: 60, reach: 70, channel: 130, time: 56,
}

const COL_WIDTHS_KEY = 'inbox-col-widths'

function loadColWidths(): Record<ColWidthKey, number> {
  try {
    const raw = localStorage.getItem(COL_WIDTHS_KEY)
    if (!raw) return { ...DEFAULT_COL_WIDTHS }
    return { ...DEFAULT_COL_WIDTHS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_COL_WIDTHS }
  }
}

function saveColWidths(widths: Record<ColWidthKey, number>) {
  localStorage.setItem(COL_WIDTHS_KEY, JSON.stringify(widths))
}

type ReorderableCol = ColKey

const DEFAULT_COL_ORDER: ReorderableCol[] = ['tags', 'priority', 'ticket', 'replies', 'reach', 'channel', 'time']

const COL_ORDER_KEY = 'inbox-col-order'

function loadColOrder(): ReorderableCol[] {
  try {
    const raw = localStorage.getItem(COL_ORDER_KEY)
    if (!raw) return [...DEFAULT_COL_ORDER]
    const parsed = JSON.parse(raw) as ReorderableCol[]
    const valid = parsed.filter((k) => DEFAULT_COL_ORDER.includes(k))
    const missing = DEFAULT_COL_ORDER.filter((k) => !valid.includes(k))
    return [...valid, ...missing]
  } catch {
    return [...DEFAULT_COL_ORDER]
  }
}

function saveColOrder(order: ReorderableCol[]) {
  localStorage.setItem(COL_ORDER_KEY, JSON.stringify(order))
}

const REORDERABLE_COL_LABELS: Record<ReorderableCol, string> = {
  tags: 'Tags', priority: 'Priority', ticket: 'Ticket #', replies: 'Replies', reach: 'Reach', channel: 'Channel', time: 'Time',
}

const VISIBLE_COLS_KEY = 'inbox-visible-columns'

function loadVisibleCols(): Set<ColKey> {
  try {
    const raw = localStorage.getItem(VISIBLE_COLS_KEY)
    if (!raw) return new Set(TOGGLEABLE_COLUMNS.map((c) => c.key))
    const parsed = JSON.parse(raw) as ColKey[]
    return new Set(parsed)
  } catch {
    return new Set(TOGGLEABLE_COLUMNS.map((c) => c.key))
  }
}

const HIDDEN_FILTERS_KEY = 'inbox-hidden-filters'

function loadHiddenFilters(): Set<InboxFilter> {
  try {
    const raw = localStorage.getItem(HIDDEN_FILTERS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as InboxFilter[])
  } catch {
    return new Set()
  }
}

const inboxFilterCounts: Record<InboxFilter, number> = {
  all: messages.filter((m) => !m.archived).length,
  new: messages.filter((m) => m.unread && !m.archived).length,
  starred: messages.filter((m) => m.starred && !m.archived).length,
  assigned_me: messages.filter((m) => m.assignedTo === 'Remko' && !m.archived).length,
  assigned_others: messages.filter((m) => m.assignedTo && m.assignedTo !== 'Remko' && !m.archived).length,
  archive: messages.filter((m) => m.archived).length,
}

function customViewCount(view: CustomView): number {
  return messages.filter((m) => !m.archived && messageMatchesView(m, customers.find((c) => c.id === m.customerId), view)).length
}

export function TicketList({ brandId, channelId, filter, onFilterChange, customViews, activeViewId, onAddView, onViewChange, onDeleteView, onUpdateView, viewOrder, onReorderView }: Props) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterStatuses, setFilterStatuses] = useState<Set<MessageStatus>>(new Set())
  const [sortCol, setSortCol] = useState<SortCol>('time')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [overrides, setOverrides] = useState<Record<string, Partial<Message>>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(() => loadVisibleCols())
  const [colWidths, setColWidths] = useState<Record<ColWidthKey, number>>(() => loadColWidths())
  const [colOrder, setColOrder] = useState<ReorderableCol[]>(() => loadColOrder())
  const [colDropIndex, setColDropIndex] = useState<number | null>(null)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set())
  const [filterSentiments, setFilterSentiments] = useState<Set<Sentiment>>(new Set())
  const [filterPlatforms, setFilterPlatforms] = useState<Set<Platform>>(new Set())
  const [filterChannels, setFilterChannels] = useState<Set<string>>(new Set())
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showCreateView, setShowCreateView] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards')
  const [showChannelsMenu, setShowChannelsMenu] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showSentimentMenu, setShowSentimentMenu] = useState(false)
  const [showPlatformMenu, setShowPlatformMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [showTimeRangeMenu, setShowTimeRangeMenu] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRangePreset>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [colFilters, setColFilters] = useState<Partial<Record<FilterField, { operator: string; value: string }>>>({})
  const [colFilterMenus, setColFilterMenus] = useState<Partial<Record<FilterField, boolean>>>({})
  const [visibleFilterSlots, setVisibleFilterSlots] = useState(COLUMN_FILTER_FIELDS.length + 7)
  const [hiddenInboxFilters, setHiddenInboxFilters] = useState<Set<InboxFilter>>(() => loadHiddenFilters())
  const [viewDropIndex, setViewDropIndex] = useState<number | null>(null)
  const filterRowRef = useRef<HTMLDivElement>(null)
  const [groupBy, setGroupBy] = useState<GroupField | null>(null)
  const [showGroupMenu, setShowGroupMenu] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  function toggleSetValue<T>(setFn: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) {
    setFn((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  function setColFilterOperator(field: FilterField, operator: string) {
    setColFilters((prev) => ({ ...prev, [field]: { operator, value: prev[field]?.value ?? '' } }))
  }

  function setColFilterValue(field: FilterField, value: string) {
    setColFilters((prev) => ({ ...prev, [field]: { operator: prev[field]?.operator ?? defaultOperatorForField(field), value } }))
  }

  function clearColFilter(field: FilterField) {
    setColFilters((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const activeColFilterCount = Object.values(colFilters).filter((c) => c && c.value.trim()).length

  const activeFilterCount = filterTags.size + filterSentiments.size + filterPlatforms.size + filterChannels.size + filterStatuses.size + activeColFilterCount

  useEffect(() => {
    localStorage.setItem(VISIBLE_COLS_KEY, JSON.stringify(Array.from(visibleCols)))
  }, [visibleCols])

  useEffect(() => {
    localStorage.setItem(HIDDEN_FILTERS_KEY, JSON.stringify(Array.from(hiddenInboxFilters)))
  }, [hiddenInboxFilters])

  useEffect(() => {
    const el = filterRowRef.current
    if (!el) return
    function measure() {
      const w = el!.clientWidth
      // ~115px per pill on average, minus space reserved for the always-present
      // search box + Group by (More Filters + actions only appear once needed).
      const fit = Math.max(0, Math.floor((w - 490) / 115))
      setVisibleFilterSlots(fit)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function toggleColumn(key: ColKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function resizeCol(key: ColWidthKey, newWidth: number) {
    setColWidths((prev) => {
      const next = { ...prev, [key]: Math.max(40, newWidth) }
      saveColWidths(next)
      return next
    })
  }

  const visibleColOrder = colOrder.filter((k) => visibleCols.has(k))

  function reorderCol(key: ReorderableCol, atIndex: number) {
    setColOrder((prev) => {
      const withoutDragged = prev.filter((k) => k !== key)
      const visibleWithoutDragged = withoutDragged.filter((k) => visibleCols.has(k))
      const anchorKey = visibleWithoutDragged[atIndex]
      const insertAt = anchorKey ? withoutDragged.indexOf(anchorKey) : withoutDragged.length
      const next = [...withoutDragged.slice(0, insertAt), key, ...withoutDragged.slice(insertAt)]
      saveColOrder(next)
      return next
    })
  }

  function computeColDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const items = Array.from(e.currentTarget.querySelectorAll('[data-col-header]'))
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect()
      if (e.clientX < rect.left + rect.width / 2) return i
    }
    return items.length
  }

  function handleColHeaderDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setColDropIndex(computeColDropIndex(e))
  }

  function handleColHeaderDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setColDropIndex(null)
  }

  function handleColHeaderDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const atIndex = computeColDropIndex(e)
    setColDropIndex(null)
    const key = e.dataTransfer.getData('text/plain') as ReorderableCol
    if (!DEFAULT_COL_ORDER.includes(key)) return
    reorderCol(key, atIndex)
  }

  const activeView = customViews.find((v) => v.id === activeViewId) ?? null
  const allActive = filter === 'all' && !activeViewId

  const rowItems = viewOrder.filter((item) =>
    item.kind === 'filter' ? !hiddenInboxFilters.has(item.key) : customViews.some((v) => v.id === item.id)
  )

  function computeViewDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const items = Array.from(e.currentTarget.querySelectorAll('[data-view-pill]'))
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect()
      if (e.clientX < rect.left + rect.width / 2) return i
    }
    return items.length
  }

  function handleViewRowDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setViewDropIndex(computeViewDropIndex(e))
  }

  function handleViewRowDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setViewDropIndex(null)
  }

  function handleViewRowDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    let atIndex = computeViewDropIndex(e)
    setViewDropIndex(null)
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    try {
      const payload = JSON.parse(raw) as PinnedItem
      const fromIndex = rowItems.findIndex((p) => samePinnedItem(p, payload))
      if (fromIndex !== -1 && fromIndex < atIndex) atIndex -= 1
      onReorderView(payload, atIndex)
    } catch {
      // ignore malformed drag payloads
    }
  }

  useEffect(() => {
    if (!activeViewId) return
    const v = customViews.find((view) => view.id === activeViewId)
    if (v?.sortCol) { setSortCol(v.sortCol); setSortDir(v.sortDir ?? 'desc') }
    else { setSortCol('priority'); setSortDir('desc') }
    setFilterStatuses(new Set(v?.statuses ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('desc') }
  }

  const channel = channelId ? channels.find((c) => c.id === channelId) : null

  function withOverrides(m: Message): Message {
    const o = overrides[m.id]
    return o ? { ...m, ...o } : m
  }

  let filtered = messages
    .map(withOverrides)
    .filter((m) => (filter === 'archive' ? m.archived === true : !m.archived))
    .filter((m) => {
      if (activeView) {
        const cust = customers.find((c) => c.id === m.customerId)
        return messageMatchesView(m, cust, activeView)
      }
      return (!brandId || m.brandId === brandId)
        && (!channelId || (channel && m.channel === channel.name && m.platform === channel.platform))
    })
    .filter((m) => {
      if (activeView) return true
      if (filter === 'new') return m.unread
      if (filter === 'starred') return m.starred
      if (filter === 'assigned_me') return m.assignedTo === 'Remko'
      if (filter === 'assigned_others') return m.assignedTo && m.assignedTo !== 'Remko'
      return true
    })
    .filter((m) => {
      if (!searchText.trim()) return true
      const cust = customers.find((c) => c.id === m.customerId)
      const haystack = `${m.subject} ${m.preview} ${cust?.name ?? ''} ${m.ticketNumber}`.toLowerCase()
      return haystack.includes(searchText.trim().toLowerCase())
    })
    .filter((m) => {
      if (activeFilterCount === 0) return true
      const cust = customers.find((c) => c.id === m.customerId)
      if (filterTags.size > 0 && !m.tags.some((t) => filterTags.has(t.label))) return false
      if (filterSentiments.size > 0 && (!cust || !filterSentiments.has(cust.sentiment))) return false
      if (filterPlatforms.size > 0 && !filterPlatforms.has(m.platform)) return false
      if (filterChannels.size > 0) {
        const matchesChannel = channels.some((ch) => filterChannels.has(ch.id) && ch.name === m.channel && ch.platform === m.platform)
        if (!matchesChannel) return false
      }
      if (filterStatuses.size > 0 && !filterStatuses.has(m.status)) return false
      for (const field of COLUMN_FILTER_FIELDS) {
        const cond = colFilters[field]
        if (!cond || !cond.value.trim()) continue
        if (!evaluateCondition({ field, operator: cond.operator, value: cond.value }, m, cust)) return false
      }
      return true
    })
    .filter((m) => {
      if (timeRange === 'all') return true
      const ts = new Date(m.timestamp).getTime()
      if (timeRange === 'custom') {
        const from = customFrom ? new Date(customFrom).getTime() : -Infinity
        const to = customTo ? new Date(customTo).getTime() + 24 * 3600 * 1000 : Infinity
        return ts >= from && ts < to
      }
      const days = timeRange === 'today' ? 1 : timeRange === '7d' ? 7 : 30
      const cutoff = Date.now() - days * 24 * 3600 * 1000
      return ts >= cutoff
    })
    .sort((a, b) => {
      const custA = customers.find((c) => c.id === a.customerId)
      const custB = customers.find((c) => c.id === b.customerId)
      let cmp = 0
      if (sortCol === 'time') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      else if (sortCol === 'name') cmp = (custA?.name ?? '').localeCompare(custB?.name ?? '')
      else if (sortCol === 'ticket') cmp = a.ticketNumber.localeCompare(b.ticketNumber)
      else if (sortCol === 'replies') cmp = a.replyCount - b.replyCount
      else if (sortCol === 'reach') cmp = (custA?.totalReach ?? 0) - (custB?.totalReach ?? 0)
      else if (sortCol === 'channel') cmp = a.channel.localeCompare(b.channel)
      else if (sortCol === 'priority') cmp = getPriorityScore(a, custA) - getPriorityScore(b, custB)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const groupedSections = (() => {
    if (!groupBy) return null
    const order: string[] = []
    const buckets = new Map<string, Message[]>()
    for (const msg of filtered) {
      const cust = customers.find((c) => c.id === msg.customerId)
      const key = groupBy === 'platform' ? msg.platform
        : groupBy === 'status' ? STATUS_LABELS[msg.status]
        : groupBy === 'sentiment' ? (cust?.sentiment ?? 'unknown')
        : groupBy === 'thread' ? (cust?.name ?? 'Unknown')
        : msg.channel
      if (!buckets.has(key)) { buckets.set(key, []); order.push(key) }
      buckets.get(key)!.push(msg)
    }
    return order.map((key) => ({ key, items: buckets.get(key)! }))
  })()

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleGroupCollapsed(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((m) => m.id)))
  }

  function applyToSelected(patch: Partial<Message>) {
    setOverrides((prev) => {
      const next = { ...prev }
      selected.forEach((id) => { next[id] = { ...next[id], ...patch } })
      return next
    })
  }

  function bulkAssign(name: string) {
    if (!name) return
    const count = selected.size
    applyToSelected({ assignedTo: name })
    setToast(`Assigned ${count} ticket${count > 1 ? 's' : ''} to ${name}`)
    setSelected(new Set())
  }

  function bulkTag() {
    const label = window.prompt('Tag to add to selected tickets:')
    if (!label?.trim()) return
    const newTag: Tag = { label: label.trim(), color: '#5e6ad2' }
    const count = selected.size
    setOverrides((prev) => {
      const next = { ...prev }
      selected.forEach((id) => {
        const current = withOverrides(messages.find((m) => m.id === id)!)
        if (!current.tags.some((t) => t.label.toLowerCase() === newTag.label.toLowerCase())) {
          next[id] = { ...next[id], tags: [...current.tags, newTag] }
        }
      })
      return next
    })
    setToast(`Tagged ${count} ticket${count > 1 ? 's' : ''} "${newTag.label}"`)
    setSelected(new Set())
  }

  function bulkArchive() {
    const count = selected.size
    applyToSelected({ archived: true })
    setToast(`Archived ${count} ticket${count > 1 ? 's' : ''}`)
    setSelected(new Set())
  }

  function bulkStar() {
    const count = selected.size
    applyToSelected({ starred: true })
    setToast(`Starred ${count} ticket${count > 1 ? 's' : ''}`)
    setSelected(new Set())
  }

  function bulkMute() {
    const count = selected.size
    applyToSelected({ muted: true })
    setToast(`Muted ${count} ticket${count > 1 ? 's' : ''}`)
    setSelected(new Set())
  }

  function currentFiltersAsPatch(): Partial<CustomView> {
    const statuses = filterStatuses.size > 0 ? Array.from(filterStatuses) : undefined
    const conditions: FilterCondition[] = []
    if (filterTags.size > 0) conditions.push({ field: 'tag', operator: 'is', value: Array.from(filterTags) })
    if (filterSentiments.size > 0) conditions.push({ field: 'sentiment', operator: 'is', value: Array.from(filterSentiments) })
    if (filterPlatforms.size > 0) conditions.push({ field: 'platform', operator: 'is', value: Array.from(filterPlatforms) })
    for (const field of COLUMN_FILTER_FIELDS) {
      const cond = colFilters[field]
      if (cond && cond.value.trim()) conditions.push({ field, operator: cond.operator, value: cond.value })
    }
    return {
      statuses,
      conditions: conditions.length ? conditions : activeView?.conditions,
      sortCol,
      sortDir,
    }
  }

  function updateFiltersOnView() {
    if (!activeView) return
    onUpdateView(activeView.id, currentFiltersAsPatch())
    setToast(`Updated view "${activeView.name}"`)
  }

  const hasUnsavedFilterChanges = Boolean(
    activeView && (filterTags.size > 0 || filterSentiments.size > 0 || filterPlatforms.size > 0 || filterStatuses.size > 0 || activeColFilterCount > 0)
  )

  const headerLabel = brandId
    ? brands.find((b) => b.id === brandId)?.name ?? 'Inbox'
    : channel
    ? channel.name
    : 'Inbox'

  const channelsMenuContent = (
    <>
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => toggleSetValue(setFilterChannels, ch.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            border: `1px solid ${filterChannels.has(ch.id) ? '#5e6ad2' : '#e5e7eb'}`,
            background: filterChannels.has(ch.id) ? '#eef2ff' : '#fff',
            color: filterChannels.has(ch.id) ? '#4338ca' : '#6b7280',
          }}
        >
          <PlatformIcon platform={ch.platform} size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.name}</span>
        </button>
      ))}
      {filterChannels.size > 0 && (
        <button
          onClick={() => setFilterChannels(new Set())}
          style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left', fontFamily: 'inherit' }}
        >
          Clear channel filter
        </button>
      )}
    </>
  )

  const visibilityContent = (
    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>All (decorative in this prototype)</p>
  )

  const timeRangeContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {(Object.keys(TIME_RANGE_LABELS) as TimeRangePreset[]).map((tr) => (
          <button
            key={tr}
            onClick={() => setTimeRange(tr)}
            style={{
              padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${timeRange === tr ? '#5e6ad2' : '#e5e7eb'}`,
              background: timeRange === tr ? '#eef2ff' : '#fff',
              color: timeRange === tr ? '#4338ca' : '#6b7280',
            }}
          >
            {TIME_RANGE_LABELS[tr]}
          </button>
        ))}
      </div>
      {timeRange === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#6b7280' }}>
            From
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#6b7280' }}>
            To
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit' }}
            />
          </label>
        </div>
      )}
    </div>
  )

  const statusContent = (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {(Object.keys(STATUS_LABELS) as MessageStatus[]).map((st) => (
        <button
          key={st}
          onClick={() => toggleSetValue(setFilterStatuses, st)}
          style={{
            padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${filterStatuses.has(st) ? '#5e6ad2' : '#e5e7eb'}`,
            background: filterStatuses.has(st) ? '#eef2ff' : '#fff',
            color: filterStatuses.has(st) ? '#4338ca' : '#6b7280',
          }}
        >
          {STATUS_LABELS[st]}
        </button>
      ))}
    </div>
  )

  const sentimentContent = (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {SENTIMENTS.map((s) => (
        <button
          key={s}
          onClick={() => toggleSetValue(setFilterSentiments, s)}
          style={{
            padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit',
            border: `1px solid ${filterSentiments.has(s) ? '#5e6ad2' : '#e5e7eb'}`,
            background: filterSentiments.has(s) ? '#eef2ff' : '#fff',
            color: filterSentiments.has(s) ? '#4338ca' : '#6b7280',
          }}
        >
          {s}
        </button>
      ))}
    </div>
  )

  const platformContent = (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {PLATFORMS.map((p) => (
        <button
          key={p}
          onClick={() => toggleSetValue(setFilterPlatforms, p)}
          style={{
            padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit',
            border: `1px solid ${filterPlatforms.has(p) ? '#5e6ad2' : '#e5e7eb'}`,
            background: filterPlatforms.has(p) ? '#eef2ff' : '#fff',
            color: filterPlatforms.has(p) ? '#4338ca' : '#6b7280',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )

  const tagsContent = (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {KNOWN_TAGS.map((t) => (
        <button
          key={t}
          onClick={() => toggleSetValue(setFilterTags, t)}
          style={{
            padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${filterTags.has(t) ? '#5e6ad2' : '#e5e7eb'}`,
            background: filterTags.has(t) ? '#eef2ff' : '#fff',
            color: filterTags.has(t) ? '#4338ca' : '#6b7280',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )

  function colFilterContent(field: FilterField) {
    const def = FIELD_DEFS[field]
    const cond = colFilters[field] ?? { operator: defaultOperatorForField(field), value: '' }
    const ops = operatorsForField(field)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <select
          value={cond.operator}
          onChange={(e) => setColFilterOperator(field, e.target.value)}
          style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
        >
          {ops.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
        </select>
        {cond.operator === 'between' ? (
          (() => {
            const [minVal, maxVal] = cond.value.split(RANGE_SEPARATOR)
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  value={minVal ?? ''}
                  onChange={(e) => setColFilterValue(field, `${e.target.value}${RANGE_SEPARATOR}${maxVal ?? ''}`)}
                  placeholder="min"
                  style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', width: 0, flex: 1 }}
                />
                <span style={{ fontSize: 12, color: '#9ca3af' }}>and</span>
                <input
                  type="number"
                  value={maxVal ?? ''}
                  onChange={(e) => setColFilterValue(field, `${minVal ?? ''}${RANGE_SEPARATOR}${e.target.value}`)}
                  placeholder="max"
                  style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', width: 0, flex: 1 }}
                />
              </div>
            )
          })()
        ) : def.type === 'select' ? (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {def.options?.map((opt) => {
              const selected = cond.value === opt
              const dotColor = PRIORITY_TIER_COLORS[opt]
              return (
                <button
                  key={opt}
                  onClick={() => setColFilterValue(field, selected ? '' : opt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px', borderRadius: 99, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${selected ? '#5e6ad2' : '#e5e7eb'}`,
                    background: selected ? '#eef2ff' : '#fff',
                    color: selected ? '#4338ca' : '#6b7280',
                  }}
                >
                  {dotColor && <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />}
                  {opt}
                </button>
              )
            })}
          </div>
        ) : (
          <input
            type={def.type === 'number' ? 'number' : 'text'}
            value={cond.value}
            onChange={(e) => setColFilterValue(field, e.target.value)}
            placeholder={def.type === 'number' ? 'e.g. 5000' : 'value'}
            style={{ fontSize: 12, padding: '5px 7px', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        )}
        {cond.value.trim() && (
          <button
            onClick={() => clearColFilter(field)}
            style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        )}
      </div>
    )
  }

  type Facet = {
    key: string
    label: string
    icon: React.ReactNode
    show: boolean
    setShow: (v: boolean) => void
    content: React.ReactNode
    panelWidth: number
  }

  // Ordered to match the table's column order: Name, Priority, Ticket #, Replies, Reach, Channel, Time — then the
  // remaining filters that don't correspond to a column (Visibility, Status, Sentiment, Platform, Tags).
  const facets: Facet[] = [
    ...COLUMN_FILTER_FIELDS.map((field): Facet => {
      const cond = colFilters[field]
      const active = Boolean(cond?.value.trim())
      const displayValue = cond?.value.includes(RANGE_SEPARATOR) ? cond.value.split(RANGE_SEPARATOR).join(' - ') : cond?.value
      return {
        key: field,
        icon: <SlidersHorizontal size={13} />,
        label: `${FIELD_DEFS[field].label}${active ? `: ${displayValue}` : ''}`,
        show: Boolean(colFilterMenus[field]),
        setShow: (v: boolean) => setColFilterMenus((prev) => ({ ...prev, [field]: v })),
        content: colFilterContent(field),
        panelWidth: 180,
      }
    }),
    {
      key: 'channels', icon: <AtSign size={13} />,
      label: `Channels${filterChannels.size > 0 ? `: ${filterChannels.size}` : `: ${channels.length}`}`,
      show: showChannelsMenu, setShow: setShowChannelsMenu, content: channelsMenuContent, panelWidth: 220,
    },
    {
      key: 'timerange', icon: <Calendar size={13} />,
      label: timeRange === 'all' ? 'Timeframe' : `Timeframe: ${TIME_RANGE_LABELS[timeRange]}`,
      show: showTimeRangeMenu, setShow: setShowTimeRangeMenu, content: timeRangeContent, panelWidth: 200,
    },
    {
      key: 'visibility', icon: <Eye size={13} />, label: 'Visibility: All',
      show: false, setShow: () => {}, content: visibilityContent, panelWidth: 200,
    },
    {
      key: 'status', icon: <SlidersHorizontal size={13} />,
      label: `Status${filterStatuses.size > 0 ? `: ${filterStatuses.size}` : ''}`,
      show: showStatusMenu, setShow: setShowStatusMenu, content: statusContent, panelWidth: 200,
    },
    {
      key: 'sentiment', icon: <SlidersHorizontal size={13} />,
      label: `Sentiment${filterSentiments.size > 0 ? `: ${filterSentiments.size}` : ''}`,
      show: showSentimentMenu, setShow: setShowSentimentMenu, content: sentimentContent, panelWidth: 180,
    },
    {
      key: 'platform', icon: <SlidersHorizontal size={13} />,
      label: `Platform${filterPlatforms.size > 0 ? `: ${filterPlatforms.size}` : ''}`,
      show: showPlatformMenu, setShow: setShowPlatformMenu, content: platformContent, panelWidth: 200,
    },
    {
      key: 'tags', icon: <TagIcon size={13} />,
      label: `Tags${filterTags.size > 0 ? `: ${filterTags.size}` : ''}`,
      show: showTagsMenu, setShow: setShowTagsMenu, content: tagsContent, panelWidth: 240,
    },
  ]

  const visibleFacets = facets.slice(0, visibleFilterSlots)
  const overflowFacets = facets.slice(visibleFilterSlots)

  function renderFacetPill(f: Facet) {
    return (
      <div key={f.key} style={{ position: 'relative' }}>
        <button onClick={() => f.setShow(!f.show)} style={pillBtnStyle}>
          {f.icon} {f.label}
        </button>
        {f.show && (
          <>
            <div onClick={() => f.setShow(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
            <div
              style={{
                position: 'absolute', top: '110%', left: 0, zIndex: 10,
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: 10, width: f.panelWidth,
                maxHeight: 260, overflowY: 'auto',
              }}
            >
              {f.content}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
      }}
    >
      {/* Row 1: page title + more */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 6px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>
          {headerLabel}
        </h1>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            title="Download"
            style={{ display: 'flex', alignItems: 'center', padding: '5px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Row 2: one unified list of views — All, New, Assigned to me, Starred, custom views, + Add view. Draggable onto the
          sidebar (except All), and draggable left/right within this row to reorder. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 20px 14px', flexWrap: 'nowrap', overflowX: 'auto' }}>
        <button
          onClick={() => onFilterChange('all')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${allActive ? '#4b5563' : '#e5e7eb'}`,
            background: allActive ? '#4b5563' : '#fff',
            color: allActive ? '#fff' : '#374151',
            fontSize: 13, fontWeight: 500,
          }}
        >
          All
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
            background: allActive ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
            color: allActive ? '#fff' : '#6b7280',
          }}>
            {inboxFilterCounts.all > 999 ? '999+' : inboxFilterCounts.all}
          </span>
        </button>

        <div
          onDragOver={handleViewRowDragOver}
          onDragLeave={handleViewRowDragLeave}
          onDrop={handleViewRowDrop}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {rowItems.map((item, i) => (
            <div key={item.kind === 'filter' ? `f:${item.key}` : `v:${item.id}`} data-view-pill style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {viewDropIndex === i && <ViewDropIndicator />}
              {item.kind === 'filter' ? (
                (() => {
                  const meta = BASE_FILTER_META[item.key]
                  const f = item.key
                  if (!meta) return null
                  const { icon, label } = meta
                  const count = inboxFilterCounts[f]
                  return (
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ kind: 'filter', key: f }))
                        e.dataTransfer.effectAllowed = 'copyMove'
                      }}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0, cursor: 'grab' }}
                    >
                      <button
                        onClick={() => onFilterChange(f)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 26px 6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                          border: `1px solid ${filter === f ? '#4b5563' : '#e5e7eb'}`,
                          background: filter === f ? '#4b5563' : '#fff',
                          color: filter === f ? '#fff' : '#374151',
                          fontSize: 13, fontWeight: 500,
                        }}
                      >
                        {icon} {label}
                        {count > 0 && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
                            background: filter === f ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                            color: filter === f ? '#fff' : '#6b7280',
                          }}>
                            {count > 999 ? '999+' : count}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove "${label}" from this list? You can't add it back from here.`)) {
                            setHiddenInboxFilters((prev) => new Set(prev).add(f))
                            if (filter === f) onFilterChange('all')
                          }
                        }}
                        title="Remove view"
                        style={{
                          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 15, height: 15, border: 'none', borderRadius: '50%',
                          background: 'none', color: filter === f ? 'rgba(255,255,255,0.7)' : '#9ca3af', cursor: 'pointer',
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )
                })()
              ) : (
                (() => {
                  const view = customViews.find((v) => v.id === item.id)
                  if (!view) return null
                  const active = activeViewId === view.id
                  const showUpdate = active && hasUnsavedFilterChanges
                  const iconCount = (showUpdate ? 1 : 0) + 1
                  return (
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ kind: 'view', id: view.id }))
                        e.dataTransfer.effectAllowed = 'copyMove'
                      }}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0, cursor: 'grab' }}
                    >
                      <button
                        onClick={() => onViewChange(active ? null : view.id)}
                        style={{
                          padding: `6px ${12 + iconCount * 18}px 6px 12px`,
                          borderRadius: 8,
                          border: `1px solid ${active ? '#4b5563' : '#e5e7eb'}`,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: active ? '#4b5563' : '#fff',
                          color: active ? '#fff' : '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontFamily: 'inherit',
                        }}
                      >
                        <span>{view.icon}</span>{view.name}
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
                          background: active ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                          color: active ? '#fff' : '#6b7280',
                        }}>
                          {customViewCount(view) > 999 ? '999+' : customViewCount(view)}
                        </span>
                      </button>
                      <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {showUpdate && (
                          <button
                            onClick={() => updateFiltersOnView()}
                            title={`Update "${view.name}" with the current filters`}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: 16, height: 16, border: 'none', borderRadius: '50%',
                              background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
                            }}
                          >
                            <BookmarkPlus size={10} />
                          </button>
                        )}
                        <button
                          onClick={() => { if (window.confirm(`Remove the "${view.name}" view?`)) onDeleteView(view.id) }}
                          title="Remove view"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 15, height: 15, border: 'none', borderRadius: '50%',
                            background: 'none', color: active ? 'rgba(255,255,255,0.7)' : '#9ca3af', cursor: 'pointer',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })()
              )}
            </div>
          ))}
          {viewDropIndex === rowItems.length && <ViewDropIndicator />}
        </div>

        <button
          onClick={() => setShowCreateView(true)}
          title="Add a view"
          style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: 'none', background: 'none', color: '#9ca3af', fontSize: 12, fontWeight: 400,
          }}
        >
          <Plus size={12} /> Add view
        </button>
      </div>

      {/* Row 3: Channels / Visibility / Status / Sentiment / Platform / Tags (responsive — overflow collapses into "Filter") ... Group by / Columns */}
      <div ref={filterRowRef} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 12px', borderBottom: '1px solid #f3f4f6', flexWrap: 'nowrap', overflow: 'visible' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Search size={14} style={{ color: '#9ca3af', position: 'absolute', left: 9 }} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search…"
            style={{
              width: 170, fontSize: 12, padding: '6px 10px 6px 28px', borderRadius: 6,
              border: '1px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', color: '#111827',
            }}
          />
          {searchText && (
            <button onClick={() => setSearchText('')} style={{ position: 'absolute', right: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 2px' }} />

        {visibleFacets.map(renderFacetPill)}

        {overflowFacets.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowFilterMenu((v) => !v)} style={pillBtnStyle}>
              <SlidersHorizontal size={13} /> More Filters
            </button>
            {showFilterMenu && (
              <>
                <div onClick={() => setShowFilterMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                <div
                  style={{
                    position: 'absolute', top: '110%', left: 0, zIndex: 10,
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: 12, width: 240,
                    display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 460, overflowY: 'auto',
                  }}
                >
                  {overflowFacets.map((f, i) => (
                    <div key={f.key} style={i > 0 ? { borderTop: '1px solid #f3f4f6', paddingTop: 10 } : undefined}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
                        {f.key === 'channels' ? 'Channels' : f.key === 'visibility' ? 'Visibility' : f.key}
                      </p>
                      {f.content}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}


        <div style={{ flex: 1 }} />

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowGroupMenu((v) => !v)} style={pillBtnStyle}>
            <Rows3 size={13} /> Group by{groupBy ? `: ${GROUP_LABELS[groupBy]}` : ''}
          </button>
          {showGroupMenu && (
            <>
              <div onClick={() => setShowGroupMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
              <div
                style={{
                  position: 'absolute', top: '110%', right: 0, zIndex: 10,
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: 6, width: 160,
                }}
              >
                <button
                  onClick={() => { setGroupBy(null); setShowGroupMenu(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                    padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                    background: groupBy === null ? '#f3f4f6' : 'none',
                    color: groupBy === null ? '#111827' : '#374151', fontWeight: groupBy === null ? 600 : 400,
                  }}
                >
                  None
                </button>
                {(Object.keys(GROUP_LABELS) as GroupField[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGroupBy(g); setShowGroupMenu(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                      padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                      background: groupBy === g ? '#f3f4f6' : 'none',
                      color: groupBy === g ? '#111827' : '#374151', fontWeight: groupBy === g ? 600 : 400,
                    }}
                  >
                    {GROUP_LABELS[g]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>


      {/* Selection status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 20px',
          borderBottom: '1px solid #f3f4f6',
          background: selected.size > 0 ? '#f0fdf4' : '#fff',
        }}
      >
        <input
          type="checkbox"
          checked={selected.size > 0 && selected.size === filtered.length}
          onChange={toggleAll}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#22c55e' }}
        />
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {selected.size > 0 ? `${selected.size} selected` : 'None selected'}
        </span>

        <div style={{ flex: 1 }} />
        {toast && (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={13} /> {toast}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f3f4f6', borderRadius: 7, padding: 2 }}>
          <button
            onClick={() => setViewMode('cards')}
            title="Card view"
            style={{
              display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: viewMode === 'cards' ? '#fff' : 'none',
              boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              color: viewMode === 'cards' ? '#111827' : '#9ca3af',
            }}
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List view"
            style={{
              display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: viewMode === 'list' ? '#fff' : 'none',
              boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              color: viewMode === 'list' ? '#111827' : '#9ca3af',
            }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Column headers */}
      {!(viewMode === 'cards') && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb',
          gap: 12,
          userSelect: 'none',
        }}
      >
        {/* match checkbox + star + platform icons widths */}
        <div style={{ width: 15, flexShrink: 0 }} />
        <div style={{ width: 15, flexShrink: 0 }} />
        <div style={{ width: 39, flexShrink: 0 }} />

        {/* Name */}
        <ColHeader label="Name" col="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={colWidths.name} onResize={(w) => resizeCol('name', w)} />

        {/* Preview — not sortable, flex spacer */}
        <div style={{ flex: 1 }} />

        {/* Reorderable columns — drag a header left/right to change its position */}
        <div
          onDragOver={handleColHeaderDragOver}
          onDragLeave={handleColHeaderDragLeave}
          onDrop={handleColHeaderDrop}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          {visibleColOrder.map((key, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {colDropIndex === i && <ColDropIndicator />}
              {key === 'tags' ? (
                <PlainColHeader label="Tags" width={colWidths.tags} onResize={(w) => resizeCol('tags', w)} reorderKey="tags" />
              ) : (
                <ColHeader
                  label={REORDERABLE_COL_LABELS[key]} col={key} sortCol={sortCol} sortDir={sortDir} onSort={handleSort}
                  width={colWidths[key]} onResize={(w) => resizeCol(key, w)} reorderKey={key}
                />
              )}
            </div>
          ))}
          {colDropIndex === visibleColOrder.length && <ColDropIndicator />}
        </div>

        {/* Assignee spacer */}
        <div style={{ width: 28, flexShrink: 0 }} />

        {/* Column visibility toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowColumnMenu((v) => !v)}
            title="Choose columns"
            style={{ display: 'flex', alignItems: 'center', padding: '3px', borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}
          >
            <Columns3 size={14} />
          </button>
          {showColumnMenu && (
            <>
              <div
                onClick={() => setShowColumnMenu(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 9 }}
              />
              <div
                style={{
                  position: 'absolute', top: '110%', right: 0, zIndex: 10,
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)', padding: 8, width: 160,
                }}
              >
                {TOGGLEABLE_COLUMNS.map((col) => (
                  <label
                    key={col.key}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={visibleCols.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      style={{ cursor: 'pointer', accentColor: '#5e6ad2' }}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      )}

      {/* Ticket rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              color: '#9ca3af',
            }}
          >
            <span style={{ fontSize: 40 }}>😎</span>
            <p style={{ fontSize: 14, margin: 0 }}>You've reached the end of the list.</p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' && groupedSections ? (
              groupedSections.map((section) => {
                const isThread = groupBy === 'thread'
                const collapsed = collapsedGroups.has(section.key)
                const firstCustomer = customers.find((c) => c.id === section.items[0]?.customerId)
                return (
                  <div key={section.key}>
                    <button
                      onClick={() => toggleGroupCollapsed(section.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 20px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                        position: 'sticky', top: 0, zIndex: 1,
                      }}
                    >
                      <ChevronDown size={14} style={{ color: '#9ca3af', transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.1s', flexShrink: 0 }} />
                      {isThread && (
                        <img
                          src={firstCustomer?.avatar}
                          style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb', flexShrink: 0 }}
                        />
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'capitalize' }}>
                        {section.key}
                      </span>
                      <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, background: '#f3f4f6', padding: '1px 7px', borderRadius: 99 }}>
                        {section.items.length}
                      </span>
                    </button>
                    {!collapsed && (
                      <div style={{ position: 'relative' }}>
                        {isThread && section.items.length > 1 && (
                          <div style={{ position: 'absolute', left: 32, top: 24, bottom: 24, width: 2, background: '#e5e7eb' }} />
                        )}
                        {section.items.map((msg, i) => (
                          <CommentCard
                            key={msg.id}
                            msg={msg}
                            customer={customers.find((c) => c.id === msg.customerId)}
                            selected={selected.has(msg.id)}
                            onSelect={() => toggleSelect(msg.id)}
                            active={msg.id === messageId}
                            onClick={() => navigate(`/inbox/${msg.brandId}/${msg.id}`)}
                            threadBadge={isThread ? `#${i + 1}` : undefined}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : viewMode === 'cards' ? (
              filtered.map((msg) => (
                <CommentCard
                  key={msg.id}
                  msg={msg}
                  customer={customers.find((c) => c.id === msg.customerId)}
                  selected={selected.has(msg.id)}
                  onSelect={() => toggleSelect(msg.id)}
                  active={msg.id === messageId}
                  onClick={() => navigate(`/inbox/${msg.brandId}/${msg.id}`)}
                />
              ))
            ) : groupedSections ? (
              groupedSections.map((section) => (
                <div key={section.key}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 20px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6',
                      position: 'sticky', top: 0, zIndex: 1,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'capitalize' }}>
                      {section.key}
                    </span>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>{section.items.length}</span>
                  </div>
                  {section.items.map((msg) => (
                    <TicketRow
                      key={msg.id}
                      msg={msg}
                      selected={selected.has(msg.id)}
                      onSelect={() => toggleSelect(msg.id)}
                      active={msg.id === messageId}
                      onClick={() => navigate(`/inbox/${msg.brandId}/${msg.id}`)}
                      visibleCols={visibleCols}
                      colWidths={colWidths}
                      colOrder={colOrder}
                    />
                  ))}
                </div>
              ))
            ) : (
              filtered.map((msg) => (
                <TicketRow
                  key={msg.id}
                  msg={msg}
                  selected={selected.has(msg.id)}
                  onSelect={() => toggleSelect(msg.id)}
                  active={msg.id === messageId}
                  onClick={() => navigate(`/inbox/${msg.brandId}/${msg.id}`)}
                  visibleCols={visibleCols}
                  colWidths={colWidths}
                  colOrder={colOrder}
                />
              ))
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '32px 0',
                color: '#9ca3af',
              }}
            >
              <span style={{ fontSize: 20 }}>😎</span>
              <span style={{ fontSize: 14 }}>You've reached the end of the list.</span>
            </div>
          </>
        )}
      </div>

      {/* Floating bulk-action bar */}
      {selected.size > 0 && (
        <div
          style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', borderRadius: 14, padding: '8px 12px',
            boxShadow: '0 10px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb', zIndex: 20,
          }}
        >
          <button
            onClick={() => setSelected(new Set())}
            title="Clear selection"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: '#2563eb', color: '#fff',
            }}
          >
            <CheckCheck size={13} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
            {selected.size} selected
          </span>
          <div style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 2px' }} />
          <select
            value=""
            onChange={(e) => bulkAssign(e.target.value)}
            style={bulkBtnStyle}
          >
            <option value="">Assign to…</option>
            {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={bulkTag} style={bulkBtnStyle}>
            <TagIcon size={13} /> Tags
          </button>
          <button onClick={bulkStar} style={bulkBtnStyle}>
            <Star size={13} /> Star
          </button>
          <button onClick={bulkMute} style={bulkBtnStyle}>
            <BellOff size={13} /> Mute
          </button>
          <button onClick={bulkArchive} style={bulkBtnStyle}>
            <Archive size={13} /> Archive
          </button>
        </div>
      )}

      {showCreateView && (
        <CreateViewModal
          onClose={() => setShowCreateView(false)}
          onCreate={(name, icon) => {
            onAddView({
              id: `view-${Date.now()}`,
              name,
              icon,
              color: '#5e6ad2',
              ...currentFiltersAsPatch(),
            })
            setShowCreateView(false)
            setToast(`Saved view "${name}"`)
          }}
        />
      )}
    </div>
  )
}

function ColResizeHandle({ width, onResize }: { width: number; onResize: (newWidth: number) => void }) {
  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const startX = e.clientX
        const startWidth = width
        function onMove(ev: MouseEvent) {
          onResize(startWidth + (ev.clientX - startX))
        }
        function onUp() {
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
      }}
      style={{ position: 'absolute', right: -5, top: 0, bottom: 0, width: 10, cursor: 'col-resize' }}
      draggable={false}
    />
  )
}

function PlainColHeader({
  label, width, onResize, reorderKey,
}: {
  label: string; width: number; onResize: (newWidth: number) => void; reorderKey?: string
}) {
  return (
    <div
      data-col-header={reorderKey ? '' : undefined}
      draggable={Boolean(reorderKey)}
      onDragStart={reorderKey ? (e) => { e.dataTransfer.setData('text/plain', reorderKey); e.dataTransfer.effectAllowed = 'move' } : undefined}
      style={{ position: 'relative', width, flexShrink: 0, cursor: reorderKey ? 'grab' : 'default' }}
    >
      <span
        style={{
          fontSize: 11, fontWeight: 500, color: '#9ca3af', fontFamily: 'inherit',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}
      >
        {label}
      </span>
      <ColResizeHandle width={width} onResize={onResize} />
    </div>
  )
}

function ColHeader({
  label, col, sortCol, sortDir, onSort, width, onResize, reorderKey,
}: {
  label: string; col: SortCol; sortCol: SortCol; sortDir: SortDir
  onSort: (col: SortCol) => void; width: number; onResize: (newWidth: number) => void; reorderKey?: string
}) {
  const active = sortCol === col
  return (
    <div
      data-col-header={reorderKey ? '' : undefined}
      draggable={Boolean(reorderKey)}
      onDragStart={reorderKey ? (e) => { e.dataTransfer.setData('text/plain', reorderKey); e.dataTransfer.effectAllowed = 'move' } : undefined}
      style={{ position: 'relative', width, flexShrink: 0, cursor: reorderKey ? 'grab' : 'default' }}
    >
      <button
        onClick={() => onSort(col)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '2px 0',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: active ? 700 : 500,
          color: active ? '#111827' : '#9ca3af',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
        {active ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
      </button>
      <ColResizeHandle width={width} onResize={onResize} />
    </div>
  )
}

function TicketRow({
  msg,
  selected,
  onSelect,
  active,
  onClick,
  visibleCols,
  colWidths,
  colOrder,
}: {
  msg: Message
  selected: boolean
  onSelect: () => void
  active: boolean
  onClick: () => void
  visibleCols: Set<ColKey>
  colWidths: Record<ColWidthKey, number>
  colOrder: ReorderableCol[]
}) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const timeStr = format(new Date(msg.timestamp), 'MMM d')
  const score = getPriorityScore(msg, customer)
  const tier = priorityTier(score)
  const visibleColOrder = colOrder.filter((k) => visibleCols.has(k))

  function renderCell(key: ReorderableCol) {
    switch (key) {
      case 'tags':
        return (
          <div key="tags" style={{ width: colWidths.tags, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', overflow: 'hidden' }}>
            {msg.tags.map((tag) => (
              <span
                key={tag.label}
                style={{
                  padding: '2px 9px',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 500,
                  background: tag.color + '20',
                  color: tag.color,
                  flexShrink: 0,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )
      case 'priority':
        return (
          <div key="priority" style={{ width: colWidths.priority, flexShrink: 0 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 500,
                background: tier.color + '15',
                color: tier.color,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
              {tier.label}
            </span>
          </div>
        )
      case 'ticket':
        return (
          <div key="ticket" style={{ width: colWidths.ticket, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{msg.ticketNumber}</span>
          </div>
        )
      case 'replies':
        return (
          <div key="replies" style={{ width: colWidths.replies, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{msg.replyCount}</span>
            {msg.newReplies > 0 && (
              <span
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {msg.newReplies}
              </span>
            )}
          </div>
        )
      case 'reach':
        return (
          <div key="reach" style={{ width: colWidths.reach, flexShrink: 0, textAlign: 'right' }}>
            {customer?.totalReach ? (
              <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                <TrendingUp size={11} style={{ color: customer.totalReach >= 10000 ? '#f59e0b' : '#d1d5db' }} />
                {customer.totalReach >= 1_000_000
                  ? `${(customer.totalReach / 1_000_000).toFixed(1)}M`
                  : customer.totalReach >= 1_000
                  ? `${(customer.totalReach / 1_000).toFixed(1)}K`
                  : customer.totalReach}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: '#e5e7eb' }}>—</span>
            )}
          </div>
        )
      case 'channel':
        return (
          <div key="channel" style={{ width: colWidths.channel, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PlatformIcon platform={msg.platform} size={15} />
            <span
              style={{
                fontSize: 12,
                color: '#6b7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {msg.channel}
            </span>
          </div>
        )
      case 'time':
        return (
          <div key="time" style={{ width: colWidths.time, flexShrink: 0, textAlign: 'right' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: msg.unread ? 600 : 400 }}>
              {timeStr}
            </span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #f9fafb',
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        background: active ? '#eff6ff' : selected ? '#f0fdf4' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.1s',
        gap: 12,
        minHeight: 52,
      }}
      onMouseEnter={(e) => {
        if (!active && !selected) (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'
      }}
      onMouseLeave={(e) => {
        if (!active && !selected) (e.currentTarget as HTMLDivElement).style.background = '#fff'
      }}
    >
      {/* Checkbox */}
      <div onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#22c55e' }}
        />
      </div>

      {/* Star */}
      <div onClick={(e) => e.stopPropagation()}>
        <Star
          size={15}
          style={{
            color: msg.starred ? '#f59e0b' : '#d1d5db',
            fill: msg.starred ? '#f59e0b' : 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Platform icons (2 stacked) */}
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        <PlatformIcon platform={msg.platform} size={18} />
        {customer?.avatar ? (
          <img
            src={customer.avatar}
            style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e5e7eb' }} />
        )}
      </div>

      {/* User name */}
      <div style={{ width: colWidths.name, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: msg.unread ? 700 : 500,
            color: '#111827',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {customer?.name ?? 'Anonymous profile'}
        </span>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 13,
            color: msg.unread ? '#111827' : '#6b7280',
            fontWeight: msg.unread ? 500 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {msg.preview}
        </span>
      </div>

      {visibleColOrder.map((key) => renderCell(key))}

      {/* Assignee avatar */}
      <div style={{ width: 28, flexShrink: 0 }}>
        {msg.assignedTo ? (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#1d4ed8',
            }}
          >
            {msg.assignedTo[0]}
          </div>
        ) : (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#f3f4f6',
              border: '1px dashed #d1d5db',
            }}
          />
        )}
      </div>
    </div>
  )
}

const pillBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 99,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const bulkBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: '#fff',
  fontSize: 12,
  fontWeight: 500,
  color: '#374151',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
