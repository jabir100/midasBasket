import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLElement> & { children: ReactNode }>): ReactNode {
  return (
    <article className={["ui-card", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </article>
  );
}

export function CardBody({
  children,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement> & { children: ReactNode }>): ReactNode {
  return <div className="ui-card-body" {...props}>{children}</div>;
}
