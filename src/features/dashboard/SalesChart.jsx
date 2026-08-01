import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../../ui/Card";
import useTheme from "../../hooks/useTheme";
import { chartTheme } from "./chartTheme";
import { formatCompact, formatCurrency, formatShortDate } from "../../lib/format";
import EmptyState from "../../ui/EmptyState";

export default function SalesChart({ data, from, to }) {
  const { isDark } = useTheme();
  const theme = chartTheme(isDark);

  // The series arrives gap-filled from Postgres, so a flat run of zeroes is a
  // real answer, but an entirely empty window is worth calling out.
  const hasSales = data.some((point) => Number(point.total_sales) > 0);

  const series = data.map((point) => ({
    day: point.day,
    total: Number(point.total_sales),
    extras: Number(point.extras_sales),
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
            {formatShortDate(from)} – {formatShortDate(to)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {!hasSales ? (
          <EmptyState
            title="No sales in this period"
            description="Bookings created in the selected window will appear here."
          />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.total.fill} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={theme.total.fill} stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="fillExtras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.extras.fill} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={theme.extras.fill} stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke={theme.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={formatShortDate}
                tick={{ fill: theme.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: theme.grid }}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={formatCompact}
                tick={{ fill: theme.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                cursor={{ stroke: theme.axis, strokeDasharray: "3 3" }}
                labelFormatter={formatShortDate}
                formatter={(value, name) => [formatCurrency(value), name]}
                contentStyle={{
                  backgroundColor: theme.tooltipBackground,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 13,
                }}
                itemStyle={{ color: theme.text }}
                labelStyle={{ color: theme.axis, marginBottom: 4 }}
              />
              <Legend
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 13, color: theme.axis, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total sales"
                stroke={theme.total.stroke}
                strokeWidth={2}
                fill="url(#fillTotal)"
              />
              <Area
                type="monotone"
                dataKey="extras"
                name="Extras"
                stroke={theme.extras.stroke}
                strokeWidth={2}
                fill="url(#fillExtras)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
