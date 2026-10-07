import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type NotFoundPageProps = {
  title?: string;
  description?: string;
};

export function NotFoundPage({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved.",
}: NotFoundPageProps): ReactNode {
  return (
    <main className="status-page">
      <p className="status-page-code" aria-hidden="true">
        404
      </p>
      <h1 className="status-page-title">{title}</h1>
      <p className="status-page-text">{description}</p>
      <div className="status-page-actions">
        <Link to="/" className="ui-button ui-button-primary">
          Back to home
        </Link>
        <Link to="/products" className="ui-button ui-button-secondary">
          Browse products
        </Link>
      </div>
    </main>
  );
}

export function PageLoader(): ReactNode {
  return (
    <main className="status-page" aria-busy="true">
      <span className="status-loader" role="status">
        <span className="sr-only">Loading</span>
      </span>
      <p className="status-page-text">Loading…</p>
    </main>
  );
}
