import { useEffect, useState } from "react";
import styled from "styled-components";
import { HiOutlineCalendarDays, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import DataTable, { Tbody, Th, Thead, Tr } from "../ui/Table";
import SegmentedControl from "../ui/SegmentedControl";
import { Input, Select } from "../ui/Form";
import Pagination from "../ui/Pagination";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { SkeletonTable } from "../ui/Skeleton";
import BookingRow from "../features/bookings/BookingRow";
import useUrlState from "../hooks/useUrlState";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useBookings } from "../hooks/useBookings";
import { BOOKING_SORTS, PAGE_SIZE } from "../services/bookings";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 22rem;
  max-width: 34rem;

  & svg {
    position: absolute;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    width: 1.8rem;
    height: 1.8rem;
    color: var(--text-muted);
    pointer-events: none;
  }
  & input {
    padding-left: 4rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;

  & select {
    width: auto;
    min-width: 20rem;
  }
`;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "checked in", label: "Checked in" },
  { value: "checked out", label: "Checked out" },
];

const DEFAULTS = {
  status: "all",
  sort: "created_at-desc",
  page: "1",
  search: "",
};

export default function Bookings() {
  const [urlState, setUrlState] = useUrlState(DEFAULTS);
  const [searchInput, setSearchInput] = useState(urlState.search);
  const debouncedSearch = useDebouncedValue(searchInput);

  // Typing drives the URL through a debounce so each keystroke is not a query.
  useEffect(() => {
    if (debouncedSearch !== urlState.search) {
      setUrlState({ search: debouncedSearch });
    }
  }, [debouncedSearch, urlState.search, setUrlState]);

  const { data, isPending, error, refetch, isPlaceholderData } = useBookings({
    status: urlState.status,
    sort: urlState.sort,
    page: Number(urlState.page),
    search: urlState.search,
  });

  const bookings = data?.bookings ?? [];
  const hasFilters =
    urlState.status !== "all" || Boolean(urlState.search.trim());

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Every reservation, past and upcoming"
      />

      <Card>
        <Toolbar>
          <SearchBox>
            <HiOutlineMagnifyingGlass aria-hidden="true" />
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by guest name or email"
              aria-label="Search bookings by guest"
            />
          </SearchBox>

          <Controls>
            <SegmentedControl
              label="Filter by status"
              options={STATUS_FILTERS}
              value={urlState.status}
              onChange={(value) => setUrlState({ status: value })}
            />
            <Select
              value={urlState.sort}
              onChange={(event) => setUrlState({ sort: event.target.value })}
              aria-label="Sort bookings"
            >
              {BOOKING_SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Controls>
        </Toolbar>

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isPending ? (
          <SkeletonTable rows={8} />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<HiOutlineCalendarDays />}
            title={hasFilters ? "No bookings match those filters" : "No bookings yet"}
            description={
              hasFilters
                ? "Try clearing the search box or switching back to All."
                : "Reservations will appear here as guests book."
            }
          />
        ) : (
          <div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
            <DataTable>
              <Thead>
                <Tr>
                  <Th>Booking</Th>
                  <Th>Cabin</Th>
                  <Th>Guest</Th>
                  <Th>Stay</Th>
                  <Th>Nights</Th>
                  <Th>Status</Th>
                  <Th $align="right">Amount</Th>
                  <Th>
                    <span className="sr-only">Actions</span>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </Tbody>
            </DataTable>

            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              count={data.count}
              pageSize={PAGE_SIZE}
              onPageChange={(next) => setUrlState({ page: String(next) })}
            />
          </div>
        )}
      </Card>
    </>
  );
}
