export interface Project {
  id: string;
  title: string;
  description: string;
  techTags: string[];
  image?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  techStack?: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
}