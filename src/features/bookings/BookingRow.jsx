import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowDownOnSquare,
  HiOutlineArrowUpOnSquare,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Td, Tr } from "../../ui/Table";
import { StatusBadge } from "../../ui/Badge";
import Menu, { MenuItem } from "../../ui/Menu";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useCheckOut, useDeleteBooking } from "../../hooks/useBookings";
import useAuth from "../../hooks/useAuth";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  pluralise,
} from "../../lib/format";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.35;
  min-width: 0;

  & strong {
    font-weight: 500;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & small {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }
`;

const Amount = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: var(--text);
`;

const IdCell = styled(Link)`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--accent);

  &:hover {
    text-decoration: underline;
  }
`;

export default function BookingRow({ booking }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: remove, isPending: isDeleting } = useDeleteBooking();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  const { cabins: cabin, guests: guest } = booking;

  return (
    <>
      <Tr>
        <Td data-label="Booking">
          <IdCell to={`/admin/bookings/${booking.id}`}>#{booking.id}</IdCell>
        </Td>

        <Td data-label="Cabin">
          <Stacked>
            <strong>{cabin?.name ?? "–"}</strong>
            <small>{pluralise(booking.numGuests, "guest")}</small>
          </Stacked>
        </Td>

        <Td data-label="Guest">
          <Stacked>
            <strong>{guest?.fullName ?? "–"}</strong>
            <small>{guest?.email}</small>
          </Stacked>
        </Td>

        <Td data-label="Stay">
          <Stacked>
            <strong>{formatRelativeDate(booking.startDate)}</strong>
            <small>
              {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
            </small>
          </Stacked>
        </Td>

        <Td data-label="Nights">{pluralise(booking.numNights, "night")}</Td>

        <Td data-label="Status">
          <StatusBadge status={booking.status} />
        </Td>

        <Td data-label="Amount" $align="right">
          <Amount>{formatCurrency(booking.totalPrice)}</Amount>
        </Td>

        <Td $align="right">
          <Menu label={`Actions for booking ${booking.id}`}>
            <MenuItem
              icon={<HiOutlineEye />}
              onClick={() => navigate(`/admin/bookings/${booking.id}`)}
            >
              See details
            </MenuItem>

            {booking.status === "unconfirmed" && (
              <MenuItem
                icon={<HiOutlineArrowDownOnSquare />}
                onClick={() => navigate(`/admin/checkin/${booking.id}`)}
              >
                Check in
              </MenuItem>
            )}

            {booking.status === "checked in" && (
              <MenuItem
                icon={<HiOutlineArrowUpOnSquare />}
                onClick={() => checkOut(booking.id)}
                disabled={isCheckingOut}
              >
                Check out
              </MenuItem>
            )}

            {isAdmin && (
              <MenuItem
                icon={<HiOutlineTrash />}
                onClick={() => setIsConfirmingDelete(true)}
                danger
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </Td>
      </Tr>

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() =>
          remove(booking.id, { onSuccess: () => setIsConfirmingDelete(false) })
        }
        isLoading={isDeleting}
        title={`Delete booking #${booking.id}?`}
        message={`This permanently removes ${
          guest?.fullName ?? "the guest"
        }'s stay in ${cabin?.name ?? "this cabin"}. It cannot be undone.`}
      />
    </>
  );
}
