import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTone = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  endContent?: ReactNode;
  iconOnly?: boolean;
  startContent?: ReactNode;
  tone?: ButtonTone;
};

export function Button({
  children,
  className,
  endContent,
  iconOnly = false,
  startContent,
  tone = "secondary",
  type = "button",
  ...props
}: ButtonProps): ReactNode {
  const classes = [
    "ui-button",
    `ui-button-${tone}`,
    iconOnly ? "ui-button-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {startContent}
      <span className={iconOnly ? "sr-only" : undefined}>{children}</span>
      {endContent}
    </button>
  );
}
