import styled from "styled-components";
import Modal from "./Modal";
import Button from "./Button";

const Message = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

/**
 * Every destructive action goes through this. Deleting a cabin, a booking or a
 * teammate previously fired straight from the click handler with no way back.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="44rem">
      <Message>{message}</Message>
      <Actions>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </Actions>
    </Modal>
  );
}
