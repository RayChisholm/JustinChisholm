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
      urlExternal: undefined as boolean | undefined,
      urlLabel: undefined as string | undefined,
      blogUrl: undefined as string | undefined,
      repo: "https://github.com/raychisholm/justinchisholm",
    },
    {
      title: "Video Barcoder",
      description:
        "Convert video files into customizable barcodes.",
      tech: ["Python", "OpenCV"],
      url: "https://justinchisholm.com/blog/video-barcoder",
      urlExternal: true,
      urlLabel: "Blog",
      blogUrl: undefined as string | undefined,
      repo: "https://github.com/RayChisholm/Video-Frame-Images",
    },
    {
      title: "Piano Sight-Reading",
      description:
        "Interactive sight-reading trainer with grand staff notation, key signatures, and printable worksheets.",
      tech: ["Next.js", "VexFlow", "TypeScript"],
      url: "/piano",
      urlExternal: false,
      urlLabel: "Play",
      blogUrl: "/blog/piano-sight-reading",
      repo: undefined as string | undefined,
    },
  ],

  theme: {
    default: "cyberpunk" as "minimal" | "cyberpunk" | "retro" | "nord" | "sunset" | "forest",
    allowUserToggle: true,
  },
};
