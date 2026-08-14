import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { messages, customers, brands, channels } from '../data/mockData'
import type { Message, InboxFilter, Tag, Sentiment, Platform, MessageStatus } from '../data/mockData'
import { PlatformIcon } from './PlatformIcon'
import { CreateViewModal } from './CreateViewModal'
import { AGENTS, KNOWN_TAGS, getPriorityScore, messageMatchesView, priorityTier, type CustomView, type FilterCondition, type SortCol, type SortDir } from '../lib/inboxScale'
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
  Plus,
  Sparkles,
  UserCheck,
  Users,
  AtSign,
  Eye,
  Rows3,
} from 'lucide-react'

const PLATFORMS: Platform[] = ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube']
const SENTIMENTS: Sentiment[] = ['negative', 'neutral', 'positive']

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
  mode?: 'inbox' | 'comments'
}

const STATUS_LABELS: Record<MessageStatus, string> = {
  unanswered: 'Unanswered',
  ai_pending: 'AI pending',
  answered: 'Answered',
}

type GroupField = 'platform' | 'status' | 'sentiment' | 'channel'

const GROUP_LABELS: Record<GroupField, string> = {
  platform: 'Platform', status: 'Status', sentiment: 'Sentiment', channel: 'Channel',
}

type ColKey = 'priority' | 'ticket' | 'replies' | 'reach' | 'channel' | 'time'

const TOGGLEABLE_COLUMNS: { key: ColKey; label: string; width: number }[] = [
  { key: 'priority', label: 'Priority', width: 72 },
  { key: 'ticket', label: 'Ticket #', width: 80 },
  { key: 'replies', label: 'Replies', width: 60 },
  { key: 'reach', label: 'Reach', width: 70 },
  { key: 'channel', label: 'Channel', width: 130 },
  { key: 'time', label: 'Time', width: 56 },
]

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
  all: messages.length,
  new: messages.filter((m) => m.unread).length,
  starred: messages.filter((m) => m.starred).length,
  assigned_me: messages.filter((m) => m.assignedTo === 'Remko').length,
  assigned_others: messages.filter((m) => m.assignedTo && m.assignedTo !== 'Remko').length,
  archive: 999,
}

