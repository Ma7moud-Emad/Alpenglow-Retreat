import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/**
 * A bordered ring rather than an icon font, so it inherits currentColor and
 * scales with whatever it sits inside.
 */
const Spinner = styled.span`
  display: inline-block;
  width: ${({ $size }) => $size ?? "1.6em"};
  height: ${({ $size }) => $size ?? "1.6em"};
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: 0.85;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

export default Spinner;
