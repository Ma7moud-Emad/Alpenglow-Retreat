import { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import SiteHeader from "./ui/SiteHeader";
import SiteFooter from "./ui/SiteFooter";
import { SiteRoot } from "./ui/primitives";
import { hasDemoAccounts } from "../lib/demoAccounts";

/* Only ever rendered once per browser, so it has no business in the bundle
   everyone downloads. */
const DemoAccountsDialog = lazy(() => import("./ui/DemoAccountsDialog"));

const SEEN_KEY = "alpenglow.demo-accounts.seen";

/** localStorage throws outright in some privacy modes, so never trust it. */
function hasSeenDialog() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

function rememberDialog() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* Nothing to do: it reappears next visit, which is not harmful. */
  }
}

const Main = styled.main`
  /* The home hero sits under the fixed transparent header; every other page
     starts below it. */
  padding-top: ${({ $flush }) => ($flush ? "0" : "8.4rem")};

  @media (max-width: 900px) {
    padding-top: ${({ $flush }) => ($flush ? "0" : "7.2rem")};
  }
`;

const SkipLink = styled.a`
  position: absolute;
  left: var(--space-4);
  top: -8rem;
  z-index: 100;
  padding: var(--space-3) var(--space-5);
  background-color: var(--site-accent);
  color: #fff;
  border-radius: var(--radius-full);
  transition: top var(--duration) var(--ease);

  &:focus {
    top: var(--space-4);
  }
`;

export default function SiteLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Router navigation preserves scroll position by default, which lands you
  // halfway down a page you have never seen.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // First landing on the home page, and only the first. Held back a beat so it
  // arrives after the hero rather than on top of it.
  useEffect(() => {
    if (!hasDemoAccounts || !isHome || hasSeenDialog()) return undefined;

    const timer = setTimeout(() => setIsDemoOpen(true), 700);
    return () => clearTimeout(timer);
  }, [isHome]);

  function closeDemo() {
    setIsDemoOpen(false);
    rememberDialog();
  }

  return (
    <SiteRoot>
      <SkipLink href="#site-main">Skip to content</SkipLink>
      <SiteHeader />
      <Main id="site-main" $flush={isHome}>
        <Outlet />
      </Main>
      <SiteFooter onOpenDemoAccounts={() => setIsDemoOpen(true)} />

      {isDemoOpen && (
        <Suspense fallback={null}>
          <DemoAccountsDialog onClose={closeDemo} />
        </Suspense>
      )}
    </SiteRoot>
  );
}
