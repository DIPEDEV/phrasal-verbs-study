import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from './components/Dashboard';
import { StudyMode } from './components/StudyMode';
import { ContextGame } from './components/ContextGame';
import { ParticleRush } from './components/ParticleRush';

import { TypeMaster } from './components/TypeMaster';
import { DefinitionMaster } from "./components/DefinitionMaster";

function App() {
  const [mode, setMode] = useState('dashboard'); // dashboard, study, context, particle, type

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      <AnimatePresence mode="wait">
        {mode === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full pt-12"
          >
            <Dashboard onModeSelect={setMode} />
          </motion.div>
        )}

        {mode === 'study' && (
          <motion.div 
            key="study"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-8"
          >
            <StudyMode onBack={() => setMode('dashboard')} />
          </motion.div>
        )}

        {mode === 'context' && (
          <motion.div 
            key="context"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-8"
          >
            <ContextGame onBack={() => setMode('dashboard')} />
          </motion.div>
        )}

        {mode === 'particle' && (
          <motion.div 
            key="particle"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-8"
          >
            <ParticleRush onBack={() => setMode('dashboard')} />
          </motion.div>
        )}

        {mode === 'type' && (
          <motion.div 
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-8"
          >
            <TypeMaster onBack={() => setMode('dashboard')} />
          </motion.div>
        )}

        {mode === 'definition' && (
          <motion.div 
            key="definition"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-8"
          >
            <DefinitionMaster onBack={() => setMode('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
