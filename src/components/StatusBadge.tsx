import type { MessageStatus } from '../data/mockData'

const config: Record<MessageStatus, { label: string; bg: string; text: string; dot: string }> = {
  unanswered: {
    label: 'Not answered',
    bg: '#fef2f2',
    text: '#dc2626',
    dot: '#dc2626',
  },
  answered: {
    label: 'Answered',
    bg: '#f0fdf4',
    text: '#16a34a',
    dot: '#16a34a',
  },
  ai_pending: {
    label: 'AI draft pending',
    bg: '#fffbeb',
    text: '#d97706',
    dot: '#d97706',
  },
}

interface Props {
  status: MessageStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const { label, bg, text, dot } = config[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: bg,
        color: text,
        borderRadius: 99,
        fontWeight: 500,
        fontSize: size === 'sm' ? 11 : 12,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dot,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  )
}
