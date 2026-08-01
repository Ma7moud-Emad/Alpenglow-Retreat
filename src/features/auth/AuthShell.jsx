import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";
import Wordmark from "../../site/ui/Wordmark";
import backdropWebp from "../../assets/generated/hero-1600.webp";
import backdropJpg from "../../assets/generated/hero-1600.jpg";

const Page = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100dvh;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Showcase = styled.aside`
  display: none;
  position: relative;
  /* The JPEG line is the fallback; browsers that understand image-set take the
     WebP and save about a third of the bytes. */
  background-image: url(${backdropJpg});
  background-image: image-set(
    url(${backdropWebp}) type("image/webp"),
    url(${backdropJpg}) type("image/jpeg")
  );
  background-size: cover;
  background-position: center;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(49, 46, 129, 0.82),
      rgba(15, 23, 42, 0.88)
    );
  }

  @media (min-width: 900px) {
    display: block;
  }
`;

const Quote = styled.blockquote`
  position: absolute;
  inset: auto var(--space-10) var(--space-10);
  z-index: 1;
  color: #fff;

  & p {
    font-size: var(--text-xl);
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: -0.02em;
  }
  & footer {
    margin-top: var(--space-3);
    font-size: var(--text-sm);
    opacity: 0.75;
  }
`;

const Panel = styled.main`
  position: relative;
  display: grid;
  place-items: center;
  padding: var(--space-6) var(--space-5);
  background-color: var(--canvas);
`;

/* The sign-in screen is a dead end otherwise: a guest who lands here from the
   header has no way back to the site without the browser's back button.
   It sits on the photograph, which only exists from 900px up; below that the
   Showcase is hidden and it falls back to sitting on the panel. */
const HomeLink = styled(Link)`
  position: absolute;
  top: var(--space-5);
  left: var(--space-5);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background-color: var(--surface);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }

  &:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  /* Icon only once the screen gets tight. */
  @media (max-width: 520px) {
    padding: var(--space-2);

    & span {
      display: none;
    }
  }

  /* Over the photograph. The scrim behind it is near-black, so white clears AA
     comfortably at this size. */
  @media (min-width: 900px) {
    border-color: rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(6px);
    color: #fff;

    &:hover {
      background-color: rgba(255, 255, 255, 0.24);
      border-color: #fff;
      color: #fff;
    }
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

const Brand = styled.div`
  color: var(--text);
`;

const Heading = styled.div`
  & h1 {
    font-size: var(--text-2xl);
  }
  & p {
    margin-top: var(--space-2);
    color: var(--text-muted);
  }
`;

/** Shared chrome for the signed-out screens. */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <Page>
      <HomeLink to="/" aria-label="Back to the website" title="Back to the website">
        <HiOutlineHome aria-hidden="true" />
        <span>Back to the website</span>
      </HomeLink>

      <Showcase aria-hidden="true">
        <Quote>
          <p>Every stay runs smoother when the front desk sees the whole picture.</p>
          <footer>Alpenglow Retreat staff dashboard</footer>
        </Quote>
      </Showcase>

      <Panel>
        <Inner>
          <Brand>
            <Wordmark to="/" />
          </Brand>

          <Heading>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </Heading>

          {children}
        </Inner>
      </Panel>
    </Page>
  );
}
