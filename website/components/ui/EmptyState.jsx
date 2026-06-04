import Link from 'next/link'

export default function EmptyState({
  title = 'لا توجد نتائج',
  subtitle = 'لم يتم العثور على أي عناصر',
  actionLabel,
  actionHref,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 opacity-40"
      >
        <circle cx="40" cy="40" r="38" stroke="#162440" strokeWidth="4" />
        <path
          d="M28 32h4v16h-4zM48 32h4v16h-4zM36 52h8"
          stroke="#00D4FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="30" cy="28" r="3" fill="#94A3B8" />
        <circle cx="50" cy="28" r="3" fill="#94A3B8" />
      </svg>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#F8F9FA' }}>
        {title}
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#94A3B8' }}>
        {subtitle}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
