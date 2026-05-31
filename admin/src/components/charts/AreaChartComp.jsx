import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const AreaChartComp = ({ data = [], areas = [], xKey = 'name', height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <defs>
        {areas.map((area) => (
          <linearGradient key={area.key} id={`gradient-${area.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={area.color || '#1E6FBF'} stopOpacity={0.15} />
            <stop offset="95%" stopColor={area.color || '#1E6FBF'} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {areas.map((area) => (
        <Area
          key={area.key}
          type="monotone"
          dataKey={area.key}
          name={area.name || area.key}
          stroke={area.color || '#1E6FBF'}
          strokeWidth={2}
          fill={`url(#gradient-${area.key})`}
          dot={false}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
)

export default AreaChartComp
