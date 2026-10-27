"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconUser } from "@/components/icons/icons";
import { brandHomeLabel, brandLogoWordmarkOnLight } from "@/constants/brand";
import type { StorefrontBrand, StorefrontNavLink, StorefrontShopCategory } from "@/constants/storefront";
import { SiteToast } from "@/features/navigation/site-toast";
import { BAG_EVENT } from "@/lib/bag-events";
import { SHOP_CATEGORIES } from "@/lib/content/homepage";

const SearchModal = dynamic(
  () => import("@/features/navigation/search-modal").then((mod) => mod.SearchModal),
  { ssr: false },
);
const MiniCart = dynamic(() => import("@/features/cart/mini-cart").then((mod) => mod.MiniCart), { ssr: false });

type FloatingHeaderProps = {
  isAuthenticated: boolean;
  cartCount: number;
  wishlistCount: number;
  brand?: StorefrontBrand;
  shopCategories?: StorefrontShopCategory[];
  headerLinks?: StorefrontNavLink[];
};

export function FloatingHeader({
  isAuthenticated,
  cartCount,
  wishlistCount,
  brand,
  shopCategories,
  headerLinks,
}: FloatingHeaderProps) {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const collectionsId = useId();
  const collectionsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const shopLinks = (shopCategories?.filter((item) => !item.hidden) ?? []).length
    ? shopCategories!.filter((item) => !item.hidden).map((item) => ({ id: item.id, label: item.title, href: item.href }))
    : SHOP_CATEGORIES.map((item) => ({ id: item.id, label: item.label, href: item.href }));
  const collectionLinks = shopLinks.filter((item) => item.id !== "all" && item.id !== "new");
  const visibleHeader = (headerLinks ?? []).filter((item) => !item.hidden);
  const aboutLink = visibleHeader.find((item) => /about/i.test(item.label) || item.path.includes("about")) ?? {
    label: "About",
    path: "/about-us",
  };
  const contactLink = visibleHeader.find((item) => /contact/i.test(item.label) || item.path.includes("contact")) ?? {
    label: "Contact",
    path: "/contact",
  };
  const logoSrc = brand?.logoOnLightSrc || brandLogoWordmarkOnLight;
  const homeLabel = brand?.siteName ? `${brand.siteName} home` : brandHomeLabel;

  useEffect(() => {
    const onBag = () => setBagOpen(true);
    window.addEventListener(BAG_EVENT, onBag);
    return () => window.removeEventListener(BAG_EVENT, onBag);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCollectionsOpen(false);
        setMenuOpen(false);
      }
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (collectionsRef.current && !collectionsRef.current.contains(target)) setCollectionsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="ha-float-header" data-float-header>
        <div className="ha-float-header__left">
          <button
            type="button"
            className="ha-float-icon ha-float-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
          <nav className="ha-float-nav" aria-label="Primary">
            <Link href="/collections/all">Shop All</Link>
            <Link href="/collections/new">New Arrival</Link>
            <div
              ref={collectionsRef}
              className="ha-float-nav__item"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                aria-expanded={collectionsOpen}
                aria-controls={collectionsId}
                aria-haspopup="menu"
                onClick={() => setCollectionsOpen((value) => !value)}
                onFocus={() => setCollectionsOpen(true)}
              >
                Collection
              </button>
              {collectionsOpen ? (
                <div id={collectionsId} className="ha-float-dropdown" role="menu">
                  {collectionLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setCollectionsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href={aboutLink.path}>{aboutLink.label}</Link>
            <Link href={contactLink.path}>{contactLink.label}</Link>
          </nav>
        </div>

        <Link href="/" className="ha-float-header__brand" aria-label={homeLabel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" height={26} />
        </Link>

        <div className="ha-float-header__right">
          <button
            type="button"
            className="ha-float-icon"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch />
          </button>
          <Link
            href="/wishlist"
            className="ha-float-icon ha-float-wish"
            aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : "Wishlist"}
          >
            <IconHeart />
            {wishlistCount > 0 ? <span className="ha-float-dot" aria-hidden="true" /> : null}
          </Link>
          <button
            type="button"
            className="ha-float-icon"
            aria-label={cartCount > 0 ? `Bag, ${cartCount} items` : "Bag"}
            aria-expanded={bagOpen}
            onClick={() => setBagOpen(true)}
          >
            <IconBag />
          </button>
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="ha-float-avatar"
            aria-label={isAuthenticated ? "Account" : "Sign in"}
          >
            <IconUser />
          </Link>
        </div>
      </header>

      {menuOpen ? (
        <div className="ha-float-drawer" ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu">
          <nav aria-label="Mobile">
            <Link href="/collections/all" onClick={() => setMenuOpen(false)}>
              Shop All
            </Link>
            <Link href="/collections/new" onClick={() => setMenuOpen(false)}>
              New Arrival
            </Link>
            <p>Collection</p>
            {collectionLinks.map((link) => (
              <Link key={`collection-${link.id}`} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={aboutLink.path} onClick={() => setMenuOpen(false)}>
              {aboutLink.label}
            </Link>
            <Link href={contactLink.path} onClick={() => setMenuOpen(false)}>
              {contactLink.label}
            </Link>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist
            </Link>
            <Link href={isAuthenticated ? "/account" : "/login"} onClick={() => setMenuOpen(false)}>
              {isAuthenticated ? "Account" : "Sign in"}
            </Link>
          </nav>
        </div>
      ) : null}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCart open={bagOpen} onClose={() => setBagOpen(false)} />
      <SiteToast />
    </>
  );
}
