import Link from 'next/link'

export default function EmptyState({ title = 'لا توجد نتائج', subtitle = 'لم يتم العثور على أي عناصر', actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <span className="text-3xl">📦</span>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#0F1111' }}>{title}</h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#565959' }}>{subtitle}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}
          className="px-6 py-2.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#FF9900' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
