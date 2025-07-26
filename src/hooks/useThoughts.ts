
import { useState, useEffect } from 'react';

export interface AiConversation {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  lastUpdated: string;
}

export interface Thought {
  id: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  aiConversation?: AiConversation;
  generatedActions?: ActionItem[];
}

export interface ActionItem {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  category: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

const STORAGE_KEY = 'thoughts-data';

// 初始示例數據
const initialThoughts: Thought[] = [];

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialThoughts;
  });

  useEffect(() => {
    console.log("useThoughts useEffect: saving thoughts to localStorage", thoughts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  }, [thoughts]);

  const addThought = (thought: Thought) => {
    console.log("useThoughts addThought called with:", thought);
    const newThought = {
      ...thought,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log("useThoughts adding new thought:", newThought);
    setThoughts(prev => {
      const updated = [...prev, newThought];
      console.log("useThoughts updated thoughts after add:", updated);
      return updated;
    });
  };

  const updateThought = (id: string, updates: Partial<Thought>) => {
    console.log("useThoughts updateThought called with id:", id, "updates:", updates);
    setThoughts(prev => {
      const updated = prev.map(thought => 
        thought.id === id 
          ? { ...thought, ...updates, updatedAt: new Date().toISOString() }
          : thought
      );
      console.log("useThoughts updated thoughts after update:", updated);
      return updated;
    });
  };

  const updateAiConversation = (thoughtId: string, messages: Array<{role: "user" | "assistant" | "system"; content: string}>) => {
    console.log("useThoughts updateAiConversation called with thoughtId:", thoughtId, "messages count:", messages.length);
    const aiConversation: AiConversation = {
      messages,
      lastUpdated: new Date().toISOString()
    };
    
    setThoughts(prev => {
      const updated = prev.map(thought => 
        thought.id === thoughtId 
          ? { ...thought, aiConversation, updatedAt: new Date().toISOString() }
          : thought
      );
      console.log("useThoughts updated thoughts after AI conversation update:", updated);
      return updated;
    });
  };

  const updateGeneratedActions = (thoughtId: string, actions: ActionItem[]) => {
    console.log("useThoughts updateGeneratedActions called with thoughtId:", thoughtId, "actions count:", actions.length);
    setThoughts(prev => {
      const updated = prev.map(thought => 
        thought.id === thoughtId 
          ? { ...thought, generatedActions: actions, updatedAt: new Date().toISOString() }
          : thought
      );
      console.log("useThoughts updated thoughts after actions update:", updated);
      return updated;
    });
  };

  const deleteThought = (id: string) => {
    console.log("useThoughts deleteThought called with id:", id);
    console.log("useThoughts current thoughts before delete:", thoughts);
    setThoughts(prev => {
      const updated = prev.filter(thought => thought.id !== id);
      console.log("useThoughts updated thoughts after delete:", updated);
      console.log("useThoughts deleted thought with id:", id);
      return updated;
    });
  };

  const getThoughtById = (id: string) => {
    const found = thoughts.find(t => t.id === id);
    console.log("useThoughts getThoughtById called with id:", id, "found:", found);
    return found;
  };

  return {
    thoughts,
    setThoughts,
    addThought,
    updateThought,
    updateAiConversation,
    updateGeneratedActions,
    deleteThought,
    getThoughtById
  };
}
