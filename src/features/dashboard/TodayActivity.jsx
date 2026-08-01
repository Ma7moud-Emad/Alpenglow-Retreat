import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiOutlineSun } from "react-icons/hi2";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Thumb from "../../ui/Thumb";
import EmptyState from "../../ui/EmptyState";
import Skeleton from "../../ui/Skeleton";
import { useCheckOut } from "../../hooks/useBookings";
import { formatCurrency, pluralise } from "../../lib/format";

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

const Guest = styled.div`
  flex: 1;
  min-width: 12rem;

  & strong {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text);
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
`;

const Nights = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  white-space: nowrap;
`;

const Actions = styled.div`
  margin-left: auto;
`;

function ActivityRow({ item }) {
  const { mutate: checkOut, isPending } = useCheckOut();
  const isArrival = item.kind === "arrival";

  return (
    <Row>
      <Badge $tone={isArrival ? "success" : "info"}>
        {isArrival ? "Arriving" : "Departing"}
      </Badge>
      <Thumb
        src={item.country_flag}
        alt=""
        width="2.8rem"
        height="2rem"
        radius="0.3rem"
      />
      <Guest>
        <strong>{item.guest_name}</strong>
        <small>
          {item.cabin_name} · {formatCurrency(item.total_price)}
        </small>
      </Guest>
      <Nights>{pluralise(item.num_nights, "night")}</Nights>
      <Actions>
        {isArrival ? (
          <Button as={Link} to={`/admin/checkin/${item.booking_id}`} size="sm">
            Check in
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isPending}
            onClick={() => checkOut(item.booking_id)}
          >
            Check out
          </Button>
        )}
      </Actions>
    </Row>
  );
}

export default function TodayActivity({ data, isPending }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Today</CardTitle>
          <CardDescription>Guests arriving and departing today</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {isPending ? (
          <Skeleton $height="12rem" />
        ) : data.length === 0 ? (
          <EmptyState
            icon={<HiOutlineSun />}
            title="Nothing scheduled today"
            description="No arrivals or departures are booked for today."
          />
        ) : (
          <List>
            {data.map((item) => (
              <ActivityRow key={`${item.kind}-${item.booking_id}`} item={item} />
            ))}
          </List>
        )}
      </CardBody>
    </Card>
  );
}
