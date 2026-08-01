import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  from { background-position: 100% 0; }
  to   { background-position: -100% 0; }
`;

/**
 * Skeletons preserve the page's layout while data loads. The old app replaced
 * whole screens with a centred spinner, so every navigation collapsed the
 * layout and then snapped it back.
 */
const Skeleton = styled.div`
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height ?? "1.6rem"};
  border-radius: ${({ $radius }) => $radius ?? "var(--radius-sm)"};
  background: var(--skeleton);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s linear infinite;
`;

export const SkeletonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "var(--space-3)"};
  padding: ${({ $padding }) => $padding ?? "var(--space-5)"};
`;

export function SkeletonTable({ rows = 6 }) {
  return (
    <SkeletonStack aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} $height="4.4rem" />
      ))}
    </SkeletonStack>
  );
}

export default Skeleton;
