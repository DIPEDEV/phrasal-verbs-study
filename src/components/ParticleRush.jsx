import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Timer, Zap } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { phrasalVerbs } from "../data/phrasalVerbs";
import { clsx } from "clsx";

export function ParticleRush({ onBack }) {
  const GAME_DURATION = 60;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  function startGame() {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    nextQuestion();
  }

  function nextQuestion() {
    const target = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
    // Logic: Definition + Verb -> Select Particle
    const verbPart = target.particles[0]; // "GO"
    const particlePart = target.particles.slice(1).join(" "); // "ON" (or "UP WITH")
    
    // Distractor particles
    const particlesPool = ["UP", "DOWN", "IN", "OUT", "ON", "OFF", "AWAY", "BACK", "OVER", "WITH"];
    const distractors = particlesPool
      .filter(p => p !== particlePart && !target.particles.includes(p))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    const options = [particlePart, ...distractors].sort(() => 0.5 - Math.random());
    
    setCurrentQuestion({
      target,
      verbPart,
      correct: particlePart,
      options
    });
  }

  function handleAnswer(particle) {
    if (!isPlaying) return;
    
    if (particle === currentQuestion.correct) {
      setScore(s => s + 100);
      nextQuestion();
    } else {
      setScore(s => Math.max(0, s - 50));
      // Shake effect or feedback could go here
    }
  }

  if (!isPlaying && timeLeft === 0) {
    return (
      <div className="max-w-md mx-auto h-full flex flex-col p-6 items-center justify-center text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900">Time's Up!</h2>
          <p className="text-xl text-slate-500">Final Score: <span className="text-primary-600 font-bold">{score}</span></p>
        </div>
        <Button size="lg" onClick={startGame}>Play Again</Button>
        <Button variant="ghost" onClick={onBack}>Exit</Button>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="max-w-md mx-auto h-full flex flex-col p-6 items-center justify-center text-center space-y-8">
        <div className="p-6 bg-amber-100 rounded-full text-amber-600 mb-4">
          <Zap size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900">Particle Rush</h2>
          <p className="text-slate-600 max-w-xs mx-auto">
            Match the correct particle to the verb as fast as you can! You have 60 seconds.
          </p>
        </div>
        <Button size="lg" onClick={startGame} className="w-full max-w-xs">Start Game</Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <Timer size={20} />
          <span className={clsx("text-2xl font-mono", timeLeft < 10 && "text-rose-500")}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="font-black text-2xl text-primary-600">{score}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion.target.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-1 flex flex-col gap-8"
        >
          <Card className="p-6 text-center space-y-4 bg-slate-900 text-white border-none shadow-2xl">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Definition</div>
            <p className="text-lg font-medium opacity-90">{currentQuestion.target.definition}</p>
          </Card>

          <div className="text-center py-8">
            <span className="text-5xl font-black text-slate-800 tracking-tight">
              {currentQuestion.verbPart} <span className="text-slate-200">___</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((opt) => (
              <Button
                key={opt}
                variant="secondary"
                size="lg"
                className="h-24 text-2xl font-bold bg-white border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600"
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
