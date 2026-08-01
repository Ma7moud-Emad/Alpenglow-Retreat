import styled from "styled-components";

/**
 * A full-bleed photograph behind a section.
 *
 * These used to be CSS `background-image` declarations, which meant the browser
 * could not see them until the stylesheet had parsed and could only ever fetch
 * one size. As a real <picture> the preload scanner finds the hero immediately,
 * mobile gets a 22 kB file instead of a 616 kB one, and the whole thing stays
 * out of the accessibility tree.
 */
const Frame = styled.picture`
  position: absolute;
  inset: 0;
  z-index: ${({ $layer }) => $layer};
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${({ $position }) => $position};
  }
`;

export default function Backdrop({
  image,
  priority = false,
  position = "center",
  sizes = "100vw",
  layer = 0,
}) {
  return (
    <Frame $position={position} $layer={layer} aria-hidden="true">
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.jpeg}
        sizes={sizes}
        alt=""
        width={image.width}
        height={image.height}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </Frame>
  );
}
