import { Container } from "@/customDiv/container";
import { Component } from "react";
import type { ReactNode } from "react";

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-20">
          <p className="mb-3">Something went wrong.</p>
          <button
            className="underline"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </Container>
      );
    }
    return this.props.children;
  }
}
