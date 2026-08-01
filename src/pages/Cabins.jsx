import { useState } from "react";
import styled from "styled-components";
import { HiOutlineHomeModern, HiOutlinePlus } from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";
import DataTable, { Tbody, Th, Thead, Tr } from "../ui/Table";
import SegmentedControl from "../ui/SegmentedControl";
import { Select } from "../ui/Form";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { SkeletonTable } from "../ui/Skeleton";
import CabinRow from "../features/cabins/CabinRow";
import CabinForm from "../features/cabins/CabinForm";
import useUrlState from "../hooks/useUrlState";
import { useCabins } from "../hooks/useCabins";
import { CABIN_FILTERS, CABIN_SORTS } from "../services/cabins";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);

  & select {
    width: auto;
    min-width: 22rem;
  }
`;

const DEFAULTS = { filter: "all", sort: "name-asc" };

export default function Cabins() {
  const [urlState, setUrlState] = useUrlState(DEFAULTS);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: cabins = [], isPending, error, refetch } = useCabins(urlState);

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(cabin) {
    setEditing(cabin);
    setIsFormOpen(true);
  }

  return (
    <>
      <PageHeader title="Cabins" subtitle="Rooms available to book">
        <Button onClick={openCreate}>
          <HiOutlinePlus /> Add cabin
        </Button>
      </PageHeader>

      <Card>
        <Toolbar>
          <SegmentedControl
            label="Filter cabins"
            options={CABIN_FILTERS}
            value={urlState.filter}
            onChange={(value) => setUrlState({ filter: value })}
          />
          <Select
            value={urlState.sort}
            onChange={(event) => setUrlState({ sort: event.target.value })}
            aria-label="Sort cabins"
          >
            {CABIN_SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Toolbar>

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isPending ? (
          <SkeletonTable rows={6} />
        ) : cabins.length === 0 ? (
          <EmptyState
            icon={<HiOutlineHomeModern />}
            title={
              urlState.filter === "all"
                ? "No cabins yet"
                : "No cabins match this filter"
            }
            description={
              urlState.filter === "all"
                ? "Add your first cabin to start taking bookings."
                : "Switch back to All to see every cabin."
            }
            action={
              urlState.filter === "all" && (
                <Button onClick={openCreate}>
                  <HiOutlinePlus /> Add cabin
                </Button>
              )
            }
          />
        ) : (
          <DataTable>
            <Thead>
              <Tr>
                <Th>Photo</Th>
                <Th>Cabin</Th>
                <Th>Capacity</Th>
                <Th $align="right">Price</Th>
                <Th $align="right">Discount</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {cabins.map((cabin) => (
                <CabinRow key={cabin.id} cabin={cabin} onEdit={openEdit} />
              ))}
            </Tbody>
          </DataTable>
        )}
      </Card>

      {/* Keyed so switching between cabins re-seeds the form's defaults. */}
      {isFormOpen && (
        <CabinForm
          key={editing?.id ?? "new"}
          isOpen={isFormOpen}
          cabin={editing}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
