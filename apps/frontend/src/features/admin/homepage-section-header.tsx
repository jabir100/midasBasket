import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function HomepageSectionHeader({
  title,
  description,
}: Readonly<{ title: string; description: string }>): ReactNode {
  return (
    <div className="section-heading">
      <div>
        <Link
          to="/admin/homepage"
          className="admin-back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.85rem",
            color: "var(--color-midas-gray)",
            marginBottom: "0.5rem",
          }}
        >
          <ChevronLeft size={16} />
          Homepage configuration
        </Link>
        <h3 className="admin-section-title">{title}</h3>
        <p className="admin-section-copy">{description}</p>
      </div>
    </div>
  );
}
