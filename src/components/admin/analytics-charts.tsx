'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const REPORTS_OVER_TIME = [
  { week: 'Wk 1', reports: 412 },
  { week: 'Wk 2', reports: 480 },
  { week: 'Wk 3', reports: 390 },
  { week: 'Wk 4', reports: 601 },
  { week: 'Wk 5', reports: 558 },
  { week: 'Wk 6', reports: 742 },
];

const CATEGORY_BREAKDOWN = [
  { category: 'Phishing', count: 18420 },
  { category: 'Rug pull', count: 9210 },
  { category: 'Fake giveaway', count: 7440 },
  { category: 'Impersonation', count: 6120 },
  { category: 'Malicious contract', count: 5280 },
  { category: 'Other', count: 14734 },
];

export function AnalyticsCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Reports submitted per week</CardTitle></CardHeader>
        <CardContent className="pt-0 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REPORTS_OVER_TIME}>
              <defs>
                <linearGradient id="reportsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="reports" stroke="hsl(var(--primary))" fill="url(#reportsGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Reports by scam category (all-time)</CardTitle></CardHeader>
        <CardContent className="pt-0 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CATEGORY_BREAKDOWN} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--trust))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
