import type { MessageStatus } from '../data/mockData'

const config: Record<MessageStatus, { label: string; className: string; dot: string }> = {
  unanswered: {
    label: 'Not answered',
    className: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  answered: {
    label: 'Answered',
    className: 'bg-green-50 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  ai_pending: {
    label: 'AI draft pending',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
}

interface Props {
  status: MessageStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const { label, className, dot } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${className} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  )
}
