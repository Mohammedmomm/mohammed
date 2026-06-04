export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div className="shimmer" style={{ paddingTop: '75%' }} />
      <div className="p-3 space-y-2">
        <div className="shimmer h-3 rounded" style={{ width: '80%' }} />
        <div className="shimmer h-3 rounded" style={{ width: '55%' }} />
        <div className="shimmer h-4 rounded" style={{ width: '40%' }} />
      </div>
    </div>
  )
}
