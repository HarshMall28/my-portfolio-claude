/**
 * RED PHASE — Navigation tests
 * These tests MUST FAIL until Arjun implements src/components/Navigation.tsx
 * Design spec: .claude/skills/designer-priya/references/design-spec.md §3
 */
import { render, screen, within, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Component under test — does not exist yet (RED)
import Navigation from "@/components/Navigation";

// Minimal IntersectionObserver mock for jsdom
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

// matchMedia stub (jsdom has no layout engine)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

describe("Navigation — structure", () => {
  it("renders a <nav> element", () => {
    render(<Navigation />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the 'HM' logo link", () => {
    render(<Navigation />);
    const logo = screen.getByTestId("nav-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent("HM");
  });

  it("renders all 4 desktop nav links with correct labels", () => {
    render(<Navigation />);
    const desktopNav = screen.getByTestId("nav-links-desktop");
    for (const { label } of NAV_LINKS) {
      expect(within(desktopNav).getByText(label)).toBeInTheDocument();
    }
  });

  it("each nav link has the correct href", () => {
    render(<Navigation />);
    const desktopNav = screen.getByTestId("nav-links-desktop");
    for (const { label, href } of NAV_LINKS) {
      const link = within(desktopNav).getByText(label).closest("a");
      expect(link).toHaveAttribute("href", href);
    }
  });
});

describe("Navigation — mobile hamburger overlay", () => {
  it("renders hamburger button", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-hamburger")).toBeInTheDocument();
  });

  it("mobile overlay is not in the document by default", () => {
    render(<Navigation />);
    expect(screen.queryByTestId("nav-mobile-overlay")).not.toBeInTheDocument();
  });

  it("clicking hamburger opens the mobile overlay", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByTestId("nav-hamburger"));
    expect(screen.getByTestId("nav-mobile-overlay")).toBeVisible();
  });

  it("mobile overlay contains all 4 nav links", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByTestId("nav-hamburger"));
    const overlay = screen.getByTestId("nav-mobile-overlay");
    for (const { label } of NAV_LINKS) {
      expect(within(overlay).getByText(label)).toBeInTheDocument();
    }
  });

  it("clicking the close button hides the overlay", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByTestId("nav-hamburger"));
    const overlay = await screen.findByTestId("nav-mobile-overlay");
    expect(overlay).toBeVisible();
    await user.click(screen.getByTestId("nav-close"));
    await waitForElementToBeRemoved(overlay);
    expect(screen.queryByTestId("nav-mobile-overlay")).not.toBeInTheDocument();
  });

  it("hamburger button has an aria-label", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-hamburger")).toHaveAttribute("aria-label");
  });
});

describe("Navigation — active section state", () => {
  it("no link is marked active by default", () => {
    render(<Navigation />);
    expect(document.querySelectorAll("[data-testid='nav-link-active']")).toHaveLength(0);
  });

  it("marks the correct link active when activeSection prop is 'projects'", () => {
    render(<Navigation activeSection="projects" />);
    const activeLink = screen.getByTestId("nav-link-active");
    expect(activeLink).toHaveTextContent("Projects");
  });

  it("active link carries data-active='true'", () => {
    render(<Navigation activeSection="skills" />);
    expect(screen.getByTestId("nav-link-active")).toHaveAttribute(
      "data-active",
      "true"
    );
  });
});

describe("Navigation — keyboard accessibility", () => {
  it("all desktop nav links are keyboard focusable", () => {
    render(<Navigation />);
    const desktopNav = screen.getByTestId("nav-links-desktop");
    for (const link of within(desktopNav).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });

  it("logo is rendered as a focusable anchor", () => {
    render(<Navigation />);
    const logo = screen.getByTestId("nav-logo");
    expect(logo.tagName).toBe("A");
    expect(logo).not.toHaveAttribute("tabindex", "-1");
  });
});