export function TicketList({ brandId, channelId, filter, onFilterChange, customViews, activeViewId, onAddView, onViewChange, onDeleteView, onUpdateView, mode = 'inbox' }: Props) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterStatuses, setFilterStatuses] = useState<Set<MessageStatus>>(new Set())
  const [sortCol, setSortCol] = useState<SortCol>('time')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [overrides, setOverrides] = useState<Record<string, Partial<Message>>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(() => loadVisibleCols())
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set())
  const [filterSentiments, setFilterSentiments] = useState<Set<Sentiment>>(new Set())
  const [filterPlatforms, setFilterPlatforms] = useState<Set<Platform>>(new Set())
  const [filterChannels, setFilterChannels] = useState<Set<string>>(new Set())
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showCreateView, setShowCreateView] = useState(false)
  const [showChannelsMenu, setShowChannelsMenu] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showSentimentMenu, setShowSentimentMenu] = useState(false)
  const [showPlatformMenu, setShowPlatformMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [visibleFilterSlots, setVisibleFilterSlots] = useState(6)
  const [hiddenInboxFilters, setHiddenInboxFilters] = useState<Set<InboxFilter>>(() => loadHiddenFilters())
  const filterRowRef = useRef<HTMLDivElement>(null)
  const [groupBy, setGroupBy] = useState<GroupField | null>(null)
  const [showGroupMenu, setShowGroupMenu] = useState(false)

  function toggleSetValue<T>(setFn: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) {
    setFn((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  const activeFilterCount = filterTags.size + filterSentiments.size + filterPlatforms.size + filterChannels.size + filterStatuses.size

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
      if (w < 250) setVisibleFilterSlots(0)
      else if (w < 450) setVisibleFilterSlots(1)
      else if (w < 600) setVisibleFilterSlots(2)
      else if (w < 750) setVisibleFilterSlots(3)
      else if (w < 850) setVisibleFilterSlots(4)
      else if (w < 950) setVisibleFilterSlots(5)
      else setVisibleFilterSlots(6)
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

  const activeView = customViews.find((v) => v.id === activeViewId) ?? null

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
      return true
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

  function bulkMarkAnswered() {
    const count = selected.size
    applyToSelected({ status: 'answered' })
    setToast(`Marked ${count} ticket${count > 1 ? 's' : ''} as answered`)
    setSelected(new Set())
  }

  function bulkArchive() {
    const count = selected.size
    applyToSelected({ archived: true })
    setToast(`Archived ${count} ticket${count > 1 ? 's' : ''}`)
    setSelected(new Set())
  }

  function currentFiltersAsPatch(): Partial<CustomView> {
    const statuses = filterStatuses.size > 0 ? Array.from(filterStatuses) : undefined
    const conditions: FilterCondition[] = []
    if (filterTags.size > 0) conditions.push({ field: 'tag', operator: 'is', value: Array.from(filterTags) })
    if (filterSentiments.size > 0) conditions.push({ field: 'sentiment', operator: 'is', value: Array.from(filterSentiments) })
    if (filterPlatforms.size > 0) conditions.push({ field: 'platform', operator: 'is', value: Array.from(filterPlatforms) })
    return {
      statuses,
      conditions: conditions.length ? conditions : activeView?.conditions,
      sortCol,
      sortDir,
    }
  }

  function saveFiltersAsView() {
    const name = window.prompt('Name this view:', activeView ? `${activeView.name} (customized)` : '')
    if (!name?.trim()) return
    onAddView({
      id: `view-${Date.now()}`,
      name: name.trim(),
      icon: activeView?.icon ?? '📌',
      color: activeView?.color ?? '#5e6ad2',
      ...currentFiltersAsPatch(),
    })
    setShowFilterMenu(false)
    setToast(`Saved view "${name.trim()}"`)
  }

  function updateFiltersOnView() {
    if (!activeView) return
    onUpdateView(activeView.id, currentFiltersAsPatch())
    setShowFilterMenu(false)
    setToast(`Updated view "${activeView.name}"`)
  }

  const hasUnsavedFilterChanges = Boolean(
    activeView && (filterTags.size > 0 || filterSentiments.size > 0 || filterPlatforms.size > 0 || filterStatuses.size > 0)
  )

  const headerLabel = activeView
    ? `${activeView.icon} ${activeView.name}`
    : brandId
    ? brands.find((b) => b.id === brandId)?.name ?? 'Inbox'
    : channel
    ? channel.name
    : mode === 'comments'
    ? 'Comments'
    : 'Inbox'

  const filterFacetCount = filterTags.size + filterSentiments.size + filterPlatforms.size + filterStatuses.size

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

  const filterActionsContent = (
    <>
      {filterFacetCount > 0 && (
        <button
          onClick={() => { setFilterTags(new Set()); setFilterSentiments(new Set()); setFilterPlatforms(new Set()); setFilterStatuses(new Set()) }}
          style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'inherit' }}
        >
          Clear all filters
        </button>
      )}
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {hasUnsavedFilterChanges && activeView && (
          <button
            onClick={updateFiltersOnView}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '7px 10px', borderRadius: 7, border: 'none', background: '#4338ca',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <BookmarkPlus size={13} /> Update "{activeView.name}"
          </button>
        )}
        <button
          onClick={saveFiltersAsView}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px 10px', borderRadius: 7, border: '1px solid #5e6ad2', background: '#eef2ff',
            color: '#4338ca', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <BookmarkPlus size={13} /> Save filters as new view
        </button>
      </div>
    </>
  )

  type Facet = {
    key: string
    label: string
    icon: React.ReactNode
    show: boolean
    setShow: (v: boolean) => void
    content: React.ReactNode
    panelWidth: number
  }

  const facets: Facet[] = [
    {
      key: 'channels', icon: <AtSign size={13} />,
      label: `Channels${filterChannels.size > 0 ? `: ${filterChannels.size}` : `: ${channels.length}`}`,
      show: showChannelsMenu, setShow: setShowChannelsMenu, content: channelsMenuContent, panelWidth: 220,
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
      }}
    >
      {/* Row 1: page title + search + more */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 6px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>
          {headerLabel}
        </h1>

        {activeView && (
          <span style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 99, padding: '3px 10px' }}>
            Smart view · across all brands &amp; channels, sorted by priority
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          <button
            title="Download"
            style={{ display: 'flex', alignItems: 'center', padding: '5px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Row 2: All / New / Starred / Assigned to me / Assigned to others / Archive */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 20px 14px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onFilterChange('all')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${filter === 'all' ? '#111827' : '#e5e7eb'}`,
            background: filter === 'all' ? '#111827' : '#fff',
            color: filter === 'all' ? '#fff' : '#374151',
            fontSize: 13, fontWeight: 500,
          }}
        >
          All
        </button>

        {(
          [
            { f: 'new' as InboxFilter, icon: <Sparkles size={13} />, label: 'New', count: inboxFilterCounts.new },
            { f: 'starred' as InboxFilter, icon: <Star size={13} />, label: 'Starred', count: inboxFilterCounts.starred },
            { f: 'assigned_me' as InboxFilter, icon: <UserCheck size={13} />, label: 'Assigned to me', count: 0 },
            { f: 'assigned_others' as InboxFilter, icon: <Users size={13} />, label: 'Assigned to others', count: inboxFilterCounts.assigned_others },
            { f: 'archive' as InboxFilter, icon: <Archive size={13} />, label: 'Archive', count: inboxFilterCounts.archive },
          ] as const
        ).filter(({ f }) => !hiddenInboxFilters.has(f)).map(({ f, icon, label, count }) => (
          <div key={f} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => onFilterChange(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 26px 6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filter === f ? '#111827' : '#e5e7eb'}`,
                background: filter === f ? '#111827' : '#fff',
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
        ))}

        {customViews.length > 0 && (
          <div style={{ width: 1, height: 16, background: '#e5e7eb', margin: '0 2px' }} />
        )}

        {customViews.map((view) => {
          const active = activeViewId === view.id
          return (
            <div key={view.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => onViewChange(active ? null : view.id)}
                style={{
                  padding: '6px 22px 6px 10px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: active ? '#4338ca' : '#f3f4f6',
                  color: active ? '#fff' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                }}
              >
                <span>{view.icon}</span>{view.name}
              </button>
              <button
                onClick={() => { if (window.confirm(`Remove the "${view.name}" view?`)) onDeleteView(view.id) }}
                title="Remove view"
                style={{
                  position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 15, height: 15, border: 'none', borderRadius: '50%',
                  background: 'none', color: active ? 'rgba(255,255,255,0.7)' : '#9ca3af', cursor: 'pointer',
                }}
              >
                <X size={10} />
              </button>
            </div>
          )
        })}

        <button
          onClick={() => setShowCreateView(true)}
          title="Create a new smart view"
          style={{
            width: 28, height: 28, borderRadius: '50%', border: '1px dashed #d1d5db',
            background: 'none', color: '#9ca3af', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Row 3: Channels / Visibility / Status / Sentiment / Platform / Tags (responsive — overflow collapses into "Filter") ... Group by / Columns */}
      <div ref={filterRowRef} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 12px', borderBottom: '1px solid #f3f4f6' }}>
        {visibleFacets.map(renderFacetPill)}

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowFilterMenu((v) => !v)} style={pillBtnStyle}>
            <SlidersHorizontal size={13} /> Filter
            {filterFacetCount > 0 && (
              <span style={{ background: '#5e6ad2', color: '#fff', borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>
                {filterFacetCount}
              </span>
            )}
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
                {overflowFacets.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>All filters fit in the row above.</p>
                ) : (
                  overflowFacets.map((f, i) => (
                    <div key={f.key} style={i > 0 ? { borderTop: '1px solid #f3f4f6', paddingTop: 10 } : undefined}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
                        {f.key === 'channels' ? 'Channels' : f.key === 'visibility' ? 'Visibility' : f.key}
                      </p>
                      {f.content}
                    </div>
                  ))
                )}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
                  {filterActionsContent}
                </div>
              </div>
            </>
          )}
        </div>

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

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowColumnMenu((v) => !v)} style={pillBtnStyle}>
            <Columns3 size={13} /> Columns
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


      {/* Bulk selection bar */}
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

        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select
              value=""
              onChange={(e) => bulkAssign(e.target.value)}
              style={bulkBtnStyle}
            >
              <option value="">Assign to…</option>
              {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <button onClick={bulkTag} style={bulkBtnStyle}>
              <TagIcon size={13} /> Tag
            </button>
            <button onClick={bulkMarkAnswered} style={bulkBtnStyle}>
              <CheckCheck size={13} /> Mark answered
            </button>
            <button onClick={bulkArchive} style={bulkBtnStyle}>
              <Archive size={13} /> Archive
            </button>
          </div>
        )}

        <div style={{ flex: 1 }} />
        {toast && (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={13} /> {toast}
          </span>
        )}
      </div>

      {/* Column headers */}
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
        <ColHeader label="Name" col="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={140} />

        {/* Preview — not sortable, flex spacer */}
        <div style={{ flex: 1 }} />

        {/* Priority */}
        {visibleCols.has('priority') && <ColHeader label="Priority" col="priority" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={72} />}
        {/* Ticket # */}
        {visibleCols.has('ticket') && <ColHeader label="Ticket #" col="ticket" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={80} />}
        {/* Replies */}
        {visibleCols.has('replies') && <ColHeader label="Replies" col="replies" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={60} />}
        {/* Reach */}
        {visibleCols.has('reach') && <ColHeader label="Reach" col="reach" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={70} />}
        {/* Channel */}
        {visibleCols.has('channel') && <ColHeader label="Channel" col="channel" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={130} />}
        {/* Assignee spacer */}
        <div style={{ width: 28, flexShrink: 0 }} />
        {/* Time */}
        {visibleCols.has('time') && <ColHeader label="Time" col="time" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} width={56} />}
      </div>

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
            {groupedSections ? (
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
                      onClick={() => navigate(mode === 'comments' ? `/comments/${msg.id}` : `/inbox/${msg.brandId}/${msg.id}`)}
                      visibleCols={visibleCols}
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
                  onClick={() => navigate(mode === 'comments' ? `/comments/${msg.id}` : `/inbox/${msg.brandId}/${msg.id}`)}
                  visibleCols={visibleCols}
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

      {showCreateView && (
        <CreateViewModal
          onClose={() => setShowCreateView(false)}
          onCreate={(view) => { onAddView(view); setShowCreateView(false) }}
        />
      )}
    </div>
  )
}

function ColHeader({
  label, col, sortCol, sortDir, onSort, width,
}: {
  label: string; col: SortCol; sortCol: SortCol; sortDir: SortDir
  onSort: (col: SortCol) => void; width: number
}) {
  const active = sortCol === col
  return (
    <button
      onClick={() => onSort(col)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width,
        flexShrink: 0,
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
  )
}

function TicketRow({
  msg,
  selected,
  onSelect,
  active,
  onClick,
  visibleCols,
}: {
  msg: Message
  selected: boolean
  onSelect: () => void
  active: boolean
  onClick: () => void
  visibleCols: Set<ColKey>
}) {
  const customer = customers.find((c) => c.id === msg.customerId)
  const timeStr = format(new Date(msg.timestamp), 'MMM d')
  const score = getPriorityScore(msg, customer)
  const tier = priorityTier(score)

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
      <div style={{ width: 140, flexShrink: 0 }}>
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

      {/* Preview + tags */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 13,
            color: msg.unread ? '#111827' : '#6b7280',
            fontWeight: msg.unread ? 500 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {msg.preview}
        </span>
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

      {/* Priority */}
      {visibleCols.has('priority') && (
        <div style={{ width: 72, flexShrink: 0 }}>
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
      )}

      {/* Ticket # */}
      {visibleCols.has('ticket') && (
        <div style={{ width: 80, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{msg.ticketNumber}</span>
        </div>
      )}

      {/* Reply count */}
      {visibleCols.has('replies') && (
        <div style={{ width: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
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
      )}

      {/* Reach */}
      {visibleCols.has('reach') && (
        <div style={{ width: 70, flexShrink: 0, textAlign: 'right' }}>
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
      )}

      {/* Channel */}
      {visibleCols.has('channel') && (
        <div style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
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
      )}

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

      {/* Time */}
      {visibleCols.has('time') && (
        <div style={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: msg.unread ? 600 : 400 }}>
            {timeStr}
          </span>
        </div>
      )}
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
