import {
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Toaster as SonnerToaster } from "sonner";

export { toast } from "sonner";

/** App-wide toast host, styled with the Midas theme (see `.midas-toast` in app.css). */
export function Toaster(): ReactNode {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      visibleToasts={4}
      gap={10}
      icons={{
        success: <CircleCheck size={18} />,
        error: <CircleAlert size={18} />,
        warning: <TriangleAlert size={18} />,
        info: <Info size={18} />,
        loading: <LoaderCircle size={18} className="midas-toast-spin" />,
        close: <X size={14} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "midas-toast",
          icon: "midas-toast-icon",
          content: "midas-toast-content",
          title: "midas-toast-title",
          description: "midas-toast-description",
          closeButton: "midas-toast-close",
          actionButton: "midas-toast-action",
          cancelButton: "midas-toast-cancel",
          success: "midas-toast-success",
          error: "midas-toast-error",
          warning: "midas-toast-warning",
          info: "midas-toast-info",
          loading: "midas-toast-loading",
        },
      }}
    />
  );
}
