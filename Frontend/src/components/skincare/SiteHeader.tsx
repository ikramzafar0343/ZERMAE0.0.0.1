"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { IconBag, IconSearch, IconUser } from "@/components/icons/icons";
import { brandHomeLabel, brandLogoWordmark, brandMark, brandName } from "@/constants/brand";
import { SiteToast } from "@/features/navigation/site-toast";
import { BAG_EVENT } from "@/lib/bag-events";

const SearchModal = dynamic(
  () => import("@/features/navigation/search-modal").then((mod) => mod.SearchModal),
  { ssr: false },
);
const MiniCart = dynamic(() => import("@/features/cart/mini-cart").then((mod) => mod.MiniCart), { ssr: false });

gsap.registerPlugin(useGSAP);

type SiteHeaderProps = {
  isAuthenticated: boolean;
  cartCount: number;
};

export function SiteHeader({ isAuthenticated, cartCount }: SiteHeaderProps) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onBag = () => setBagOpen(true);
    window.addEventListener(BAG_EVENT, onBag);
    return () => window.removeEventListener(BAG_EVENT, onBag);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("skin-hero");
      const threshold = hero ? hero.offsetHeight - 80 : 500;
      setSolid(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const links = panel.querySelectorAll("a, button.skin-mobile-link");
    tlRef.current = gsap
      .timeline({ paused: true })
      .fromTo(panel, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.65, ease: "power3.out" })
      .fromTo(links, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.055, ease: "power3.out" }, 0.12);
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      panelRef.current?.classList.add("is-open");
      tl.play(0);
    } else {
      document.body.style.overflow = "";
      tl.reverse();
      const onComplete = () => panelRef.current?.classList.remove("is-open");
      if (tl.reversed()) {
        tl.eventCallback("onReverseComplete", onComplete);
      } else {
        onComplete();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <header className={`skin-header${solid ? " is-solid" : ""}`} data-skin-header>
        <div className="skin-header__inner">
          <div className="skin-header__left">
            <button
              ref={toggleRef}
              type="button"
              className="skin-icon-btn skin-menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              Menu
            </button>
            <nav className="skin-nav-desktop" aria-label="Primary" data-header-nav>
              <Link href="/collections/all" className="skin-nav-link">
                Shop
              </Link>
              <Link href="/collections/serums" className="skin-nav-link">
                Collections
              </Link>
              <Link href="/about-us" className="skin-nav-link">
                Our Story
              </Link>
            </nav>
          </div>

          <Link href="/" className="skin-header__brand" aria-label={brandHomeLabel} data-header-brand>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brandLogoWordmark} alt={brandName} />
          </Link>

          <div className="skin-header__right" data-header-actions>
            <Link href="/about-us" className="skin-nav-link skin-nav-desktop">
              Journal
            </Link>
            <button type="button" className="skin-icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="skin-icon-btn skin-nav-desktop"
              aria-label={isAuthenticated ? "Account" : "Sign in"}
            >
              <IconUser />
            </Link>
            <button
              type="button"
              className="skin-icon-btn"
              aria-label={cartCount > 0 ? `Bag, ${cartCount} items` : "Bag"}
              onClick={() => setBagOpen(true)}
            >
              <IconBag />
              {cartCount > 0 ? <span className="skin-bag-count">{cartCount > 9 ? "9+" : cartCount}</span> : null}
            </button>
          </div>
        </div>
      </header>

      <div ref={panelRef} className="skin-mobile-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <button type="button" className="skin-mobile-close" onClick={closeMenu}>
          Close
        </button>
        <nav ref={linksRef} aria-label="Mobile">
          <Link href="/collections/all" onClick={closeMenu}>
            Shop
          </Link>
          <Link href="/collections/serums" onClick={closeMenu}>
            Collections
          </Link>
          <Link href="/about-us" onClick={closeMenu}>
            Our Story
          </Link>
          <Link href="/about-us" onClick={closeMenu}>
            Journal
          </Link>
          <button
            type="button"
            className="skin-mobile-link"
            onClick={() => {
              closeMenu();
              setSearchOpen(true);
            }}
          >
            Search
          </button>
          <Link href={isAuthenticated ? "/account" : "/login"} onClick={closeMenu}>
            {isAuthenticated ? "Account" : "Sign in"}
          </Link>
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCart open={bagOpen} onClose={() => setBagOpen(false)} />
      <SiteToast />
      <span className="sr-only">{brandMark}</span>
    </>
  );
}
