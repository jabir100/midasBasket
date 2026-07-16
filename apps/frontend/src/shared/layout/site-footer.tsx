import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteFooter(): ReactNode {
  const year = new Date().getFullYear();

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
          <p>Fast, secure, premium ecommerce foundation.</p>
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
          <Link to="/track">Track Order</Link>
          <Link to="/login">Log In</Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} Midas Basket. All rights reserved.</span>
      </div>
    </footer>
  );
}
