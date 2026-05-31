import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'

const BarChartComp = ({ data = [], bars = [], xKey = 'name', horizontal = false, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart
      data={data}
      layout={horizontal ? 'vertical' : 'horizontal'}
      margin={{ top: 5, right: 20, left: horizontal ? 80 : 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      {horizontal ? (
        <>
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
        </>
      ) : (
        <>
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        </>
      )}
      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {bars.map((bar) => (
        <Bar key={bar.key} dataKey={bar.key} name={bar.name || bar.key} fill={bar.color || '#1E6FBF'} radius={[4, 4, 0, 0]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
)

export default BarChartComp
