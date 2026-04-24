/**
 * RED PHASE — ProjectDetailModal tests
 * These tests MUST FAIL until Arjun implements src/components/ProjectDetailModal.tsx
 * Design spec: .claude/skills/designer-priya/references/design-spec.md §9.3
 */
import { render, screen, within, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Component under test — does not exist yet (RED)
import ProjectDetailModal from "@/components/ProjectDetailModal";

// Mock framer-motion so animations don't block jsdom
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    a: ({
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props}>{children}</a>
    ),
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useReducedMotion: vi.fn().mockReturnValue(false),
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

// Mock project data (more detailed for modal)
const MOCK_PROJECT_DETAIL = {
  id: "1",
  title: "Project Alpha",
  overview: "This is an overview of Project Alpha, a brief summary of its purpose.",
  problem: "The problem was that existing solutions were too slow and inefficient.",
  solution: "We developed a new algorithm and implemented it using React and Next.js, significantly improving performance.",
  outcome: "The new system reduced processing time by 50% and increased user satisfaction by 30%.",
  techStack: ["React", "Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
  image: "/images/project-alpha-detail.jpg",
  liveDemoUrl: "https://demo.projectalpha.com",
  githubUrl: "https://github.com/harsh/project-alpha",
};

describe("ProjectDetailModal — visibility and basic structure", () => {
  it("does not render the modal by default when isOpen is false", () => {
    render(<ProjectDetailModal isOpen={false} project={null} onClose={vi.fn()} />);
    expect(screen.queryByTestId("project-modal-overlay")).not.toBeInTheDocument();
  });

  it("renders the modal when isOpen is true and a project is provided", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    expect(screen.getByTestId("project-modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("project-modal-content")).toBeInTheDocument();
  });

  it("renders a close button", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    expect(screen.getByLabelText("Close project details")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={mockOnClose} />);
    await user.click(screen.getByLabelText("Close project details"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    const mockOnClose = vi.fn();
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={mockOnClose} />);
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe("ProjectDetailModal — content display", () => {
  it("displays the project title and overview", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    expect(screen.getByRole("heading", { name: MOCK_PROJECT_DETAIL.title })).toBeInTheDocument();
    expect(screen.getByText(MOCK_PROJECT_DETAIL.overview)).toBeInTheDocument();
  });

  it("displays problem, solution, and outcome sections", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    expect(screen.getByRole("heading", { name: /Problem/i })).toBeInTheDocument();
    expect(screen.getByText(MOCK_PROJECT_DETAIL.problem)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Solution/i })).toBeInTheDocument();
    expect(screen.getByText(MOCK_PROJECT_DETAIL.solution)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Outcome/i })).toBeInTheDocument();
    expect(screen.getByText(MOCK_PROJECT_DETAIL.outcome)).toBeInTheDocument();
  });

  it("displays tech stack tags", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    MOCK_PROJECT_DETAIL.techStack.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("renders a placeholder image when project.image is undefined", () => {
    const projectWithoutImage = { ...MOCK_PROJECT_DETAIL, image: undefined };
    render(<ProjectDetailModal isOpen={true} project={projectWithoutImage} onClose={vi.fn()} />);
    expect(screen.getByText("Project Hero Image/Video")).toBeInTheDocument();
  });

  it("renders external links (Live Demo and GitHub) when provided", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    const liveDemoLink = screen.getByRole("link", { name: /Live Demo/i });
    expect(liveDemoLink).toBeInTheDocument();
    expect(liveDemoLink).toHaveAttribute("href", MOCK_PROJECT_DETAIL.liveDemoUrl);

    const githubLink = screen.getByRole("link", { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", MOCK_PROJECT_DETAIL.githubUrl);
  });

  it("does not render external links if URLs are not provided", () => {
    const projectWithoutLinks = { ...MOCK_PROJECT_DETAIL, liveDemoUrl: undefined, githubUrl: undefined };
    render(<ProjectDetailModal isOpen={true} project={projectWithoutLinks} onClose={vi.fn()} />);
    expect(screen.queryByRole("link", { name: /Live Demo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /GitHub/i })).not.toBeInTheDocument();
  });
});

describe("ProjectDetailModal — accessibility", () => {
  it("modal has aria-modal attribute set to true", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    expect(screen.getByTestId("project-modal-overlay")).toHaveAttribute("aria-modal", "true");
  });

  it("modal content is correctly labelled by the project title", () => {
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    const modalContent = screen.getByTestId("project-modal-content");
    expect(modalContent).toHaveAttribute("aria-labelledby");
    const labelledByElement = document.getElementById(modalContent.getAttribute("aria-labelledby") || "");
    expect(labelledByElement).toHaveTextContent(MOCK_PROJECT_DETAIL.title);
  });

  it("focus is initially set to the close button when the modal opens", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailModal isOpen={true} project={MOCK_PROJECT_DETAIL} onClose={vi.fn()} />);
    const closeButton = screen.getByLabelText("Close project details");
    await user.tab(); // Simulate tabbing into the modal, which should land on the close button due to initial focus
    expect(closeButton).toHaveFocus();
  });
});
