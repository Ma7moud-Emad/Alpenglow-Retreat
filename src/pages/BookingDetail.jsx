import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowDownOnSquare,
  HiOutlineArrowLeft,
  HiOutlineArrowUpOnSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import PageHeader from "../ui/PageHeader";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import Skeleton from "../ui/Skeleton";
import ConfirmDialog from "../ui/ConfirmDialog";
import BookingSummary from "../features/bookings/BookingSummary";
import {
  useBooking,
  useCheckOut,
  useDeleteBooking,
} from "../hooks/useBookings";
import useAuth from "../hooks/useAuth";

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-5);
  flex-wrap: wrap;
`;

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { data: booking, isPending, error, refetch } = useBooking(bookingId);
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();
  const { mutate: remove, isPending: isDeleting } = useDeleteBooking();

  if (isPending) {
    return (
      <>
        <PageHeader title="Booking" />
        <Skeleton $height="52rem" $radius="var(--radius-lg)" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Booking" />
        <ErrorState
          title="This booking could not be loaded"
          error={error}
          onRetry={refetch}
        />
        <Actions>
          <Button variant="secondary" onClick={() => navigate("/admin/bookings")}>
            <HiOutlineArrowLeft /> Back to bookings
          </Button>
        </Actions>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Booking #${booking.id}`}
        subtitle={booking.guests?.fullName}
      >
        <Button variant="secondary" onClick={() => navigate("/admin/bookings")}>
          <HiOutlineArrowLeft /> Back
        </Button>
      </PageHeader>

      <BookingSummary booking={booking} />

      <Actions>
        {booking.status === "unconfirmed" && (
          <Button onClick={() => navigate(`/admin/checkin/${booking.id}`)}>
            <HiOutlineArrowDownOnSquare /> Check in
          </Button>
        )}

        {booking.status === "checked in" && (
          <Button
            variant="success"
            isLoading={isCheckingOut}
            onClick={() => checkOut(booking.id)}
          >
            <HiOutlineArrowUpOnSquare /> Check out
          </Button>
        )}

        {isAdmin && (
          <Button
            variant="danger-soft"
            onClick={() => setIsConfirmingDelete(true)}
          >
            <HiOutlineTrash /> Delete
          </Button>
        )}
      </Actions>

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() =>
          remove(booking.id, {
            onSuccess: () => {
              setIsConfirmingDelete(false);
              navigate("/admin/bookings", { replace: true });
            },
          })
        }
        isLoading={isDeleting}
        title={`Delete booking #${booking.id}?`}
        message="This permanently removes the reservation and cannot be undone."
      />
    </>
  );
}
