export default function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
    >
      {/* Image */}
      <div className="shimmer" style={{ paddingTop: '75%' }} />
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 rounded" style={{ width: '80%' }} />
        <div className="shimmer h-3 rounded" style={{ width: '55%' }} />
        <div className="shimmer h-5 rounded" style={{ width: '45%' }} />
        <div className="shimmer h-3 rounded" style={{ width: '35%' }} />
      </div>
    </div>
  )
}
