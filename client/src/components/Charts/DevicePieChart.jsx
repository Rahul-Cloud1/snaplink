import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors = ['#0f766e', '#2563eb', '#f59e0b', '#7c3aed'];

export default function DevicePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="clicks" nameKey="device" outerRadius={96} label>
          {data.map((entry, index) => (
            <Cell key={entry.device} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
