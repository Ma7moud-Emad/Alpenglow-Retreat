import styled from "styled-components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Button from "./Button";

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--border);

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

const Summary = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);

  & strong {
    color: var(--text);
    font-weight: 600;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);

  @media (max-width: 560px) {
    justify-content: center;
  }
`;

const PageIndicator = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding: 0 var(--space-2);
  white-space: nowrap;
`;

export default function Pagination({
  page,
  pageCount,
  count,
  pageSize,
  onPageChange,
}) {
  if (count === 0) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, count);

  return (
    <Wrapper aria-label="Pagination">
      <Summary>
        Showing <strong>{first}</strong>–<strong>{last}</strong> of{" "}
        <strong>{count}</strong>
      </Summary>

      {pageCount > 1 && (
        <Controls>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <HiChevronLeft />
            Previous
          </Button>

          <PageIndicator aria-current="page">
            Page {page} of {pageCount}
          </PageIndicator>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            Next
            <HiChevronRight />
          </Button>
        </Controls>
      )}
    </Wrapper>
  );
}
