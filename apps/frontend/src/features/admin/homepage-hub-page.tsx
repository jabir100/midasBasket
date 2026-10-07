import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Contact,
  Home,
  Image,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { AdminPageShell } from "./admin-page-shell.js";
import {
  getAdminCarouselSlides,
  getHomepageSettings,
  listAdminSocialLinks,
} from "./admin-api.js";

type SectionCounts = {
  carousel: number;
  popular: number;
  bestSelling: number;
  socialLinks: number;
};

const sections: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  count: (counts: SectionCounts) => number;
}[] = [
  {
    to: "/admin/homepage/carousel",
    icon: <Image size={20} />,
    title: "Carousel",
    description:
      "Upload, reorder by sort value, activate, or remove banner slides shown at the top of the storefront.",
    count: (counts) => counts.carousel,
  },
  {
    to: "/admin/homepage/popular-products",
    icon: <Sparkles size={20} />,
    title: "Popular products",
    description:
      "Pick which products appear in the storefront's \"Popular products\" slider, and in what order.",
    count: (counts) => counts.popular,
  },
  {
    to: "/admin/homepage/best-selling",
    icon: <TrendingUp size={20} />,
    title: "Most selling",
    description:
      "Pick which products appear in the storefront's \"Most selling\" slider, and in what order.",
    count: (counts) => counts.bestSelling,
  },
  {
    to: "/admin/homepage/why-choose-us",
    icon: <Home size={20} />,
    title: "Why choose us",
    description: "Policy/value cards shown above the footer on the storefront.",
    count: () => 0,
  },
  {
    to: "/admin/homepage/social-links",
    icon: <Share2 size={20} />,
    title: "Social media",
    description:
      "Add, edit, hide, or remove social profile links shown in the footer and on the contact page.",
    count: (counts) => counts.socialLinks,
  },
  {
    to: "/admin/homepage/contact-details",
    icon: <Contact size={20} />,
    title: "Contact details",
    description:
      "Phone, WhatsApp, email, address, and business hours shown on the contact page and in the footer.",
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
  const socialLinksQuery = useQuery({
    queryKey: ["admin", "social-links"],
    queryFn: listAdminSocialLinks,
  });

  const counts: SectionCounts = {
    carousel: carouselQuery.data?.length ?? 0,
    popular: homepageSettingsQuery.data?.popularProductIds?.length ?? 0,
    bestSelling: homepageSettingsQuery.data?.bestSellingProductIds?.length ?? 0,
    socialLinks: socialLinksQuery.data?.length ?? 0,
  };

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <div className="section-heading">
          <div>
            <h3 className="admin-section-title">Homepage configuration</h3>
            <p className="admin-section-copy">
              Edit what customers see on the homepage, contact page, and
              footer.
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
                  {section.count(counts) > 0 ? (
                    <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                      <small className="admin-table-muted">
                        {section.count(counts)} configured
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
