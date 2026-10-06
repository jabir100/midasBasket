import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { fetchSiteContact } from "../features/contact/contact-api.js";
import { ContactPage } from "../features/contact/contact-page.js";
import { pageSeo } from "../shared/seo/seo.js";

export const Route = createFileRoute("/contact")({
  /*
   * Contact channels are rendered on the server for SEO. If they cannot be
   * loaded the form must still work, so a failure renders the page without them.
   */
  loader: () => fetchSiteContact().catch(() => null),
  head: () =>
    pageSeo({
      title: "Contact Us | Midas Basket",
      description:
        "Get in touch with Midas Basket by phone, WhatsApp, email, or our contact form. We're happy to help with orders, products, and bulk buying.",
      path: "/contact",
    }),
  component: ContactRoute,
});

function ContactRoute(): ReactNode {
  const contact = Route.useLoaderData();
  return <ContactPage initialContact={contact} />;
}
