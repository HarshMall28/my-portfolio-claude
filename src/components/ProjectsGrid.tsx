"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Project } from "@/lib/types";

interface ProjectsGridProps {
  projects: Project[];
  onProjectSelect: (id: string) => void;
}

export default function ProjectsGrid({
  projects,
  onProjectSelect,
}: ProjectsGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hover: { y: -4, borderColor: "var(--color-accent)" },
    initial: { y: 0, borderColor: "var(--color-border)" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          className="bg-surface border border-border rounded-xl p-6 cursor-pointer"
          onClick={() => onProjectSelect(project.id)}
          whileHover={prefersReducedMotion ? undefined : "hover"}
          initial="initial"
          variants={cardVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          data-testid={`project-card-${project.id}`}
          tabIndex={0} // Make the div focusable
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onProjectSelect(project.id);
            }
          }}
          role="button"
          aria-label={`View details for ${project.title}`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={16}
              height={9}
              layout="responsive"
              className="rounded-md mb-4"
            />
          ) : (
            <div className="w-full aspect-video bg-border rounded-md mb-4 flex items-center justify-center">
              <span className="text-text-muted font-inter text-base">
                Project Screenshot
              </span>
            </div>
          )}

          <h3 className="font-spaceGrotesk text-subHeading font-medium text-text-primary mb-2">
            {project.title}
          </h3>
          <p className="font-inter text-body text-text-muted mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="bg-accent-dim text-accent font-inter text-caption px-3 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card onClick from firing
              onProjectSelect(project.id);
            }}
            className="text-accent font-inter text-caption font-medium hover:text-text-primary hover:underline focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-3"
          >
            View Project →
          </a>
        </motion.div>
      ))}
    </div>
  );
}