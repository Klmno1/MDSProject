'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface FeatureImportanceProps {
  importances: Record<string, number>;
}

export default function FeatureImportanceChart({ importances }: FeatureImportanceProps) {
  // Convert dictionary to sorted array
  const data = Object.entries(importances)
    .map(([key, value]) => ({ feature: key, importance: Number(value.toFixed(2)) }))
    .slice(0, 20); // show top 10

//   const COLORS = [
//     '#d946ef',
//     '#c084fc',
//     '#a78bfa',
//     '#818cf8',
//     '#60a5fa',
//     '#38bdf8',
//     '#22d3ee',
//     '#2dd4bf',
//     '#4ade80',
//     '#a3e635',
//   ];

  return (
    <Card className="w-full bg-gray-900 text-white border-gray-800 mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Top 15 Feature Importances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <XAxis type="number" domain={[0, 'dataMax']} tick={{ fill: '#ccc' }} />
              <YAxis type="category" dataKey="feature" tick={{ fill: '#ccc' }} width={200} />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#4b5563', 
                    color: '#fff',
                    fontSize: '18px'  // increase font size here
                }}
                labelStyle={{ 
                    color: '#a1a1aa',
                    fontSize: '18px'  // increase label font size as well
                }}
                formatter={(value: number) => `${value.toFixed(2)}`}
                />
              <Bar dataKey="importance" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}