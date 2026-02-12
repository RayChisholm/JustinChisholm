import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <ParticleBackground />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
