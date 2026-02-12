export const siteConfig = {
  name: "Justin Chisholm",
  tagline: "Developer. Builder. Problem Solver.",
  about:
    "I bridge the gap between corporate scale and entrepreneurial agility - delivering millions in savings for global enterprises while helping startups move fast. " +
    "I build clean tools, solve complex problems, and never stop shipping.",

  contact: {
    email: "jstnchshlm@gmail.com",
    github: "https://github.com/raychisholm",
    linkedin: "https://www.linkedin.com/in/justin-chisholm-465390332/",
  },

  projects: [
    {
      title: "Portfolio Site",
      description:
        "A configurable portfolio with multiple themes, and a MD blog engine.",
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
    default: "cyberpunk" as "minimal" | "cyberpunk" | "retro" | "nord" | "sunset" | "forest",
    allowUserToggle: true,
  },
};
