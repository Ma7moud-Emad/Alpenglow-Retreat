import styled from "styled-components";
import Wordmark from "../site/ui/Wordmark";

/**
 * The dashboard reuses the site's drawn wordmark rather than the old bitmap
 * logos, so there is one mark for the whole product and no light/dark asset
 * swap to keep in sync.
 */
const Slot = styled.div`
  padding: 0 var(--space-2);
  color: var(--text);
`;

export default function Logo() {
  return (
    <Slot>
      <Wordmark compact to="/admin/dashboard" />
    </Slot>
  );
}
