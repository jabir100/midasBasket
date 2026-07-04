import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>): ReactNode {
  return (
    <article className={["ui-card", className].filter(Boolean).join(" ")}>
      {children}
    </article>
  );
}

export function CardBody({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return <div className="ui-card-body">{children}</div>;
}
