"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, Transition } from "framer-motion";
import { Project } from "@/lib/types";

interface ProjectDetailModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({
  isOpen,
  project,
  onClose,
}: ProjectDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      // Focus the close button when the modal opens
      const timeoutId = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, prefersReducedMotion ? 0 : 300); // Delay focus for animation

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, handleKeyDown, prefersReducedMotion]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  const overlayTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" };
  const contentTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" };

  if (!project) return null; // Render nothing if no project is provided

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-200 bg-black/90 backdrop-blur-lg flex items-center justify-center p-5 md:p-8"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          transition={overlayTransition}
          aria-modal="true"
          role="dialog"
          data-testid="project-modal-overlay"
        >
          <motion.div
            ref={modalRef}
            className="relative w-full h-[90vh] max-w-[900px] overflow-y-auto bg-surface rounded-lg p-6 md:p-8 outline-none"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={contentTransition}
            data-testid="project-modal-content"
            aria-labelledby="project-modal-title"
            tabIndex={-1} // Ensure the modal content is focusable for screen readers
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:text-text-primary focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label="Close project details"
            >
              &times;
            </button>

            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                width={16}
                height={9}
                layout="responsive"
                className="rounded-md mb-6"
              />
            ) : (
              <div className="w-full aspect-video bg-border rounded-md mb-6 flex items-center justify-center">
                <span className="text-text-muted font-inter text-lg">
                  Project Hero Image/Video
                </span>
              </div>
            )}

            <h2
              id="project-modal-title"
              className="font-spaceGrotesk text-sectionHeadingMobile md:text-sectionHeading font-bold text-text-primary mb-4"
            >
              {project.title}
            </h2>

            {project.overview && (
              <p className="font-inter text-subHeading font-medium text-text-muted mb-6">
                {project.overview}
              </p>
            )}

            {project.problem && (
              <div className="mb-8">
                <h3 className="font-spaceGrotesk text-subHeading font-medium text-text-primary mb-2">
                  Problem
                </h3>
                <p className="font-inter text-body text-text-muted">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="mb-8">
                <h3 className="font-spaceGrotesk text-subHeading font-medium text-text-primary mb-2">
                  Solution
                </h3>
                <p className="font-inter text-body text-text-muted">
                  {project.solution}
                </p>
              </div>
            )}

            {project.outcome && (
              <div className="mb-8">
                <h3 className="font-spaceGrotesk text-subHeading font-medium text-text-primary mb-2">
                  Outcome
                </h3>
                <p className="font-inter text-body text-text-muted">
                  {project.outcome}
                </p>
              </div>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-8">
                <h3 className="font-spaceGrotesk text-subHeading font-medium text-text-primary mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent-dim text-accent font-inter text-caption px-3 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.liveDemoUrl || project.githubUrl) && (
              <div className="flex flex-wrap gap-4 mb-4">
                {project.liveDemoUrl && (
                  <Link
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-accent text-accent font-inter text-sm font-medium tracking-wide
                               hover:bg-accent hover:text-black transition-colors duration-200
                               focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-3 focus-visible:rounded-full"
                  >
                    Live Demo →
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-accent text-accent font-inter text-sm font-medium tracking-wide
                               hover:bg-accent hover:text-black transition-colors duration-200
                               focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-3 focus-visible:rounded-full"
                  >
                    GitHub →
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}