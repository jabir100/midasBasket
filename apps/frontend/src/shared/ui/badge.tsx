import type { ReactNode } from "react";

export function Badge({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return <span className="ui-badge">{children}</span>;
}
