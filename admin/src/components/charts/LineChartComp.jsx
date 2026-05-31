import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const LineChartComp = ({ data = [], lines = [], xKey = 'name', height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
        labelStyle={{ fontWeight: 600, color: '#1e293b' }}
      />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {lines.map((line) => (
        <Line
          key={line.key}
          type="monotone"
          dataKey={line.key}
          name={line.name || line.key}
          stroke={line.color || '#1E6FBF'}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

export default LineChartComp
