"use client";

import { useRouter } from "next/navigation";
import { Component, type ReactNode } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

type BoundaryProps = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
  /** Classes for the error state's box, so it keeps the widget's size and frame. */
  errorClassName?: string;
  children: ReactNode;
};

class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const content = (
      <ErrorState
        message={this.props.message}
        retryLabel={this.props.retryLabel}
        onRetry={() => {
          this.setState({ failed: false });
          this.props.onRetry();
        }}
      />
    );
    return <div className={this.props.errorClassName}>{content}</div>;
  }
}

/**
 * One widget's error state: the rest of the page keeps working. Retry
 * re-renders the widget and refetches the page's server data.
 */
export function WidgetBoundary(props: Omit<BoundaryProps, "onRetry">) {
  const router = useRouter();
  return <Boundary {...props} onRetry={() => router.refresh()} />;
}
