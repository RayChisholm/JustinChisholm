export const siteConfig = {
  name: "Justin Chisholm",
  tagline: "Streamline processes, improve quality, reduce costs.",
  about:
    "I'm a developer who enjoys building clean, functional tools and applications. " +
    "I care about good design, clear code, and solving real problems. " +
    "Always learning, always shipping.",

  contact: {
    email: "jstnchshlm@gmail.com",
    github: "https://github.com/raychisholm",
    linkedin: "https://www.linkedin.com/in/justin-chisholm-465390332/",
  },

  projects: [
    {
      title: "Portfolio Site",
      description:
        "A configurable portfolio with multiple themes, built with Next.js and deployed via Coolify.",
      tech: ["Next.js", "TypeScript", "CSS Modules"],
      url: undefined as string | undefined,
      repo: "https://github.com/raychisholm/justinchisholm",
    },
    {
      title: "Video Barcoder",
      description:
        "Convert video files into customizable barcodes.",
      tech: ["Python", "OpenCV"],
      url: "https://justin-chisholm.vercel.app/blog/video-barcoder",
      repo: "https://github.com/RayChisholm/Video-Frame-Images",
    },
  ],

  theme: {
    default: "retro" as "minimal" | "cyberpunk" | "retro",
    allowUserToggle: true,
  },
};
