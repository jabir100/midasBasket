import { Toast } from "@heroui/react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";

type ToastVariant = "default" | "accent" | "success" | "warning" | "danger";
type ToastOptions = Parameters<typeof Toast.toast.success>[1];

const variantIcons: Record<ToastVariant, ReactNode> = {
  default: <Info size={18} />,
  accent: <Info size={18} />,
  success: <CircleCheck size={18} />,
  warning: <TriangleAlert size={18} />,
  danger: <CircleAlert size={18} />,
};

const placement = "bottom end";

/** Thin wrapper over HeroUI's toast queue so call sites stay library-agnostic. */
export const toast = {
  success: (message: ReactNode, options?: ToastOptions) =>
    Toast.toast.success(message, options),
  error: (message: ReactNode, options?: ToastOptions) =>
    Toast.toast.danger(message, options),
  warning: (message: ReactNode, options?: ToastOptions) =>
    Toast.toast.warning(message, options),
  info: (message: ReactNode, options?: ToastOptions) =>
    Toast.toast.info(message, options),
};

/** App-wide toast host, rendered with the Midas theme (see `.midas-toast` in app.css). */
export function Toaster(): ReactNode {
  return (
    <Toast.Provider placement={placement} width={380} gap={10}>
      {({ toast: queued }) => {
        const { actionProps, description, indicator, isLoading, title } =
          queued.content;
        const variant = queued.content.variant ?? "default";

        return (
          <Toast
            toast={queued}
            placement={placement}
            variant={variant}
            className={`midas-toast midas-toast-${variant}`}
          >
            {indicator === null ? null : (
              <Toast.Indicator className="midas-toast-icon">
                {isLoading ? (
                  <LoaderCircle size={18} className="midas-toast-spin" />
                ) : (
                  (indicator ?? variantIcons[variant])
                )}
              </Toast.Indicator>
            )}
            <Toast.Content className="midas-toast-content">
              {title ? (
                <Toast.Title className="midas-toast-title">{title}</Toast.Title>
              ) : null}
              {description ? (
                <Toast.Description className="midas-toast-description">
                  {description}
                </Toast.Description>
              ) : null}
            </Toast.Content>
            {actionProps?.children ? (
              <Toast.ActionButton
                {...actionProps}
                className="midas-toast-action"
              />
            ) : null}
            <Toast.CloseButton className="midas-toast-close" />
          </Toast>
        );
      }}
    </Toast.Provider>
  );
}
