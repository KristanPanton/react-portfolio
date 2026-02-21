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
  const [spellTrigger, setSpellTrigger] = useState(0);

  const handleSpell = () => {
    if (gameMode === 'life') setSpellTrigger((n) => n + 1);
  };

  return (
    <div className="overflow-x-hidden relative min-h-screen bg-base-100 text-base-content">
      <div className="relative z-10">
        <Hero gameMode={gameMode} setGameMode={setGameMode} spellTrigger={spellTrigger} onSpell={handleSpell} />
        {gameMode === 'life' && (
          <>
            <About />
            <Skills />
            <Quote />
            <Projects />
            <Resume />
            <Contact />
            <Footer onSpell={handleSpell} />
          </>
        )}
      </div>
    </div>
  );
}
