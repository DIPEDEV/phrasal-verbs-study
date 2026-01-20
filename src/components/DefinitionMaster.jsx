import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { phrasalVerbs } from "../data/phrasalVerbs";
import { clsx } from "clsx";

export function DefinitionMaster({ onBack }) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null); 
  const [round, setRound] = useState(generateRound());
  const [hintLevel, setHintLevel] = useState(0); // 0: None, 1: First Letter
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [round]);

  function generateRound() {
    let target;
    // Simple random pick
    target = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
    return { target };
  }

  const normalize = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") 
      .replace(/\s+/g, " ");
  };

  const handleSkip = () => {
    setStreak(0);
    setFeedback('skipped');
    setInput(round.target.verb); // Show answer
    setTimeout(() => {
        setFeedback(null);
        setInput("");
        setHintLevel(0);
        setRound(generateRound());
    }, 1500);
  };

  const handleHint = () => {
    if (hintLevel < 1) {
        setHintLevel(h => h + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback) return;

    const userNorm = normalize(input);
    const targetNorm = normalize(round.target.verb);

    if (userNorm === targetNorm) {
      setFeedback('correct');
      // Scoring: Base 20, -5 for hint, +2 per streak
      const points = Math.max(5, 20 - (hintLevel * 5) + (streak * 2));
      setScore(s => s + points);
      setStreak(s => s + 1);
      setTimeout(() => {
        setFeedback(null);
        setInput("");
        setHintLevel(0);
        setRound(generateRound());
      }, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div className="text-center">
            <div className="text-xs font-bold text-slate-400 uppercase">Score</div>
            <div className="text-2xl font-black text-primary-600">{score}</div>
        </div>
         <div className="w-10 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase">Streak</div>
            <div className="text-lg font-bold text-orange-500">{streak}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <Card className="p-8 text-center bg-white shadow-xl border-slate-100 flex flex-col justify-center min-h-[220px] relative overflow-hidden">
           
           <div className="mb-6 flex justify-center">
             <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <Sparkles size={32} />
             </div>
           </div>
           
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Definition</h3>
           <p className="text-2xl font-bold text-slate-800 leading-relaxed relative z-10">
             "{round.target.definition}"
           </p>

           {hintLevel >= 1 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="mt-6 text-sm font-bold text-indigo-500 bg-indigo-50 py-2 px-4 rounded-lg inline-block mx-auto"
             >
               Starts with: <span className="text-lg text-indigo-700">"{round.target.verb.charAt(0).toUpperCase()}..."</span>
             </motion.div>
           )}
        </Card>

        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hintLevel >= 1 ? `Starts with ${round.target.verb.charAt(0)}...` : "Type the phrasal verb..."}
            className={clsx(
              "w-full p-5 rounded-2xl text-xl font-bold bg-white border-2 shadow-sm focus:outline-none transition-all",
              feedback === 'correct' ? "border-emerald-500 text-emerald-600 bg-emerald-50" :
              feedback === 'wrong' || feedback === 'skipped' ? "border-rose-500 text-rose-600 bg-rose-50" :
              "border-slate-200 text-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={feedback === 'correct' || feedback === 'skipped'}
          />
          <button 
             type="submit"
             disabled={feedback === 'correct' || feedback === 'skipped'}
             className="absolute right-3 top-3 bottom-3 aspect-square bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-95 active:scale-90 transition-transform disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>

        <div className="flex gap-3">
             <Button 
               type="button" 
               variant="secondary" 
               className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50"
               onClick={handleHint}
               disabled={hintLevel >= 1 || feedback}
             >
               💡 {hintLevel === 0 ? "Show First Letter" : "Max Hints"}
             </Button>
             
             <Button 
               type="button" 
               variant="ghost" 
               className="px-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
               onClick={handleSkip}
               disabled={!!feedback}
             >
               Skip ⏩
             </Button>
        </div>

        <AnimatePresence mode="wait">
          {feedback === 'wrong' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
               className="bg-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            >
              <AlertCircle size={20} />
              Not quite. Try again!
            </motion.div>
          )}
           {feedback === 'correct' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
               className="bg-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            >
              <CheckCircle size={20} />
              Correct! It's <span className="font-extrabold ml-1"> {round.target.verb}</span>
            </motion.div>
          )}
          {feedback === 'skipped' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
               className="bg-slate-100 text-slate-700 p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            >
              <AlertCircle size={20} />
              Skipped. It was: <span className="font-black">{round.target.verb}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
