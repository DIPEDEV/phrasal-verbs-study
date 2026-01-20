import { useState, useEffect } from 'react';

export function useProgress() {
  const [learnedIds, setLearnedIds] = useState(() => {
    const saved = localStorage.getItem('phrasal-master-learned');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('phrasal-master-learned', JSON.stringify(learnedIds));
  }, [learnedIds]);

  const markLearned = (id) => {
    setLearnedIds(prev => Array.from(new Set([...prev, id])));
  };

  const isLearned = (id) => learnedIds.includes(id);

  const resetProgress = () => {
    setLearnedIds([]);
  };

  return { learnedIds, markLearned, isLearned, resetProgress };
}
