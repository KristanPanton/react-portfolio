import { useState } from 'react';
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Quote from "./components/Quote";
import Resume from "./components/Resume";
import Skills from "./components/Skills";

export default function App() {
  const [gameMode, setGameMode] = useState('life');

  return (
    <div className="overflow-x-hidden relative min-h-screen bg-base-100 text-base-content">
      <div className="relative z-10">
        <Hero gameMode={gameMode} setGameMode={setGameMode} />
        {gameMode === 'life' && (
          <>
            <About />
            <Skills />
            <Quote />
            <Projects />
            <Resume />
            <Contact />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
