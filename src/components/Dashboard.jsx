import { motion } from "framer-motion";
import { BookOpen, Gamepad2, Timer, ChevronRight, Trophy, Sparkles, Wand2, Keyboard, Brain, Zap } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { ProgressBar } from "./ui/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import { phrasalVerbs } from "../data/phrasalVerbs";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function Dashboard({ onModeSelect }) {
  const { learnedIds } = useProgress();
  const total = phrasalVerbs.length;
  const learned = learnedIds.length;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-md mx-auto space-y-8 p-6"
    >
      <motion.div variants={item} className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Phrasal <span className="text-primary-500">Master</span>
        </h1>
        <p className="text-slate-500 text-lg">Master English Phrasal Verbs</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Your Progress</h3>
              <p className="text-sm text-slate-500">Keep it up!</p>
            </div>
          </div>
          <ProgressBar current={learned} total={total} label="Mastered Verbs" />
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full justify-between group"
          onClick={() => onModeSelect('study')}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Study Mode</div>
              <div className="text-xs opacity-90 font-normal">Learn with Flashcards</div>
            </div>
          </div>
          <span className="opacity-60">→</span>
        </Button>

        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full justify-between group"
          onClick={() => onModeSelect('context')}
        >
          <div className="flex items-center gap-3">
            <Brain className="text-purple-500 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Context Master</div>
              <div className="text-xs text-slate-500 font-normal">Fill in the blanks</div>
            </div>
          </div>
          <span className="text-slate-300">→</span>
        </Button>

        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full justify-between group"
          onClick={() => onModeSelect('particle')}
        >
          <div className="flex items-center gap-3">
            <Zap className="text-amber-500 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Particle Rush</div>
              <div className="text-xs text-slate-500 font-normal">Speed Challenge</div>
            </div>
          </div>
          <span className="text-slate-300">→</span>
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full justify-between group"
          onClick={() => onModeSelect('type')}
        >
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <span className="font-mono text-lg font-black">Aa</span>
            </div>
            <div className="text-left">
              <div className="font-bold">Type Master</div>
              <div className="text-xs text-slate-500 font-normal">Write the Answer</div>
            </div>
          </div>
          <span className="text-slate-300">→</span>
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full justify-between group"
          onClick={() => onModeSelect('definition')}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-fuchsia-500 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Definition Master</div>
              <div className="text-xs text-slate-500 font-normal">Guess from meaning</div>
            </div>
          </div>
          <span className="text-slate-300">→</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
