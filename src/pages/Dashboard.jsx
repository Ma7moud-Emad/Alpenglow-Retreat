import styled from "styled-components";
import PageHeader from "../ui/PageHeader";
import SegmentedControl from "../ui/SegmentedControl";
import ErrorState from "../ui/ErrorState";
import useUrlState from "../hooks/useUrlState";
import { useDashboard, useTodayActivity } from "../hooks/useDashboard";
import { DASHBOARD_RANGES, rangeToDates } from "../services/dashboard";
import StatTiles from "../features/dashboard/StatTiles";
import SalesChart from "../features/dashboard/SalesChart";
import StayDurationChart from "../features/dashboard/StayDurationChart";
import TodayActivity from "../features/dashboard/TodayActivity";

const Grid = styled.div`
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;

  @media (min-width: 1100px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const FullWidth = styled.div`
  @media (min-width: 1100px) {
    grid-column: 1 / -1;
  }
`;

const DEFAULTS = { range: "30" };

export default function Dashboard() {
  const [{ range }, setState] = useUrlState(DEFAULTS);

  const { stats, sales, stays, isPending, error, refetch } = useDashboard(range);
  const { data: today = [], isPending: isTodayPending } = useTodayActivity();

  const { from, to } = rangeToDates(range);

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorState error={error} onRetry={refetch} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Occupancy, revenue and today's front-desk work"
      >
        <SegmentedControl
          label="Reporting period"
          options={DASHBOARD_RANGES}
          value={range}
          onChange={(value) => setState({ range: value })}
        />
      </PageHeader>

      <StatTiles stats={stats} isPending={isPending} />

      <Grid>
        <FullWidth>
          <TodayActivity data={today} isPending={isTodayPending} />
        </FullWidth>
        <SalesChart data={sales} from={from} to={to} />
        <StayDurationChart data={stays} />
      </Grid>
    </>
  );
}
