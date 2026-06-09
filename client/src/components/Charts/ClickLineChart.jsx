import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ClickLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d7dde5" />
        <XAxis dataKey="date" stroke="#667085" />
        <YAxis allowDecimals={false} stroke="#667085" />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
