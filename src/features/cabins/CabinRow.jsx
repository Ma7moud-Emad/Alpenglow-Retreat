import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlinePencilSquare,
  HiOutlineSquare2Stack,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Td, Tr } from "../../ui/Table";
import Badge from "../../ui/Badge";
import Thumb from "../../ui/Thumb";
import Menu, { MenuItem } from "../../ui/Menu";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useDeleteCabin, useDuplicateCabin } from "../../hooks/useCabins";
import useAuth from "../../hooks/useAuth";
import { formatCurrency, pluralise } from "../../lib/format";

const Name = styled.div`
  & strong {
    display: block;
    font-weight: 500;
    color: var(--text);
  }
  & small {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: var(--text-xs);
    color: var(--text-muted);
    max-width: 46ch;
  }
`;

const Price = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: var(--text);
`;

export default function CabinRow({ cabin, onEdit }) {
  const { isAdmin } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: remove, isPending: isDeleting } = useDeleteCabin();
  const { mutate: duplicate, isPending: isDuplicating } = useDuplicateCabin();

  return (
    <>
      <Tr>
        <Td data-label="Photo">
          <Thumb src={cabin.image} alt={`Photo of ${cabin.name}`} />
        </Td>

        <Td data-label="Cabin">
          <Name>
            <strong>{cabin.name}</strong>
            <small>{cabin.description}</small>
          </Name>
        </Td>

        <Td data-label="Capacity">{pluralise(cabin.maxCapacity, "guest")}</Td>

        <Td data-label="Price" $align="right">
          <Price>{formatCurrency(cabin.regularPrice)}</Price>
        </Td>

        <Td data-label="Discount" $align="right">
          {cabin.discount > 0 ? (
            <Badge $tone="success">−{formatCurrency(cabin.discount)}</Badge>
          ) : (
            <Badge $tone="neutral">None</Badge>
          )}
        </Td>

        <Td $align="right">
          <Menu label={`Actions for ${cabin.name}`}>
            <MenuItem icon={<HiOutlinePencilSquare />} onClick={() => onEdit(cabin)}>
              Edit
            </MenuItem>
            <MenuItem
              icon={<HiOutlineSquare2Stack />}
              onClick={() => duplicate(cabin)}
              disabled={isDuplicating}
            >
              Duplicate
            </MenuItem>
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
          remove(cabin, { onSuccess: () => setIsConfirmingDelete(false) })
        }
        isLoading={isDeleting}
        title={`Delete ${cabin.name}?`}
        message="The cabin and its photo are removed permanently. Cabins with existing bookings cannot be deleted."
      />
    </>
  );
}
