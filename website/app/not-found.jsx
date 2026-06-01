import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: '#0A1628' }}
    >
      <div className="mb-6">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          <circle cx="60" cy="60" r="56" stroke="#162440" strokeWidth="6" />
          <text x="60" y="75" textAnchor="middle" fontSize="42" fontWeight="bold" fill="#00D4FF">
            404
          </text>
        </svg>
      </div>
      <h1 className="text-3xl font-black mb-3" style={{ color: '#F8F9FA' }}>
        الصفحة غير موجودة
      </h1>
      <p className="mb-2 text-sm" style={{ color: '#94A3B8' }}>
        Page Not Found
      </p>
      <p className="mb-8 max-w-xs" style={{ color: '#94A3B8' }}>
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-xl font-bold text-base transition-opacity hover:opacity-80"
        style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}
