import { useState } from "react";
import styled from "styled-components";
import { HiOutlineInbox, HiOutlineTrash } from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import DataTable, { Tbody, Td, Th, Thead, Tr } from "../ui/Table";
import SegmentedControl from "../ui/SegmentedControl";
import { Checkbox, Select } from "../ui/Form";
import Modal from "../ui/Modal";
import ConfirmDialog from "../ui/ConfirmDialog";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { SkeletonTable } from "../ui/Skeleton";
import useUrlState from "../hooks/useUrlState";
import useAuth from "../hooks/useAuth";
import {
  useConvertRequest,
  useDeleteRequest,
  useRequests,
  useUpdateRequest,
} from "../hooks/useRequests";
import { useCabins } from "../hooks/useCabins";
import {
  differenceInCalendarDays,
  formatDate,
  formatRelativeDate,
  pluralise,
} from "../lib/format";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
`;

const Person = styled.div`
  & strong {
    display: block;
    font-weight: 500;
    color: var(--text);
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
`;

const Stay = styled.div`
  & strong {
    display: block;
    font-weight: 500;
    color: var(--text);
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
`;

const Message = styled.p`
  margin-top: var(--space-2);
  padding: var(--space-3);
  background-color: var(--surface-inset);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
`;

const DetailList = styled.dl`
  display: grid;
  grid-template-columns: minmax(10rem, auto) 1fr;
  gap: var(--space-2) var(--space-4);
  font-size: var(--text-sm);

  & dt {
    color: var(--text-muted);
  }
  & dd {
    color: var(--text);
    word-break: break-word;
  }
`;

const ConvertFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-5);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  flex-wrap: wrap;
`;

const STATUS_TONES = {
  new: "info",
  contacted: "warning",
  confirmed: "success",
  declined: "neutral",
};

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
];

const DEFAULTS = { status: "new" };

export default function Requests() {
  const [urlState, setUrlState] = useUrlState(DEFAULTS);
  const [openRequest, setOpenRequest] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [convertCabinId, setConvertCabinId] = useState("");
  const [convertBreakfast, setConvertBreakfast] = useState(false);

  const { isAdmin } = useAuth();
  const { data: requests = [], isPending, error, refetch } = useRequests(urlState);
  const { data: cabins = [] } = useCabins({ filter: "all", sort: "name-asc" });

  const { mutate: update, isPending: isUpdating } = useUpdateRequest();
  const { mutate: convert, isPending: isConverting } = useConvertRequest();
  const { mutate: remove, isPending: isDeleting } = useDeleteRequest();

  function open(request) {
    setOpenRequest(request);
    setConvertCabinId(request.cabin_id ? String(request.cabin_id) : "");
    setConvertBreakfast(false);
  }

  function handleConvert() {
    convert(
      {
        requestId: openRequest.id,
        cabinId: convertCabinId ? Number(convertCabinId) : null,
        hasBreakfast: convertBreakfast,
      },
      { onSuccess: () => setOpenRequest(null) }
    );
  }

  const nights = openRequest
    ? differenceInCalendarDays(openRequest.end_date, openRequest.start_date)
    : 0;

  return (
    <>
      <PageHeader
        title="Enquiries"
        subtitle="Requests sent from the public site, newest first"
      />

      <Card>
        <Toolbar>
          <SegmentedControl
            label="Filter enquiries"
            options={STATUS_FILTERS}
            value={urlState.status}
            onChange={(value) => setUrlState({ status: value })}
          />
        </Toolbar>

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isPending ? (
          <SkeletonTable rows={5} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<HiOutlineInbox />}
            title={
              urlState.status === "new"
                ? "No new enquiries"
                : "Nothing in this list"
            }
            description="Enquiries sent from the website land here for the front desk to triage."
          />
        ) : (
          <DataTable>
            <Thead>
              <Tr>
                <Th>Guest</Th>
                <Th>Requested stay</Th>
                <Th>Party</Th>
                <Th>Room</Th>
                <Th>Status</Th>
                <Th>Received</Th>
                <Th><span className="sr-only">Actions</span></Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((request) => (
                <Tr key={request.id}>
                  <Td data-label="Guest">
                    <Person>
                      <strong>{request.full_name}</strong>
                      <small>{request.email}</small>
                    </Person>
                  </Td>
                  <Td data-label="Requested stay">
                    <Stay>
                      <strong>{formatDate(request.start_date)}</strong>
                      <small>
                        {pluralise(
                          differenceInCalendarDays(
                            request.end_date,
                            request.start_date
                          ),
                          "night"
                        )}{" "}
                        · to {formatDate(request.end_date)}
                      </small>
                    </Stay>
                  </Td>
                  <Td data-label="Party">{pluralise(request.num_guests, "guest")}</Td>
                  <Td data-label="Room">{request.cabins?.name ?? "No preference"}</Td>
                  <Td data-label="Status">
                    <Badge $tone={STATUS_TONES[request.status] ?? "neutral"}>
                      {request.status}
                    </Badge>
                  </Td>
                  <Td data-label="Received">
                    {formatRelativeDate(request.created_at)}
                  </Td>
                  <Td $align="right">
                    <Button size="sm" variant="secondary" onClick={() => open(request)}>
                      Review
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </DataTable>
        )}
      </Card>

      <Modal
        isOpen={Boolean(openRequest)}
        onClose={() => setOpenRequest(null)}
        title={openRequest ? `Enquiry from ${openRequest.full_name}` : ""}
        description="Confirming creates a booking and marks the enquiry closed."
        width="60rem"
      >
        {openRequest && (
          <>
            <DetailList>
              <dt>Email</dt>
              <dd>{openRequest.email}</dd>
              <dt>Phone</dt>
              <dd>{openRequest.phone || "Not given"}</dd>
              <dt>Arriving</dt>
              <dd>{formatDate(openRequest.start_date)}</dd>
              <dt>Leaving</dt>
              <dd>
                {formatDate(openRequest.end_date)} · {pluralise(nights, "night")}
              </dd>
              <dt>Party size</dt>
              <dd>{pluralise(openRequest.num_guests, "guest")}</dd>
              <dt>Room requested</dt>
              <dd>{openRequest.cabins?.name ?? "No preference"}</dd>
              <dt>Received</dt>
              <dd>{formatDate(openRequest.created_at)}</dd>
              {openRequest.staff?.full_name && (
                <>
                  <dt>Last handled by</dt>
                  <dd>{openRequest.staff.full_name}</dd>
                </>
              )}
            </DetailList>

            {openRequest.message && <Message>{openRequest.message}</Message>}

            {openRequest.status !== "confirmed" && (
              <ConvertFields>
                <Select
                  value={convertCabinId}
                  onChange={(event) => setConvertCabinId(event.target.value)}
                  aria-label="Cabin to assign"
                >
                  <option value="">Choose a cabin to assign…</option>
                  {cabins.map((cabin) => (
                    <option key={cabin.id} value={cabin.id}>
                      {cabin.name}, sleeps {cabin.maxCapacity}
                    </option>
                  ))}
                </Select>

                <Checkbox
                  checked={convertBreakfast}
                  onChange={(event) => setConvertBreakfast(event.target.checked)}
                  label="Include breakfast (charged per guest, per night)"
                />
              </ConvertFields>
            )}

            <Actions>
              {isAdmin && (
                <Button
                  variant="danger-soft"
                  onClick={() => setPendingDelete(openRequest)}
                >
                  <HiOutlineTrash /> Delete
                </Button>
              )}

              {openRequest.status !== "declined" && (
                <Button
                  variant="secondary"
                  isLoading={isUpdating}
                  onClick={() =>
                    update(
                      { id: openRequest.id, status: "declined" },
                      { onSuccess: () => setOpenRequest(null) }
                    )
                  }
                >
                  Decline
                </Button>
              )}

              {openRequest.status === "new" && (
                <Button
                  variant="secondary"
                  isLoading={isUpdating}
                  onClick={() =>
                    update(
                      { id: openRequest.id, status: "contacted" },
                      { onSuccess: () => setOpenRequest(null) }
                    )
                  }
                >
                  Mark contacted
                </Button>
              )}

              {openRequest.status !== "confirmed" && (
                <Button
                  isLoading={isConverting}
                  disabled={!convertCabinId}
                  onClick={handleConvert}
                >
                  Create booking
                </Button>
              )}
            </Actions>
          </>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() =>
          remove(pendingDelete.id, {
            onSuccess: () => {
              setPendingDelete(null);
              setOpenRequest(null);
            },
          })
        }
        isLoading={isDeleting}
        title="Delete this enquiry?"
        message={`The enquiry from ${pendingDelete?.full_name} will be removed permanently.`}
      />
    </>
  );
}
