import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { phrasalVerbs } from "../data/phrasalVerbs";
import { clsx } from "clsx";
import { getFuzzyRegex } from "../utils/textUtils";

export function ContextGame({ onBack }) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const [currentRound, setCurrentRound] = useState(generateRound());

  function generateRound() {
    const target = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
    const example = target.examples[Math.floor(Math.random() * target.examples.length)];
    
    const regex = getFuzzyRegex(target);
    const match = example.match(regex);
    // Use match[0] to blank out the verb phrase. 
    // If we have a captured separator (match[1]), we preserve it? 
    // The previous logic for ContextGame was simple blanking.
    // Let's stick to simple blanking for Context Game (multiple choice).
    const masked = match ? example.replace(match[0], "_______") : example + " (_______)";

    const distractors = [];
    while (distractors.length < 3) {
      const r = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
      if (r.id !== target.id && !distractors.find(d => d.id === r.id)) {
        distractors.push(r);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    return { target, example, masked, options };
  }

  const handleGuess = (verb) => {
    if (loading) return;
    
    if (verb.id === currentRound.target.id) {
      setFeedback('correct');
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
      setLoading(true);
      setTimeout(() => {
        setFeedback(null);
        setCurrentRound(generateRound());
        setLoading(false);
      }, 1000);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setLoading(true);
      setTimeout(() => {
        setFeedback(null);
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col p-6">
       <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-black text-primary-600">{score}</span>
        </div>
        <div className="flex flex-col items-center w-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak</span>
          <span className="text-lg font-bold text-orange-500">🔥 {streak}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8">
        <Card className="p-8 text-center bg-white min-h-[200px] flex flex-col justify-center items-center shadow-lg border-b-4 border-slate-200">
          <div className="mb-6 bg-indigo-50 px-4 py-1.5 rounded-full text-sm font-bold text-indigo-600">
            HINT: {currentRound.target.definition}
          </div>
          <p className="text-2xl font-medium text-slate-800 leading-relaxed">
            "{currentRound.masked}"
          </p>
          <div className="mt-6 text-sm text-slate-400 font-medium">Which verb fits here?</div>
        </Card>

        <div className="grid grid-cols-1 gap-3">
          {currentRound.options.map((option) => (
            <motion.button
              key={option.id + currentRound.masked} // unique key
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGuess(option)}
              className={clsx(
                "p-4 rounded-xl font-bold text-lg border-2 transition-all shadow-sm flex items-center justify-between group",
                feedback === 'correct' && option.id === currentRound.target.id
                  ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                  : feedback === 'wrong' && option.id !== currentRound.target.id
                    ? "bg-rose-50 border-rose-200 text-rose-300"
                  : "bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:shadow-md"
              )}
            >
              <span>{option.verb}</span>
              {feedback === 'correct' && option.id === currentRound.target.id && <Check className="text-emerald-600" />}
              {feedback === 'wrong' && option.id !== currentRound.target.id && <X className="text-rose-400"/>}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div 
            initial={{ scale: 0, rotate: -20 }} 
            animate={{ scale: 1, rotate: 0 }} 
            exit={{ scale: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
             <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl text-3xl font-black shadow-2xl skew-x-[-10deg]">
               Correct!
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
