"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, Transition } from "framer-motion";

interface HeroSectionProps {
  photoSrc?: string;
}

export default function HeroSection({ photoSrc }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const animationVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeOut" };

  const staggeredTransition = (delay: number): Transition =>
    prefersReducedMotion ? { duration: 0 } : { delay, duration: 0.4, ease: "easeOut" };

  return (
    <section id="hero" aria-label="Introduction" className="min-h-screen flex items-center py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-6 w-full flex flex-col-reverse md:flex-row items-center md:justify-between gap-16" data-testid="hero-layout">
        {/* Text Column */}
        <div
          className="flex flex-col items-center md:items-start text-center md:text-left"
          data-testid="hero-text-column"
        >
          <motion.span
            className="text-accent font-inter text-caption font-medium uppercase tracking-widest mb-5 md:mb-4"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={staggeredTransition(0)}
            data-testid="hero-eyebrow"
          >
            SOFTWARE ENGINEER
          </motion.span>

          <motion.h1
            className="text-white font-spaceGrotesk text-heroNameMobile md:text-heroName font-bold leading-tight tracking-[-0.03em] mb-6 md:mb-6"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={staggeredTransition(0.12)}
          >
            Harsh Mall
          </motion.h1>

          <motion.p
            className="text-text-muted font-inter text-lg md:text-xl leading-relaxed max-w-md mb-12 md:mb-12"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={staggeredTransition(0.24)}
          >
            I build things that matter.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={staggeredTransition(0.36)}
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-accent text-accent font-inter text-button font-medium tracking-wide
                         hover:bg-accent hover:text-black transition-colors duration-200
                         focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-3 focus-visible:rounded-full
                         active:scale-98 active:bg-accent/85"
              aria-label="View Harsh Mall's projects"
              data-testid="hero-cta"
            >
              View my work ↓
            </Link>
          </motion.div>
        </div>

        {/* Portrait Column */}
        <motion.div
          className="flex-shrink-0 w-[120px] h-[120px] md:w-[320px] md:h-[320px] rounded-full md:rounded-2xl border border-border bg-surface flex items-center justify-center
                     mb-6 md:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={staggeredTransition(0.2)}
          data-testid="hero-portrait-column"
        >
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt="Harsh Mall"
              width={320}
              height={320}
              priority
              sizes="(max-width: 768px) 120px, 320px"
              className="w-full h-full object-cover rounded-full md:rounded-2xl"
            />
          ) : (
            <span className="font-spaceGrotesk text-5xl md:text-6xl font-bold text-accent" data-testid="hero-portrait">
              HM
            </span>
          )}
        </motion.div>
      </div>
    </section>
  );
}