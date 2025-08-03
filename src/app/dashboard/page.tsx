'use client'

import { FC } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Static demo data; replace with live metrics from secure APIs in production
const SAMPLE_DATA = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 28 },
  { name: 'Apr', value: 60 },
]

const DashboardPage: FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4 text-emerald-400">Analytics Dashboard</h1>
    {/* Responsive container keeps chart adaptive across viewports */}
    <div className="h-64 bg-slate-900/50 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={SAMPLE_DATA}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#4ade80" />
          <YAxis stroke="#4ade80" />
          <Tooltip />
          {/* Green line matches project's emerald theme */}
          <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

export default DashboardPage

