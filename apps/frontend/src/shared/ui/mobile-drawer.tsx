import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type MobileDrawerProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
};

export function MobileDrawer({
  children,
  isOpen,
  onClose,
  side = "left",
  title,
}: Readonly<MobileDrawerProps>): ReactNode {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mobile-drawer-root">
      <button
        type="button"
        className="mobile-drawer-backdrop"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={`mobile-drawer-panel mobile-drawer-panel-${side}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mobile-drawer-header">
          {title && <span className="mobile-drawer-title">{title}</span>}
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="mobile-drawer-content">{children}</div>
      </div>
    </div>
  );
}
