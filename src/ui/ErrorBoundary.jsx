import { Component } from "react";
import styled from "styled-components";
import Button from "./Button";

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-5);
  text-align: center;
`;

const Panel = styled.div`
  max-width: 52rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
`;

const Title = styled.h1`
  font-size: var(--text-xl);
`;

const Message = styled.p`
  color: var(--text-muted);
`;

const Details = styled.pre`
  width: 100%;
  margin-top: var(--space-3);
  padding: var(--space-3);
  overflow-x: auto;
  text-align: left;
  font-size: var(--text-xs);
  color: var(--danger-text);
  background-color: var(--surface-inset);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
`;

/**
 * Catches render-time crashes so a single bad component shows a recoverable
 * screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
    window.location.assign("/");
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <Wrapper>
        <Panel>
          <Title>This screen stopped responding</Title>
          <Message>
            The error has been logged to the console. Returning to the dashboard
            usually clears it.
          </Message>
          {import.meta.env.DEV && <Details>{String(error?.stack ?? error)}</Details>}
          <Button onClick={this.handleReset}>Back to dashboard</Button>
        </Panel>
      </Wrapper>
    );
  }
}
