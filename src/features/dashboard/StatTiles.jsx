import styled from "styled-components";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency, formatPercent } from "../../lib/format";
import Skeleton from "../../ui/Skeleton";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const Tile = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const IconCircle = styled.div`
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const Text = styled.div`
  min-width: 0;
`;

const Label = styled.p`
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
`;

const Value = styled.p`
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-top: 0.2rem;
`;

const Hint = styled.p`
  font-size: var(--text-xs);
  color: var(--text-muted);
`;

export default function StatTiles({ stats, isPending }) {
  const tiles = [
    {
      label: "Bookings",
      value: stats?.bookings ?? 0,
      hint: "Created in this period",
      icon: <HiOutlineBriefcase />,
      bg: "var(--info-soft)",
      color: "var(--info-text)",
    },
    {
      label: "Sales",
      value: formatCurrency(stats?.total_sales),
      hint: `${formatCurrency(stats?.extras_sales)} from extras`,
      icon: <HiOutlineBanknotes />,
      bg: "var(--success-soft)",
      color: "var(--success-text)",
    },
    {
      label: "Check-ins",
      value: stats?.check_ins ?? 0,
      hint: "Stays that started in this period",
      icon: <HiOutlineCalendarDays />,
      bg: "var(--accent-soft)",
      color: "var(--accent-soft-text)",
    },
    {
      label: "Occupancy",
      value: formatPercent(stats?.occupancy_rate),
      hint: "Cabin-nights booked vs available",
      icon: <HiOutlineChartBar />,
      bg: "var(--warning-soft)",
      color: "var(--warning-text)",
    },
  ];

  return (
    <Grid>
      {tiles.map((tile) => (
        <Tile key={tile.label}>
          <IconCircle $bg={tile.bg} $color={tile.color} aria-hidden="true">
            {tile.icon}
          </IconCircle>
          <Text>
            <Label>{tile.label}</Label>
            {isPending ? (
              <Skeleton $width="8rem" $height="2.6rem" />
            ) : (
              <Value>{tile.value}</Value>
            )}
            <Hint>{tile.hint}</Hint>
          </Text>
        </Tile>
      ))}
    </Grid>
  );
}
