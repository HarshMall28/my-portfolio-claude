/**
 * RED PHASE — HeroSection tests
 * These tests MUST FAIL until Arjun implements src/components/HeroSection.tsx
 * Design spec: .claude/skills/designer-priya/references/design-spec.md §4
 */
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Component under test — does not exist yet (RED)
import HeroSection from "@/components/HeroSection";

// Mock framer-motion so animations don't block jsdom
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    a: ({
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props}>{children}</a>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  useReducedMotion: vi.fn().mockReturnValue(false),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: {
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

describe("HeroSection — structure and semantics", () => {
  it("renders a section with id='hero' and correct aria-label", () => {
    render(<HeroSection />);
    const section = document.querySelector("section#hero");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-label", "Introduction");
  });

  it("renders exactly one h1 containing the name 'Harsh Mall'", () => {
    render(<HeroSection />);
    const h1s = document.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Harsh Mall");
  });

  it("renders eyebrow label 'SOFTWARE ENGINEER' as a non-heading element", () => {
    render(<HeroSection />);
    const eyebrow = screen.getByTestId("hero-eyebrow");
    expect(eyebrow).toBeInTheDocument();
    expect(eyebrow.tagName).not.toMatch(/^H[1-6]$/);
    expect(eyebrow).toHaveTextContent("SOFTWARE ENGINEER");
  });

  it("renders the tagline placeholder text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("I build things that matter.")
    ).toBeInTheDocument();
  });
});

describe("HeroSection — CTA button", () => {
  it("renders CTA with aria-label='View Harsh Mall's projects'", () => {
    render(<HeroSection />);
    const cta = screen.getByTestId("hero-cta");
    expect(cta).toHaveAttribute("aria-label", "View Harsh Mall's projects");
  });

  it("CTA links to #projects", () => {
    render(<HeroSection />);
    const cta = screen.getByTestId("hero-cta");
    expect(cta).toHaveAttribute("href", "#projects");
  });

  it("CTA is an anchor element for correct semantics", () => {
    render(<HeroSection />);
    const cta = screen.getByTestId("hero-cta");
    expect(cta.tagName).toBe("A");
  });

  it("CTA contains 'View my work' text", () => {
    render(<HeroSection />);
    const cta = screen.getByTestId("hero-cta");
    expect(cta).toHaveTextContent(/view my work/i);
  });
});

describe("HeroSection — portrait", () => {
  it("renders the portrait container", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-portrait")).toBeInTheDocument();
  });

  it("shows 'HM' initials placeholder when no photoSrc provided", () => {
    render(<HeroSection />);
    const portrait = screen.getByTestId("hero-portrait");
    expect(portrait).toHaveTextContent("HM");
  });

  it("renders Next.js Image with alt='Harsh Mall' when photoSrc is provided", () => {
    render(<HeroSection photoSrc="/harsh.jpg" />);
    expect(screen.getByAltText("Harsh Mall")).toBeInTheDocument();
  });
});

describe("HeroSection — reduced motion", () => {
  it("renders all 4 content elements when prefers-reduced-motion is active", async () => {
    const { useReducedMotion } = await import("framer-motion");
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<HeroSection />);

    expect(screen.getByTestId("hero-eyebrow")).toBeInTheDocument();
    expect(document.querySelector("h1")).toBeInTheDocument();
    expect(
      screen.getByText("I build things that matter.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("hero-cta")).toBeInTheDocument();
  });
});

describe("HeroSection — two-column layout", () => {
  it("has a layout container with text column and portrait column", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-layout")).toBeInTheDocument();
    expect(screen.getByTestId("hero-text-column")).toBeInTheDocument();
    expect(screen.getByTestId("hero-portrait-column")).toBeInTheDocument();
  });
});
