import { Modal } from "@heroui/react";
import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "./button.js";

type ConfirmOptions = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type PendingConfirm = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

let showConfirm: ((request: PendingConfirm) => void) | null = null;

/**
 * Themed replacement for `window.confirm`. Resolves `true` when the user
 * confirms, `false` when they cancel or dismiss. Requires <ConfirmDialogHost />.
 */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!showConfirm) {
      resolve(false);
      return;
    }
    showConfirm({ ...options, resolve });
  });
}

export function ConfirmDialogHost(): ReactNode {
  const [request, setRequest] = useState<PendingConfirm | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    showConfirm = (next) => {
      setRequest((current) => {
        current?.resolve(false);
        return next;
      });
      setIsOpen(true);
    };
    return () => {
      showConfirm = null;
    };
  }, []);

  const settle = (confirmed: boolean) => {
    request?.resolve(confirmed);
    setRequest((current) => (current === request ? null : current));
    setIsOpen(false);
  };

  const tone = request?.tone ?? "danger";

  return (
    <Modal.Root
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) settle(false);
      }}
    >
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog role="alertdialog" className="confirm-dialog">
            {request ? (
              <>
                <div
                  className={`confirm-dialog-icon confirm-dialog-icon-${tone}`}
                >
                  <TriangleAlert size={22} />
                </div>
                <Modal.Header>
                  <Modal.Heading className="confirm-dialog-title">
                    {request.title}
                  </Modal.Heading>
                </Modal.Header>
                {request.description ? (
                  <Modal.Body>
                    <p className="confirm-dialog-description">
                      {request.description}
                    </p>
                  </Modal.Body>
                ) : null}
                <Modal.Footer className="confirm-dialog-actions">
                  <Button
                    tone="secondary"
                    onClick={() => {
                      settle(false);
                    }}
                  >
                    {request.cancelLabel ?? "Cancel"}
                  </Button>
                  <Button
                    tone="primary"
                    autoFocus
                    onClick={() => {
                      settle(true);
                    }}
                  >
                    {request.confirmLabel ?? "Confirm"}
                  </Button>
                </Modal.Footer>
              </>
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
