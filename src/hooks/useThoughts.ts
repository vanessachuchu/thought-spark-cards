
import { useState, useEffect } from 'react';

export interface Thought {
  id: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'thoughts-data';

// 初始示例數據
const initialThoughts: Thought[] = [
  {
    id: "1",
    content: "🖋️ 今天想到一個好點子：可以用卡片方式整理思緒！",
    tags: ["#創意", "✨"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    content: "🤔 要不要開始一個專屬於自己的行動記錄？",
    tags: ["#行動", "🔥"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialThoughts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  }, [thoughts]);

  const addThought = (thought: Thought) => {
    const newThought = {
      ...thought,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setThoughts(prev => [...prev, newThought]);
  };

  const updateThought = (id: string, updates: Partial<Thought>) => {
    setThoughts(prev => prev.map(thought => 
      thought.id === id 
        ? { ...thought, ...updates, updatedAt: new Date().toISOString() }
        : thought
    ));
  };

  const deleteThought = (id: string) => {
    setThoughts(prev => prev.filter(thought => thought.id !== id));
  };

  const getThoughtById = (id: string) => {
    return thoughts.find(t => t.id === id);
  };

  return {
    thoughts,
    setThoughts,
    addThought,
    updateThought,
    deleteThought,
    getThoughtById
  };
}
