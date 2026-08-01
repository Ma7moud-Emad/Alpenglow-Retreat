import { useState } from "react";
import styled from "styled-components";
import { initialsFrom } from "../lib/format";

const Wrapper = styled.span`
  display: inline-grid;
  place-items: center;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--accent-soft);
  color: var(--accent-soft-text);
  font-size: calc(${({ $size }) => $size} * 0.38);
  font-weight: 600;
  letter-spacing: 0.02em;
  user-select: none;
  border: 1px solid var(--border);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/** Falls back to initials when there is no image, or the image fails to load. */
export default function Avatar({ src, name, size = "3.6rem" }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <Wrapper $size={size} title={name}>
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initialsFrom(name)}</span>
      )}
    </Wrapper>
  );
}
