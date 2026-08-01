import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";
import Wordmark from "./Wordmark";
import useAuth from "../../hooks/useAuth";
import { hasDemoAccounts } from "../../lib/demoAccounts";
import { Container, Divider } from "./primitives";

const Footer = styled.footer`
  background-color: var(--site-deep);
  color: var(--site-on-dark);
  padding-top: var(--space-20);
  padding-bottom: var(--space-8);
`;

const Top = styled.div`
  display: grid;
  gap: var(--space-12);
  grid-template-columns: 1.4fr 1fr 1fr;
  padding-bottom: var(--space-12);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
`;

const Brand = styled.div`
  max-width: 38ch;

  & p {
    margin-top: var(--space-5);
    color: var(--site-on-dark-soft);
    line-height: 1.7;
  }
`;

const ColumnTitle = styled.h3`
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--site-on-dark-soft);
  margin-bottom: var(--space-5);
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  & a {
    color: var(--site-on-dark-soft);
    transition: color var(--duration) var(--ease);
    &:hover {
      color: var(--site-on-dark);
    }
  }
`;

const ContactList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  & li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    color: var(--site-on-dark-soft);
    line-height: 1.6;
  }
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: var(--ember-400);
  }
  & a:hover {
    color: var(--site-on-dark);
  }
`;

/* Sits in the Explore list, so it has to pass for one of its links. */
const DemoLink = styled.button`
  font: inherit;
  color: inherit;
  padding: 0;
  text-align: left;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-top: var(--space-8);
  font-size: var(--text-sm);
  color: var(--site-on-dark-soft);
`;

export default function SiteFooter({ onOpenDemoAccounts }) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Footer>
      <Container>
        <Top>
          <Brand>
            <Wordmark />
            <p>
              Fifteen cabins on four hundred acres of pine and meadow, an hour
              past the last traffic light. Open all year.
            </p>
          </Brand>

          <div>
            <ColumnTitle>Explore</ColumnTitle>
            <LinkList>
              <li><Link to="/rooms">All rooms</Link></li>
              <li><Link to="/experience">The retreat</Link></li>
              <li><Link to="/contact">Check availability</Link></li>
              {!isLoading && (
                <li>
                  {isAuthenticated ? (
                    <Link to="/admin/dashboard">Dashboard</Link>
                  ) : (
                    <Link to="/signin">Staff login</Link>
                  )}
                </li>
              )}
              {hasDemoAccounts && (
                <li>
                  <DemoLink type="button" onClick={onOpenDemoAccounts}>
                    Demo accounts
                  </DemoLink>
                </li>
              )}
            </LinkList>
          </div>

          <div>
            <ColumnTitle>Find us</ColumnTitle>
            <ContactList>
              <li>
                <HiOutlineMapPin aria-hidden="true" />
                <span>
                  Alpenglow Retreat
                  <br />
                  Vale Road, Pine Hollow
                </span>
              </li>
              <li>
                <HiOutlinePhone aria-hidden="true" />
                <a href="tel:+15550142200">+1 555 014 2200</a>
              </li>
              <li>
                <HiOutlineEnvelope aria-hidden="true" />
                <a href="mailto:stay@alpenglow.test">stay@alpenglow.test</a>
              </li>
            </ContactList>
          </div>
        </Top>

        <Divider $onDark />

        <Bottom>
          <p>© {new Date().getFullYear()} Alpenglow Retreat. All rights reserved.</p>
          <p>Reception open 7am – 10pm daily</p>
        </Bottom>
      </Container>
    </Footer>
  );
}
