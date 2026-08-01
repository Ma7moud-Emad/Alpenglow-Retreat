import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageMeta from "../ui/PageMeta";

const Shell = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--topbar-height) 1fr;
  min-height: 100dvh;

  @media (max-width: 900px) {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }
`;

const Main = styled.main`
  grid-area: main;
  padding: var(--space-6) var(--space-5) var(--space-10);
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: var(--space-5) var(--space-4) var(--space-8);
  }
`;

const Container = styled.div`
  max-width: var(--content-max);
  margin: 0 auto;
`;

const SkipLink = styled.a`
  position: absolute;
  left: var(--space-3);
  top: -6rem;
  z-index: 100;
  padding: var(--space-2) var(--space-4);
  background-color: var(--accent);
  color: #fff;
  border-radius: var(--radius-sm);
  transition: top var(--duration) var(--ease);

  &:focus {
    top: var(--space-3);
  }
`;

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // A route change should never leave the mobile drawer covering the page.
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <Shell>
      <PageMeta title="Staff dashboard" path="/admin" noIndex />
      <SkipLink href="#main-content">Skip to content</SkipLink>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Main id="main-content" tabIndex={-1}>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </Shell>
  );
}
