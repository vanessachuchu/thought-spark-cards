
import { useState, useEffect } from 'react';

export interface Thought {
  id: string;
  content: string;
  tags: string[];
}

const STORAGE_KEY = 'thoughts-data';

// 初始示例數據
const initialThoughts: Thought[] = [
  {
    id: "1",
    content: "🖋️ 今天想到一個好點子：可以用卡片方式整理思緒！",
    tags: ["#創意", "✨"]
  },
  {
    id: "2", 
    content: "🤔 要不要開始一個專屬於自己的行動記錄？",
    tags: ["#行動", "🔥"]
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
    setThoughts(prev => [...prev, thought]);
  };

  const getThoughtById = (id: string) => {
    return thoughts.find(t => t.id === id);
  };

  return {
    thoughts,
    setThoughts,
    addThought,
    getThoughtById
  };
}
