import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import {
  HiOutlineCheck,
  HiOutlineSquare2Stack,
  HiOutlineXMark,
} from "react-icons/hi2";
import { DEMO_ACCOUNTS, DEMO_NOTE } from "../../lib/demoAccounts";
import { signIn } from "../../services/auth";
import useFocusTrap from "../../hooks/useFocusTrap";
import notify from "../../lib/toast";
import { SiteButton, siteTokens } from "./primitives";

const Scrim = styled.div`
  /* Portalled to document.body, which is outside SiteRoot, so it has to carry
     the site palette with it. */
  ${siteTokens}
  font-family: var(--font-body);

  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: var(--space-5);
  background-color: rgba(10, 22, 15, 0.55);
  backdrop-filter: blur(3px);
  animation: fade var(--duration-slow) var(--ease-out);

  @keyframes fade {
    from {
      opacity: 0;
    }
  }
`;

const Panel = styled.div`
  position: relative;
  width: 100%;
  max-width: 52rem;
  max-height: calc(100dvh - var(--space-10));
  overflow-y: auto;
  background-color: var(--site-surface);
  color: var(--site-ink);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: rise var(--duration-slow) var(--ease-out);

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
  }
`;

const Head = styled.div`
  padding: var(--space-6) var(--space-6) var(--space-5);
  border-bottom: 1px solid var(--site-line);

  & h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-2xl);
    letter-spacing: -0.02em;
    padding-right: var(--space-8);
  }
  & p {
    margin-top: var(--space-2);
    color: var(--site-ink-soft);
    font-size: var(--text-md);
  }
`;

const Close = styled.button`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  border-radius: var(--radius-full);
  color: var(--site-ink-muted);
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease);

  & svg {
    width: 2rem;
    height: 2rem;
  }
  &:hover {
    background-color: var(--site-bg-alt);
    color: var(--site-ink);
  }
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);

  & + & {
    border-top: 1px solid var(--site-line);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr auto;

    & > *:last-child {
      grid-column: 1 / -1;
      justify-self: stretch;
    }
  }
`;

const Identity = styled.div`
  min-width: 0;

  & strong {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--site-accent);
  }
  & code {
    display: block;
    margin-top: 0.4rem;
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: var(--text-md);
    overflow-wrap: anywhere;
  }
  & span {
    display: block;
    margin-top: 0.3rem;
    font-size: var(--text-sm);
    color: var(--site-ink-muted);
  }
`;

const CopyButton = styled.button`
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--site-line);
  color: var(--site-ink-soft);
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
  &:hover {
    background-color: var(--site-bg-alt);
    color: var(--site-ink);
  }
`;

const Note = styled.p`
  padding: var(--space-4) var(--space-6);
  background-color: var(--site-bg-alt);
  color: var(--site-ink-soft);
  font-size: var(--text-sm);
  line-height: 1.6;
`;

/**
 * Offers the seeded staff logins to anyone landing on the home page, so the
 * dashboard can be looked at without an account. Rendered by Home, which owns
 * the once-per-browser decision; this component only draws it.
 */
export default function DemoAccountsDialog({ onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);
  const [pending, setPending] = useState(null);
  const panelRef = useFocusTrap(true, onClose);

  const { mutate: signInAs } = useMutation({
    mutationFn: signIn,
    onSuccess: () => navigate("/admin/dashboard", { replace: false }),
    onError: (error) => {
      setPending(null);
      notify.error(error.message);
    },
  });

  async function copyEmail(email) {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(email);
      setTimeout(() => setCopied((current) => (current === email ? null : current)), 1800);
    } catch {
      notify.error("Your browser would not let us reach the clipboard");
    }
  }

  return createPortal(
    <Scrim
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-accounts-title"
      >
        <Close type="button" onClick={onClose} aria-label="Close">
          <HiOutlineXMark />
        </Close>

        <Head>
          <h2 id="demo-accounts-title">Look around the dashboard</h2>
          <p>Each role sees a different dashboard. Pick one to sign in.</p>
        </Head>

        <ul>
          {DEMO_ACCOUNTS.map((account) => (
            <Row key={account.email}>
              <Identity>
                <strong>{account.role}</strong>
                <code>{account.email}</code>
                {account.blurb && <span>{account.blurb}</span>}
              </Identity>

              <CopyButton
                type="button"
                onClick={() => copyEmail(account.email)}
                aria-label={`Copy ${account.email}`}
              >
                {copied === account.email ? (
                  <HiOutlineCheck />
                ) : (
                  <HiOutlineSquare2Stack />
                )}
              </CopyButton>

              <SiteButton
                type="button"
                $variant="primary"
                disabled={pending !== null}
                onClick={() => {
                  setPending(account.email);
                  signInAs({ email: account.email, password: account.password });
                }}
              >
                {pending === account.email ? "Signing in…" : "Sign in"}
              </SiteButton>
            </Row>
          ))}
        </ul>

        {DEMO_NOTE && <Note>{DEMO_NOTE}</Note>}
      </Panel>
    </Scrim>,
    document.body
  );
}
