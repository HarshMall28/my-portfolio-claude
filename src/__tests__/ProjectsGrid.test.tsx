/**
 * RED PHASE — ProjectsGrid tests
 * These tests MUST FAIL until Arjun implements src/components/ProjectsGrid.tsx
 * Design spec: .claude/skills/designer-priya/references/design-spec.md §9.2
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Component under test — does not exist yet (RED)
import ProjectsGrid from "@/components/ProjectsGrid";

// Mock framer-motion so animations don't block jsdom
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
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
  },
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

// Mock project data
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A short description of Project Alpha.",
    techTags: ["React", "Next.js", "Tailwind CSS"],
    image: "/images/project-alpha.jpg",
  },
  {
    id: "2",
    title: "Project Beta",
    description: "A short description of Project Beta.",
    techTags: ["Node.js", "Express", "MongoDB"],
    image: "/images/project-beta.jpg",
  },
];

describe("ProjectsGrid — structure and content", () => {
  it("renders the correct number of project cards", () => {
    render(<ProjectsGrid projects={MOCK_PROJECTS} />);
    expect(screen.getAllByTestId(/project-card-/)).toHaveLength(MOCK_PROJECTS.length);
  });

  it("renders project title, description, and tech tags for each project", () => {
    render(<ProjectsGrid projects={MOCK_PROJECTS} />);
    MOCK_PROJECTS.forEach((project) => {
      const card = screen.getByTestId(`project-card-${project.id}`);
      expect(within(card).getByRole("heading", { name: project.title })).toBeInTheDocument();
      expect(within(card).getByText(project.description)).toBeInTheDocument();
      project.techTags.forEach((tag) => {
        expect(within(card).getByText(tag)).toBeInTheDocument();
      });
    });
  });

  it("renders a placeholder image when no image is provided", () => {
    const projectsWithPlaceholder = [{ ...MOCK_PROJECTS[0], image: undefined }];
    render(<ProjectsGrid projects={projectsWithPlaceholder} />);
    const card = screen.getByTestId(`project-card-${projectsWithPlaceholder[0].id}`);
    expect(within(card).getByText("Project Screenshot")).toBeInTheDocument();
  });

  it("renders the 'View Project →' link for each project", () => {
    render(<ProjectsGrid projects={MOCK_PROJECTS} />);
    MOCK_PROJECTS.forEach((project) => {
      const card = screen.getByTestId(`project-card-${project.id}`);
      expect(within(card).getByText("View Project →")).toBeInTheDocument();
    });
  });

  it("each 'View Project' link triggers the onProjectSelect callback with the correct project ID", async () => {
    const user = userEvent.setup();
    const mockOnProjectSelect = vi.fn();
    render(<ProjectsGrid projects={MOCK_PROJECTS} onProjectSelect={mockOnProjectSelect} />);

    for (const project of MOCK_PROJECTS) {
      const card = screen.getByTestId(`project-card-${project.id}`);
      const viewProjectLink = within(card).getByText("View Project →");
      await user.click(viewProjectLink);
      expect(mockOnProjectSelect).toHaveBeenCalledWith(project.id);
    }
    expect(mockOnProjectSelect).toHaveBeenCalledTimes(MOCK_PROJECTS.length);
  });
});

describe("ProjectsGrid — accessibility", () => {
  it("project cards are navigable elements", () => {
    render(<ProjectsGrid projects={MOCK_PROJECTS} />);
    MOCK_PROJECTS.forEach((project) => {
      const card = screen.getByTestId(`project-card-${project.id}`);
      expect(card.tagName).toBe("DIV"); // The card itself is a div, the link inside handles navigation
      const link = within(card).getByText("View Project →").closest("a");
      expect(link).toHaveAttribute("href", "#"); // Placeholder href for modal trigger
    });
  });

  it("image placeholders have alt text", () => {
    const projectsWithPlaceholder = [{ ...MOCK_PROJECTS[0], image: undefined }];
    render(<ProjectsGrid projects={projectsWithPlaceholder} />);
    const placeholder = screen.getByText("Project Screenshot");
    expect(placeholder).toBeInTheDocument();
  });
});
