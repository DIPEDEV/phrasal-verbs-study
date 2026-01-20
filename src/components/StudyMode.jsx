import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { useProgress } from "../hooks/useProgress";
import { phrasalVerbs } from "../data/phrasalVerbs";

export function StudyMode({ onBack }) {
  const { markLearned, isLearned } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentVerb = phrasalVerbs[currentIndex];
  const isCurrentLearned = isLearned(currentVerb.id);

  const paginate = (newDirection) => {
    setIsFlipped(false);
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = phrasalVerbs.length - 1;
      if (next >= phrasalVerbs.length) next = 0;
      return next;
    });
  };

  const handleLearned = () => {
    markLearned(currentVerb.id);
    paginate(1);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <span className="font-bold text-slate-500">
          {currentIndex + 1} / {phrasalVerbs.length}
        </span>
        <div className="w-10" />
      </div>

      <div className="relative h-[420px] w-full perspective-1000 mb-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 w-full h-full"
            style={{ perspective: 1000 }}
          >
             <div 
               className="relative w-full h-full cursor-pointer transition-transform duration-500"
               style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
               onClick={() => setIsFlipped(!isFlipped)}
             >
                {/* Front */}
                <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-white border-b-4 border-slate-200">
                  <span className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-4">Phrasal Verb</span>
                  <h2 className="text-4xl font-black text-slate-800 mb-2">{currentVerb.verb}</h2>
                  {isCurrentLearned && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                      <Check size={16} /> Learned
                    </div>
                  )}
                  <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
                    <RotateCw size={14} /> Tap to flip
                  </div>
                </Card>

                {/* Back */}
                <Card 
                  className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-indigo-50 border-b-4 border-indigo-200"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">Definition</span>
                  <p className="text-xl font-medium text-slate-800 mb-6">{currentVerb.definition}</p>
                  
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">Example</span>
                  <p className="text-base text-slate-600 italic">"{currentVerb.examples[0]}"</p>
                </Card>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" className="flex-1" onClick={() => paginate(-1)}>
          Prev
        </Button>
        <Button variant="primary" className="flex-[2]" onClick={handleLearned}>
           Mark Learned
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => paginate(1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
