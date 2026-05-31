import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DonutChartComp = ({ data = [], height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius="55%"
        outerRadius="80%"
        paddingAngle={3}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color || '#1E6FBF'} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
        formatter={(val, name) => [val.toLocaleString(), name]}
      />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
      />
    </PieChart>
  </ResponsiveContainer>
)

export default DonutChartComp
