const PageHeader = ({ title, subtitle, actions = [] }) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                action.variant === 'secondary'
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  : action.variant === 'danger'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'text-white hover:opacity-90'
              }`}
              style={
                !action.variant || action.variant === 'primary'
                  ? { backgroundColor: '#1E6FBF' }
                  : {}
              }
            >
              {action.icon && <action.icon size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PageHeader
