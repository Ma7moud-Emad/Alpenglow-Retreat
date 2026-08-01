import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../../ui/Card";
import useTheme from "../../hooks/useTheme";
import { chartTheme } from "./chartTheme";
import { pluralise } from "../../lib/format";
import EmptyState from "../../ui/EmptyState";

/**
 * Stay length distribution.
 *
 * The old version bucketed with overlapping predicates: `numNights < 0 &&
 * numNights < 4` for the "1:3" slice, which is never true, while "4:6" and
 * "7:9" both matched anything under their upper bound. Bucketing now happens in
 * SQL over half-open ranges, so each stay lands in exactly one slice.
 */
export default function StayDurationChart({ data }) {
  const { isDark } = useTheme();
  const theme = chartTheme(isDark);

  const slices = data
    .map((row, index) => ({
      name: row.bucket,
      value: Number(row.stays),
      color: theme.duration[index % theme.duration.length],
    }))
    .filter((slice) => slice.value > 0);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Stay duration</CardTitle>
          <CardDescription>
            {total ? pluralise(total, "stay") : "No stays"} starting in this period
          </CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {slices.length === 0 ? (
          <EmptyState
            title="No stays in this period"
            description="Once guests arrive, their stay lengths are grouped here."
          />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={104}
                paddingAngle={2}
                stroke="none"
              >
                {slices.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} (${Math.round((value / total) * 100)}%)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: theme.tooltipBackground,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 13,
                }}
                itemStyle={{ color: theme.text }}
              />
              <Legend
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 13, color: theme.axis }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
