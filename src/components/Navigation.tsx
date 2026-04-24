"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, Transition } from "framer-motion";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavigationProps {
  activeSection?: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const menuTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 border-b border-border transition-colors duration-300
        ${scrolled ? "bg-black/95 backdrop-blur-md" : "bg-black/85 backdrop-blur-md"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 } as Transition}
    >
      <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-spaceGrotesk text-lg font-bold hover:text-accent transition-colors"
          data-testid="nav-logo"
        >
          HM
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8" data-testid="nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-text-muted font-inter text-sm font-medium hover:text-text-primary transition-colors
                ${activeSection === link.href.substring(1) ? "text-accent" : ""}
              `}
              data-testid={activeSection === link.href.substring(1) ? "nav-link-active" : undefined}
              data-active={activeSection === link.href.substring(1) ? "true" : undefined}
            >
              {link.label}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-accent"
                  layoutId="activeNavIndicator"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2 rounded focus-visible:outline focus-visible:outline-accent"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open mobile navigation"
          data-testid="nav-hamburger"
        >
          <span className="w-5 h-0.5 bg-white" />
          <span className="w-5 h-0.5 bg-white" />
          <span className="w-5 h-0.5 bg-white" />
        </button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center space-y-6 md:hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              transition={menuTransition}
              data-testid="nav-mobile-overlay"
            >
              <button
                className="absolute top-6 right-6 text-white text-3xl p-2 rounded focus-visible:outline focus-visible:outline-accent"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile navigation"
                data-testid="nav-close"
              >
                &times;
              </button>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white font-inter text-2xl font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}