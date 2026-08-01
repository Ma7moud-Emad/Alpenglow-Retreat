import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

/**
 * The public site's design language.
 *
 * It defines its own `--site-*` variables rather than reusing the dashboard's
 * semantic tokens, because a marketing page should not flip to dark because a
 * staff member left dark mode on in the admin app. Both layers still draw from
 * the same brand palette, so they read as one product.
 */
/**
 * The token block on its own, so anything rendered outside the SiteRoot subtree
 * can still resolve `--site-*`. A dialog portalled to document.body would
 * otherwise come out unstyled: the variables simply do not exist there.
 */
export const siteTokens = css`
  --site-bg: var(--sand-50);
  --site-bg-alt: var(--sand-100);
  --site-surface: #ffffff;
  --site-deep: var(--pine-950);
  --site-deep-alt: var(--pine-900);

  --site-ink: var(--pine-950);
  --site-ink-soft: #4a5b51;
  /* Was #7d8e84, which read at 3.3:1 on the sand backgrounds. This clears 4.5
     against all three of them. */
  --site-ink-muted: #5f7268;
  --site-on-dark: #f3f1ec;
  --site-on-dark-soft: rgba(243, 241, 236, 0.72);

  --site-line: #e4dcd0;
  --site-line-dark: rgba(243, 241, 236, 0.16);

  /* Ember at full strength is a 3.3:1 colour on sand, which is fine for a
     48px display italic and not fine for an 11px eyebrow. Split by job rather
     than dimming the brand everywhere:

       --site-accent        text of any size, and fills that carry white text
       --site-accent-bright the brand orange, for large type and plain marks
       --site-accent-solid  button fills, chosen so white on top clears 4.5 */
  --site-accent: var(--ember-700);
  --site-accent-hover: var(--ember-800);
  --site-accent-bright: var(--ember-500);
  --site-accent-solid: var(--ember-600);
  --site-accent-solid-hover: var(--ember-700);
  --site-accent-soft: var(--ember-50);

  /* The global rule paints headings with --text, the dashboard's ink. Rebinding
     the variable here (rather than adding a descendant h1–h6 rule) keeps site
     headings independent of the staff member's light/dark preference AND lets
     individual components still set their own colour; a descendant selector
     would outrank them and repaint every heading it touched. */
  --text: var(--site-ink);
  color-scheme: light;
`;

export const SiteRoot = styled.div`
  ${siteTokens}

  background-color: var(--site-bg);
  color: var(--site-ink);
  font-family: var(--font-body);
  min-height: 100dvh;
  overflow-x: clip;
`;

export const Container = styled.div`
  width: 100%;
  max-width: var(--site-max);
  margin: 0 auto;
  padding-inline: var(--space-6);

  @media (max-width: 640px) {
    padding-inline: var(--space-5);
  }
`;

const toneStyles = {
  light: css`
    background-color: var(--site-bg);
    color: var(--site-ink);
  `,
  alt: css`
    background-color: var(--site-bg-alt);
    color: var(--site-ink);
  `,
  white: css`
    background-color: var(--site-surface);
    color: var(--site-ink);
  `,
  deep: css`
    background-color: var(--site-deep);
    color: var(--site-on-dark);
    --text: var(--site-on-dark);
    --site-accent: var(--ember-300);
    --site-accent-bright: var(--ember-300);
  `,
};

export const Section = styled.section`
  padding-block: var(--space-24);
  ${({ $tone }) => toneStyles[$tone] ?? toneStyles.light}

  @media (max-width: 900px) {
    padding-block: var(--space-16);
  }
`;

/** Small uppercase kicker that sits above a heading. */
export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--site-accent);
  margin-bottom: var(--space-4);

  &::before {
    content: "";
    width: 2.4rem;
    height: 1px;
    background-color: currentColor;
    opacity: 0.6;
  }
`;

/** The serif voice of the brand. Sizes fluidly between mobile and desktop. */
export const Display = styled.h2`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3.2rem, 1.6rem + 3.6vw, 5.6rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  text-wrap: balance;

  & em {
    font-style: italic;
    color: var(--site-accent-bright);
  }
`;

export const Heading = styled.h3`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.2rem, 1.4rem + 1.6vw, 3.2rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
`;

export const Lede = styled.p`
  font-size: clamp(1.6rem, 1.4rem + 0.4vw, 1.9rem);
  line-height: 1.65;
  color: ${({ $onDark }) =>
    $onDark ? "var(--site-on-dark-soft)" : "var(--site-ink-soft)"};
  max-width: ${({ $narrow }) => ($narrow ? "58ch" : "70ch")};
  text-wrap: pretty;
`;

export const Body = styled.p`
  font-size: var(--text-md);
  line-height: 1.7;
  color: ${({ $onDark }) =>
    $onDark ? "var(--site-on-dark-soft)" : "var(--site-ink-soft)"};
  text-wrap: pretty;
`;

/** Centred section intro: eyebrow + display + lede. */
export const SectionIntro = styled.div`
  max-width: 68rem;
  margin-inline: ${({ $center }) => ($center ? "auto" : "0")};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  margin-bottom: var(--space-16);

  ${Eyebrow} {
    ${({ $center }) =>
      $center &&
      css`
        &::before {
          display: none;
        }
      `}
  }

  ${Lede} {
    margin-top: var(--space-5);
    margin-inline: ${({ $center }) => ($center ? "auto" : "0")};
  }

  @media (max-width: 900px) {
    margin-bottom: var(--space-10);
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 1.4rem var(--space-6);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease), border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease);

  & svg {
    width: 1.7rem;
    height: 1.7rem;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

const siteVariants = {
  primary: css`
    background-color: var(--site-accent-solid);
    color: #fff;
    &:hover:not(:disabled) {
      background-color: var(--site-accent-solid-hover);
    }
  `,
  dark: css`
    background-color: var(--site-deep);
    color: var(--site-on-dark);
    &:hover:not(:disabled) {
      background-color: var(--pine-800);
    }
  `,
  outline: css`
    background-color: transparent;
    color: var(--site-ink);
    border-color: var(--site-ink);
    &:hover:not(:disabled) {
      background-color: var(--site-ink);
      color: var(--site-on-dark);
    }
  `,
  "outline-light": css`
    background-color: transparent;
    color: var(--site-on-dark);
    border-color: rgba(243, 241, 236, 0.5);
    &:hover:not(:disabled) {
      background-color: var(--site-on-dark);
      color: var(--site-deep);
      border-color: var(--site-on-dark);
    }
  `,
};

export const SiteButton = styled.button`
  ${buttonBase}
  ${({ $variant }) => siteVariants[$variant] ?? siteVariants.primary}
  ${({ $full }) =>
    $full &&
    css`
      width: 100%;
    `}
`;

export const SiteLinkButton = styled(Link)`
  ${buttonBase}
  ${({ $variant }) => siteVariants[$variant] ?? siteVariants.primary}
`;

/** Understated text link with an underline that grows on hover. */
export const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 500;
  color: ${({ $onDark }) => ($onDark ? "var(--site-on-dark)" : "var(--site-ink)")};
  padding-bottom: 0.3rem;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size var(--duration-slow) var(--ease-out);

  &:hover {
    background-size: 100% 1px;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    transition: transform var(--duration) var(--ease);
  }
  &:hover svg {
    transform: translateX(3px);
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid
    ${({ $onDark }) => ($onDark ? "var(--site-line-dark)" : "var(--site-line)")};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ $gap }) => $gap ?? "var(--space-8)"};
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ $min }) => $min ?? "30rem"}, 1fr)
  );
`;
