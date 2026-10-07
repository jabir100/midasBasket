import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { useSiteContact } from "../../features/contact/contact-api.js";
import {
  SocialLinkList,
  WhatsAppIcon,
  toTelHref,
  toWhatsAppHref,
} from "../../features/contact/social-platforms.js";

export function SiteFooter(): ReactNode {
  const year = new Date().getFullYear();
  const { data: contact } = useSiteContact();
  const details = contact?.details;

  return (
    <footer className="site-footer-black">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <img
            className="site-footer-logo"
            src="/favicon.png"
            alt="Midas Basket"
          />
          <span>Midas Basket</span>
          <p>Groceries and everyday essentials, delivered.</p>
          <SocialLinkList
            links={contact?.socialLinks ?? []}
            className="site-footer-social"
          />
        </div>

        <div className="site-footer-column">
          <h3>Shop</h3>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/brands">Brands</Link>
        </div>

        <div className="site-footer-column">
          <h3>Account</h3>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="site-footer-column">
          <h3>Support</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/track">Track Order</Link>
          <Link to="/login">Log In</Link>
          {details?.phone ? (
            <a className="site-footer-contact" href={toTelHref(details.phone)}>
              <Phone size={15} aria-hidden="true" />
              {details.phone}
            </a>
          ) : null}
          {details?.whatsapp ? (
            <a
              className="site-footer-contact"
              href={toWhatsAppHref(details.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={15} />
              WhatsApp
            </a>
          ) : null}
          {details?.email ? (
            <a className="site-footer-contact" href={`mailto:${details.email}`}>
              <Mail size={15} aria-hidden="true" />
              {details.email}
            </a>
          ) : null}
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} Midas Basket. All rights reserved.</span>
      </div>
    </footer>
  );
}
