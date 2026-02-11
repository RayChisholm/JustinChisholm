export const siteConfig = {
  name: "Justin Chisholm",
  tagline: "Building thoughtful software, one project at a time.",
  about:
    "I'm a developer who enjoys building clean, functional tools and applications. " +
    "I care about good design, clear code, and solving real problems. " +
    "Always learning, always shipping.",

  contact: {
    email: "justin@example.com",
    github: "https://github.com/justinchisholm",
    linkedin: "https://linkedin.com/in/justinchisholm",
  },

  projects: [
    {
      title: "Portfolio Site",
      description:
        "A configurable single-page portfolio with multiple themes, built with Next.js and deployed via Coolify.",
      tech: ["Next.js", "TypeScript", "CSS Modules"],
      url: undefined as string | undefined,
      repo: "https://github.com/justinchisholm/portfolio",
    },
    {
      title: "Project Two",
      description:
        "A placeholder for your next project. Update this in site.config.ts.",
      tech: ["React", "Node.js"],
      url: undefined as string | undefined,
      repo: undefined as string | undefined,
    },
    {
      title: "Project Three",
      description:
        "Another placeholder. Add as many projects as you like — the grid adapts automatically.",
      tech: ["Python", "FastAPI"],
      url: "https://example.com",
      repo: undefined as string | undefined,
    },
  ],

  theme: {
    default: "minimal" as "minimal" | "cyberpunk" | "retro",
    allowUserToggle: true,
  },
};
