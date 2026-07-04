import type { ReactNode } from "react";

export function Chip({
  children,
  startContent,
}: Readonly<{ children: ReactNode; startContent?: ReactNode }>): ReactNode {
  return (
    <span className="ui-chip">
      {startContent}
      {children}
    </span>
  );
}
