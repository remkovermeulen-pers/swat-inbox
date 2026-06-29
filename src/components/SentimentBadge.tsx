import type { Sentiment } from '../data/mockData'

const config: Record<Sentiment, { label: string; emoji: string; bg: string; color: string }> = {
  positive: { label: 'Positive', emoji: '😊', bg: '#f0fdf4', color: '#16a34a' },
  neutral: { label: 'Neutral', emoji: '😐', bg: '#f8fafc', color: '#64748b' },
  negative: { label: 'Negative', emoji: '😞', bg: '#fef2f2', color: '#dc2626' },
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const { label, emoji, bg, color } = config[sentiment]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 6,
        padding: '3px 8px',
        fontSize: 11,
        fontWeight: 500,
        background: bg,
        color,
      }}
    >
      {emoji} {label}
    </span>
  )
}
