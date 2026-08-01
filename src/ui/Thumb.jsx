import { useState } from "react";
import styled from "styled-components";
import { HiOutlinePhoto } from "react-icons/hi2";

const Frame = styled.span`
  display: grid;
  place-items: center;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${({ $radius }) => $radius};
  border: 1px solid var(--border);
  background-color: var(--surface-inset);
  color: var(--text-muted);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  & svg {
    width: 40%;
    height: 40%;
    opacity: 0.5;
  }
`;

/**
 * An image that degrades to a placeholder instead of a broken-image icon.
 * Cabin photos and guest country flags are remote URLs that can disappear.
 */
export default function Thumb({
  src,
  alt = "",
  width = "7.2rem",
  height = "5.4rem",
  radius = "var(--radius-sm)",
  fallback,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Frame $width={width} $height={height} $radius={radius}>
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        (fallback ?? <HiOutlinePhoto aria-hidden="true" />)
      )}
    </Frame>
  );
}
