import { Ban, Check } from "lucide-react";
import type { ReactNode } from "react";

const trackedStatuses = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
] as const;

const stepLabels: Record<(typeof trackedStatuses)[number], string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
};

export function TrackingStepper({
  status,
}: Readonly<{ status: string }>): ReactNode {
  if (status === "cancelled") {
    return (
      <div className="tracking-stepper tracking-stepper-cancelled">
        <span className="tracking-step-icon tone-danger">
          <Ban size={18} />
        </span>
        <strong>Order cancelled</strong>
      </div>
    );
  }

  const currentIndex = trackedStatuses.indexOf(
    status as (typeof trackedStatuses)[number],
  );

  return (
    <div className="tracking-stepper">
      {trackedStatuses.map((step, index) => {
        const isComplete = currentIndex >= 0 && index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div
            key={step}
            className={`tracking-step ${isComplete ? "complete" : ""} ${
              isCurrent ? "current" : ""
            }`}
          >
            <span className="tracking-step-connector" aria-hidden="true" />
            <span className="tracking-step-icon">
              {isComplete ? <Check size={16} /> : null}
            </span>
            <span className="tracking-step-label">{stepLabels[step]}</span>
          </div>
        );
      })}
    </div>
  );
}
