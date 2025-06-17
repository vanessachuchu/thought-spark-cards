
import { useState, useEffect } from 'react';

export interface Todo {
  id: string;
  content: string;
  thoughtId?: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
  scheduledDate?: string; // 新增：排程日期
  scheduledTime?: string; // 新增：排程時間 (HH:mm 格式)
}

const STORAGE_KEY = 'todos-data';

const initialTodos: Todo[] = [
  {
    id: "a",
    content: "🖋️ 今天想到一個好點子：可以用卡片方式整理思緒！",
    thoughtId: "1",
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "09:00"
  },
  {
    id: "b",
    content: "🤔 要不要開始一個專屬於自己的行動記錄？",
    thoughtId: "2",
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "14:30"
  }
];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTodos;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    updateTodo(id, { done: !todos.find(t => t.id === id)?.done });
  };

  // 新增：根據日期獲取待辦事項
  const getTodosByDate = (date: string) => {
    return todos.filter(todo => todo.scheduledDate === date);
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodosByDate
  };
}
