import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowDownOnSquare,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import Button from "../ui/Button";
import { Checkbox } from "../ui/Form";
import ErrorState from "../ui/ErrorState";
import Skeleton from "../ui/Skeleton";
import BookingSummary from "../features/bookings/BookingSummary";
import { useBooking, useCheckIn } from "../hooks/useBookings";
import { useSettings } from "../hooks/useSettings";
import { formatCurrency, pluralise } from "../lib/format";

const Panel = styled.div`
  margin-top: var(--space-5);
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-5);
  flex-wrap: wrap;
`;

const Notice = styled.p`
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--info-soft);
  color: var(--info-text);
  font-size: var(--text-sm);
`;

export default function CheckIn() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [addBreakfast, setAddBreakfast] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);

  const { data: booking, isPending, error, refetch } = useBooking(bookingId);
  const { data: settings } = useSettings();
  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();

  if (isPending) {
    return (
      <>
        <PageHeader title="Check in" />
        <Skeleton $height="52rem" $radius="var(--radius-lg)" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Check in" />
        <ErrorState error={error} onRetry={refetch} />
      </>
    );
  }

  const alreadyProcessed = booking.status !== "unconfirmed";

  // Mirrors hotel_check_in_booking(): rate × nights × guests. The old screen
  // hardcoded "$200" in the label and never added the charge to the total.
  const breakfastRate = Number(settings?.breakfastPrice ?? 0);
  const breakfastTotal = breakfastRate * booking.numNights * booking.numGuests;
  const dueNow = Number(booking.totalPrice) + (addBreakfast ? breakfastTotal : 0);

  function handleCheckIn() {
    checkIn(
      { id: booking.id, addBreakfast },
      { onSuccess: () => navigate(`/admin/bookings/${booking.id}`, { replace: true }) }
    );
  }

  return (
    <>
      <PageHeader
        title={`Check in booking #${booking.id}`}
        subtitle={booking.guests?.fullName}
      >
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft /> Back
        </Button>
      </PageHeader>

      <BookingSummary booking={booking} />

      <Panel>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Confirm arrival</CardTitle>
              <CardDescription>
                Payment is taken at the property, outside this app.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            {alreadyProcessed ? (
              <Notice>
                This booking has already been {booking.status}. Nothing further
                is needed here.
              </Notice>
            ) : (
              <Fields>
                {!booking.hasBreakfast && (
                  <Checkbox
                    checked={addBreakfast}
                    onChange={(event) => setAddBreakfast(event.target.checked)}
                    label={
                      <>
                        Add breakfast for {formatCurrency(breakfastTotal)}:{" "}
                        {formatCurrency(breakfastRate)} per guest per night,{" "}
                        {pluralise(booking.numGuests, "guest")} ×{" "}
                        {pluralise(booking.numNights, "night")}
                      </>
                    }
                  />
                )}

                <Checkbox
                  checked={confirmedPayment}
                  onChange={(event) => setConfirmedPayment(event.target.checked)}
                  label={
                    <>
                      I confirm that {booking.guests?.fullName ?? "the guest"} has
                      paid the total of <strong>{formatCurrency(dueNow)}</strong>
                    </>
                  }
                />
              </Fields>
            )}
          </CardBody>
        </Card>
      </Panel>

      <Actions>
        <Button variant="secondary" onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
          Cancel
        </Button>
        <Button
          onClick={handleCheckIn}
          disabled={!confirmedPayment || alreadyProcessed}
          isLoading={isCheckingIn}
        >
          <HiOutlineArrowDownOnSquare /> Check in booking #{booking.id}
        </Button>
      </Actions>
    </>
  );
}
