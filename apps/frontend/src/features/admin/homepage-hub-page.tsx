import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Home, Image, Sparkles, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { getAdminCarouselSlides, getHomepageSettings } from "./admin-api.js";

const sections: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  count: (
    carouselCount: number,
    popularCount: number,
    bestSellingCount: number,
  ) => number;
}[] = [
  {
    to: "/admin/homepage/carousel",
    icon: <Image size={20} />,
    title: "Carousel",
    description:
      "Upload, reorder by sort value, activate, or remove banner slides shown at the top of the storefront.",
    count: (carouselCount) => carouselCount,
  },
  {
    to: "/admin/homepage/popular-products",
    icon: <Sparkles size={20} />,
    title: "Popular products",
    description:
      "Pick which products appear in the storefront's \"Popular products\" slider, and in what order.",
    count: (_carouselCount, popularCount) => popularCount,
  },
  {
    to: "/admin/homepage/best-selling",
    icon: <TrendingUp size={20} />,
    title: "Most selling",
    description:
      "Pick which products appear in the storefront's \"Most selling\" slider, and in what order.",
    count: (_carouselCount, _popularCount, bestSellingCount) => bestSellingCount,
  },
  {
    to: "/admin/homepage/why-choose-us",
    icon: <Home size={20} />,
    title: "Why choose us",
    description: "Policy/value cards shown above the footer on the storefront.",
    count: () => 0,
  },
];

export function AdminHomepageHubPage(): ReactNode {
  const carouselQuery = useQuery({
    queryKey: ["admin", "carousel"],
    queryFn: getAdminCarouselSlides,
  });
  const homepageSettingsQuery = useQuery({
    queryKey: ["admin", "homepage", "settings"],
    queryFn: getHomepageSettings,
  });

  const carouselCount = carouselQuery.data?.length ?? 0;
  const popularCount = homepageSettingsQuery.data?.popularProductIds?.length ?? 0;
  const bestSellingCount =
    homepageSettingsQuery.data?.bestSellingProductIds?.length ?? 0;

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <div className="section-heading">
          <div>
            <h3 className="admin-section-title">Homepage configuration</h3>
            <p className="admin-section-copy">
              Manage the storefront carousel, curated product sliders, and the
              why-choose-us section.
            </p>
          </div>
        </div>

        <div className="admin-homepage-hub-grid" style={{ marginTop: "1.5rem" }}>
          {sections.map((section) => (
            <Link key={section.to} to={section.to} style={{ textDecoration: "none" }}>
              <Card className="dashboard-card admin-homepage-hub-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">{section.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ margin: 0 }}>{section.title}</h2>
                      <p className="form-muted" style={{ margin: "0.25rem 0 0" }}>
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight size={18} style={{ color: "var(--color-midas-gray)" }} />
                  </div>
                  {section.count(carouselCount, popularCount, bestSellingCount) > 0 ? (
                    <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                      <small className="admin-table-muted">
                        {section.count(carouselCount, popularCount, bestSellingCount)}{" "}
                        configured
                      </small>
                    </p>
                  ) : null}
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
