import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import Wordmark from "./Wordmark";
import useAuth from "../../hooks/useAuth";
import useFocusTrap from "../../hooks/useFocusTrap";
import { Container, SiteLinkButton } from "./primitives";

const NAV = [
  { to: "/rooms", label: "Rooms" },
  { to: "/experience", label: "The retreat" },
  { to: "/contact", label: "Contact" },
];

const Header = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  transition: background-color var(--duration-slow) var(--ease-out),
    box-shadow var(--duration-slow) var(--ease-out),
    color var(--duration-slow) var(--ease-out);

  /* Over the hero the header is transparent and light; once the page scrolls
     it becomes an opaque bar so the links stay legible over content. */
  ${({ $solid }) =>
    $solid
      ? css`
          background-color: rgba(251, 249, 245, 0.92);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--site-line);
          color: var(--site-ink);
        `
      : css`
          background-color: transparent;
          color: var(--site-on-dark);
        `}
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  height: 8.4rem;

  @media (max-width: 900px) {
    height: 7.2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-8);

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  position: relative;
  font-size: var(--text-base);
  font-weight: 500;
  padding-block: 0.6rem;
  opacity: 0.85;
  transition: opacity var(--duration) var(--ease);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 0;
    background-color: currentColor;
    transition: width var(--duration-slow) var(--ease-out);
  }

  &:hover {
    opacity: 1;
  }
  &:hover::after,
  &.active::after {
    width: 100%;
  }
  &.active {
    opacity: 1;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);

  @media (max-width: 900px) {
    display: none;
  }
`;

const StaffLink = styled(NavLink)`
  font-size: var(--text-sm);
  opacity: 0.65;
  transition: opacity var(--duration) var(--ease);
  &:hover {
    opacity: 1;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const Burger = styled.button`
  display: none;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  margin-right: -1rem;
  color: inherit;

  & svg {
    width: 2.6rem;
    height: 2.6rem;
  }

  @media (max-width: 900px) {
    display: grid;
  }
`;

const Drawer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background-color: var(--site-deep);
  color: var(--site-on-dark);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
`;

const DrawerTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
`;

const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-10);
  flex: 1;

  & a {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 400;
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--site-line-dark);
  }
`;

const DrawerFoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
`;

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const drawerRef = useFocusTrap(isMenuOpen, () => setIsMenuOpen(false));

  // Someone already signed in has no use for a login link, so it becomes the
  // way back into their dashboard. Held back until the session has been
  // restored, otherwise staff see "Staff login" flash before it corrects.
  const staffLink = isAuthenticated
    ? { to: "/admin/dashboard", label: "Dashboard" }
    : { to: "/signin", label: "Staff login" };

  // Only the home page has a full-bleed dark hero for the header to sit over;
  // every other page starts with content, so the bar is solid from the top.
  const hasHero = pathname === "/";
  const isSolid = isScrolled || !hasHero;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <Header $solid={isSolid}>
        <Container>
          <Bar>
            <Wordmark compact />

            <Nav aria-label="Primary">
              {NAV.map((item) => (
                <NavItem key={item.to} to={item.to}>
                  {item.label}
                </NavItem>
              ))}
            </Nav>

            <Actions>
              {!isAuthLoading && (
                <StaffLink to={staffLink.to}>{staffLink.label}</StaffLink>
              )}
              <SiteLinkButton
                to="/contact"
                $variant={isSolid ? "primary" : "outline-light"}
              >
                Check availability
              </SiteLinkButton>
            </Actions>

            <Burger
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <HiOutlineBars3 />
            </Burger>
          </Bar>
        </Container>
      </Header>

      {isMenuOpen && (
        <Drawer ref={drawerRef} role="dialog" aria-modal="true" aria-label="Menu">
          <DrawerTop>
            <Wordmark compact />
            <Burger
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              style={{ display: "grid" }}
            >
              <HiOutlineXMark />
            </Burger>
          </DrawerTop>

          <DrawerNav aria-label="Primary">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </DrawerNav>

          <DrawerFoot>
            <SiteLinkButton to="/contact" $variant="primary">
              Check availability
            </SiteLinkButton>
            {!isAuthLoading && (
              <NavLink
                to={staffLink.to}
                style={{ opacity: 0.7, textAlign: "center" }}
              >
                {staffLink.label}
              </NavLink>
            )}
          </DrawerFoot>
        </Drawer>
      )}
    </>
  );
}
