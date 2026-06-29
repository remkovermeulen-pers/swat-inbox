import type { Sentiment } from '../data/mockData'

const config: Record<Sentiment, { label: string; emoji: string; className: string }> = {
  positive: { label: 'Positive', emoji: '😊', className: 'bg-green-50 text-green-700' },
  neutral: { label: 'Neutral', emoji: '😐', className: 'bg-gray-50 text-gray-600' },
  negative: { label: 'Negative', emoji: '😞', className: 'bg-red-50 text-red-700' },
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const { label, emoji, className } = config[sentiment]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {emoji} {label}
    </span>
  )
}
