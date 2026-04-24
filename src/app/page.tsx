"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionSeparator from "@/components/SectionSeparator";
import ProjectsGrid from "@/components/ProjectsGrid";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { Project } from "@/lib/types";

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A short description of Project Alpha. This project involved building a responsive web application using modern frontend technologies.",
    techTags: ["React", "Next.js", "Tailwind CSS"],
    image: "https://via.placeholder.com/400x225/0A0A0A/737373?text=Project+Alpha",
    overview: "This project aimed to streamline data visualization for complex datasets.",
    problem: "Existing tools were cumbersome and lacked real-time updates.",
    solution: "Developed a custom dashboard with server-side rendering and WebSocket integration.",
    outcome: "Improved data comprehension by 40% and reduced reporting time by 25%.",
    techStack: ["React", "Next.js", "Tailwind CSS", "Node.js", "MongoDB", "WebSockets"],
    liveDemoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "2",
    title: "Project Beta",
    description: "Project Beta focused on creating a robust backend API for a mobile application.",
    techTags: ["Node.js", "Express", "MongoDB"],
    image: "https://via.placeholder.com/400x225/0A0A0A/737373?text=Project+Beta",
    overview: "Backend for a high-traffic mobile e-commerce application.",
    problem: "Scalability issues and slow response times with the legacy system.",
    solution: "Implemented a microservices architecture with a NoSQL database and load balancing.",
    outcome: "Achieved 99.9% uptime and handled 10x more concurrent users without performance degradation.",
    techStack: ["Node.js", "Express", "MongoDB", "Docker", "AWS EC2", "Nginx"],
    liveDemoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "3",
    title: "Project Gamma",
    description: "An exploration into interactive 3D web graphics using Three.js and React Three Fiber.",
    techTags: ["React", "Three.js", "R3F"],
    image: "https://via.placeholder.com/400x225/0A0A0A/737373?text=Project+Gamma",
    overview: "Developed an interactive 3D product configurator for a furniture brand.",
    problem: "Static images limited customer engagement and customization options.",
    solution: "Utilized Three.js and React Three Fiber to create a real-time 3D rendering experience.",
    outcome: "Increased customer engagement by 50% and conversion rates by 15% for customizable products.",
    techStack: ["React", "Three.js", "React Three Fiber", "Blender", "Webpack"],
    liveDemoUrl: "#",
    githubUrl: "#",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (id: string) => {
    const project = MOCK_PROJECTS.find((p) => p.id === id);
    setSelectedProject(project || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <SectionSeparator />

      <section id="projects" className="min-h-screen py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 md:px-6">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-16">Projects</h2>
          <ProjectsGrid projects={MOCK_PROJECTS} onProjectSelect={handleProjectSelect} />
        </div>
      </section>
      <SectionSeparator />

      <section id="skills" className="min-h-screen py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 md:px-6">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-16">Skills</h2>
          <div className="h-[500px] bg-surface rounded-xl flex items-center justify-center text-text-muted">Skills content will be implemented in Sprint 3</div>
        </div>
      </section>
      <SectionSeparator />

      <section id="experience" className="min-h-screen py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 md:px-6">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-16">Experience</h2>
          <div className="h-[500px] bg-surface rounded-xl flex items-center justify-center text-text-muted">Experience content will be implemented in Sprint 3</div>
        </div>
      </section>
      <SectionSeparator />

      <section id="contact" className="min-h-screen py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 md:px-6">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-16">Contact</h2>
          <div className="h-[500px] bg-surface rounded-xl flex items-center justify-center text-text-muted">Contact content will be implemented in Sprint 4</div>
        </div>
      </section>

      <ProjectDetailModal isOpen={isModalOpen} project={selectedProject} onClose={handleCloseModal} />
    </main>
  );
}
