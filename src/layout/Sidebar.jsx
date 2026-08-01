import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineCog6Tooth,
  HiOutlineHomeModern,
  HiOutlineInbox,
  HiOutlineUsers,
} from "react-icons/hi2";
import useAuth from "../hooks/useAuth";
import useFocusTrap from "../hooks/useFocusTrap";
import { useNewRequestCount } from "../hooks/useRequests";
import Logo from "./Logo";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <HiOutlineChartPie /> },
  { to: "/admin/requests", label: "Enquiries", icon: <HiOutlineInbox />, badge: true },
  { to: "/admin/bookings", label: "Bookings", icon: <HiOutlineCalendarDays /> },
  { to: "/admin/cabins", label: "Cabins", icon: <HiOutlineHomeModern /> },
  { to: "/admin/team", label: "Team", icon: <HiOutlineUsers />, adminOnly: true },
  { to: "/admin/settings", label: "Settings", icon: <HiOutlineCog6Tooth /> },
];

const Aside = styled.aside`
  grid-area: sidebar;
  /* Pinned to the viewport: the page scrolls under it rather than taking the
     navigation with it. Its own overflow keeps long nav lists reachable on
     short screens. */
  position: sticky;
  top: 0;
  align-self: start;
  height: 100dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  width: var(--sidebar-width);
  padding: var(--space-5) var(--space-4);
  background-color: var(--surface);
  border-right: 1px solid var(--border);

  @media (max-width: 900px) {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 60;
    transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
    transition: transform var(--duration) var(--ease);
    box-shadow: ${({ $open }) => ($open ? "var(--shadow-xl)" : "none")};
  }
`;

const Scrim = styled.div`
  display: none;

  @media (max-width: 900px) {
    ${({ $open }) =>
      $open &&
      css`
        display: block;
        position: fixed;
        inset: 0;
        z-index: 55;
        background-color: var(--scrim);
      `}
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-secondary);
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease);

  & svg {
    width: 2.1rem;
    height: 2.1rem;
    color: var(--text-muted);
    transition: color var(--duration) var(--ease);
  }

  &:hover {
    background-color: var(--surface-hover);
    color: var(--text);
  }

  &.active {
    background-color: var(--accent-soft);
    color: var(--accent-soft-text);
    font-weight: 600;
  }
  &.active svg {
    color: var(--accent);
  }
`;

/** Unread-style badge on the Enquiries item. */
const Count = styled.span`
  margin-left: auto;
  min-width: 2.2rem;
  padding: 0.1rem 0.6rem;
  border-radius: var(--radius-full);
  background-color: var(--ember-500);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  text-align: center;
`;

const ViewSite = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding: var(--space-3);
  border-top: 1px solid var(--border);
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: color var(--duration) var(--ease);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
  &:hover {
    color: var(--accent);
  }
`;

const SectionLabel = styled.p`
  padding: 0 var(--space-3);
  margin-bottom: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
`;

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();
  // Only a trap below 900px, where the sidebar becomes an overlay drawer.
  const drawerRef = useFocusTrap(isOpen, onClose);
  const { data: newRequests = 0 } = useNewRequestCount();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      <Scrim $open={isOpen} onClick={onClose} aria-hidden="true" />
      {/* Only a dialog in the drawer state; isOpen is set by the topbar burger,
          which exists only below 900px. */}
      <Aside
        ref={drawerRef}
        $open={isOpen}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
        aria-label={isOpen ? "Navigation" : undefined}
      >
        <Logo />
        <nav aria-label="Main">
          <SectionLabel>Operations</SectionLabel>
          <NavList>
            {items.map((item) => (
              <li key={item.to}>
                <StyledNavLink to={item.to} onClick={onClose}>
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && newRequests > 0 && (
                    <Count aria-label={`${newRequests} new`}>{newRequests}</Count>
                  )}
                </StyledNavLink>
              </li>
            ))}
          </NavList>
        </nav>

        <ViewSite href="/" target="_blank" rel="noreferrer">
          <HiOutlineArrowTopRightOnSquare />
          <span>View the website</span>
        </ViewSite>
      </Aside>
    </>
  );
}
