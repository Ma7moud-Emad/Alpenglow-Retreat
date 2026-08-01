import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Container,
  Display,
  Eyebrow,
  Grid,
  Lede,
  Section,
  SectionIntro,
} from "../ui/primitives";
import RoomCard from "../ui/RoomCard";
import { usePublicRooms } from "../../hooks/usePublicSite";
import { nightlyRate } from "../../services/publicSite";
import Skeleton from "../../ui/Skeleton";
import ErrorState from "../../ui/ErrorState";
import { pluralise } from "../../lib/format";
import PageMeta from "../../ui/PageMeta";
import { breadcrumbSchema } from "../../lib/seo";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  flex-wrap: wrap;
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-10);
  border-bottom: 1px solid var(--site-line);
`;

const Filters = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  padding: 0.8rem var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid
    ${({ $active }) => ($active ? "var(--site-ink)" : "var(--site-line)")};
  background-color: ${({ $active }) => ($active ? "var(--site-ink)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--site-on-dark)" : "var(--site-ink-soft)")};
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--duration) var(--ease);

  &:hover:not([aria-pressed="true"]) {
    border-color: var(--site-ink);
    color: var(--site-ink);
  }
`;

const Count = styled.p`
  font-size: var(--text-sm);
  color: var(--site-ink-muted);
`;

const SortSelect = styled.select`
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--site-ink);
  background-color: transparent;
  border: 1px solid var(--site-line);
  border-radius: var(--radius-full);
  padding: 0.8rem var(--space-4);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--site-ink);
  }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-16) var(--space-4);
  color: var(--site-ink-muted);

  & h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-xl);
    color: var(--site-ink);
    margin-bottom: var(--space-2);
  }
`;

/** Party-size buckets, since "sleeps 2" is how people actually search. */
const PARTY_FILTERS = [
  { value: "all", label: "All rooms", test: () => true },
  { value: "couple", label: "For two", test: (r) => r.maxCapacity <= 2 },
  { value: "small", label: "3 – 5 guests", test: (r) => r.maxCapacity >= 3 && r.maxCapacity <= 5 },
  { value: "group", label: "6 or more", test: (r) => r.maxCapacity >= 6 },
  { value: "tub", label: "With a hot tub", test: (r) => r.amenities?.includes("Private hot tub") },
  { value: "fire", label: "With a fireplace", test: (r) => r.amenities?.includes("Wood-burning fireplace") },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "size", label: "Largest first" },
];

export default function Rooms() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const { data: rooms = [], isPending, error, refetch } = usePublicRooms();

  const visible = useMemo(() => {
    const test = PARTY_FILTERS.find((f) => f.value === filter)?.test ?? (() => true);
    const list = rooms.filter(test);

    const sorters = {
      "price-asc": (a, b) => nightlyRate(a) - nightlyRate(b),
      "price-desc": (a, b) => nightlyRate(b) - nightlyRate(a),
      size: (a, b) => (b.size_sqm ?? 0) - (a.size_sqm ?? 0),
      featured: (a, b) => a.sort_order - b.sort_order,
    };
    return [...list].sort(sorters[sort] ?? sorters.featured);
  }, [rooms, filter, sort]);

  return (
    <Section $tone="light">
      <PageMeta
        title="Rooms"
        path="/rooms"
        description="Fifteen cabins across four hundred acres, from a single room with a deep tub by the window to a twelve-bed lodge with a fireplace you can stand inside. Filter by party size, hot tub or fireplace."
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
        ])}
      />

      <Container>
        <SectionIntro>
          <Eyebrow>Accommodation</Eyebrow>
          <Display as="h1">
            Fifteen cabins, scattered across <em>four hundred acres</em>.
          </Display>
          <Lede>
            Each was built where the land suggested rather than where a plan
            said, so none of them match. Rates are per night and include
            firewood, Wi-Fi and the run of the estate.
          </Lede>
        </SectionIntro>

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <>
            <Toolbar>
              <Filters role="group" aria-label="Filter rooms">
                {PARTY_FILTERS.map((item) => (
                  <Chip
                    key={item.value}
                    type="button"
                    $active={filter === item.value}
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label}
                  </Chip>
                ))}
              </Filters>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                {!isPending && (
                  <Count>{pluralise(visible.length, "room")}</Count>
                )}
                <SortSelect
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort rooms"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SortSelect>
              </div>
            </Toolbar>

            <Grid $min="30rem">
              {isPending
                ? Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} $height="46rem" $radius="var(--radius-lg)" />
                  ))
                : visible.length === 0
                ? (
                  <Empty>
                    <h3>Nothing matches that combination</h3>
                    <p>Try widening the filter. We only have fifteen rooms.</p>
                  </Empty>
                )
                : visible.map((room) => (
                    <RoomCard key={room.id} room={room} titleAs="h2" />
                  ))}
            </Grid>
          </>
        )}
      </Container>
    </Section>
  );
}
