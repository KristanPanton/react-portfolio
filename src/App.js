import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

export default function App() {
  return (
    <div className="overflow-x-hidden relative min-h-screen">
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
