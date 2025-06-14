
import TopNav from "@/components/TopNav";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function TodoPage() {
  // DEMO 行動資料
  const [todos, setTodos] = useState([
    {
      id: "a",
      content: "🖋️ 今天想到一個好點子：可以用卡片方式整理思緒！",
      thoughtId: "1",
      done: false
    },
    {
      id: "b",
      content: "🤔 要不要開始一個專屬於自己的行動記錄？",
      thoughtId: "2",
      done: false
    }
  ]);

  function toggleTodo(id: string) {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">📌 行動清單 To-do</div>
        <div className="space-y-6">
          {todos.length === 0 ? (
            <div className="text-muted-foreground">暫無待辦，從思緒卡片新增吧！</div>
          ) : todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border shadow">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.done
                    ? "bg-primary border-primary"
                    : "bg-white border-border"
                }`}
                onClick={() => toggleTodo(todo.id)}
                aria-label="打勾完成"
              >
                {todo.done ? (
                  <span className="text-white text-lg font-bold">✓</span>
                ) : null}
              </button>
              <span className={`text-base ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {todo.content}
              </span>
              <Link
                to={`/thought/${todo.thoughtId}`}
                className="text-sm underline text-muted-foreground hover:text-primary ml-auto"
              >原始思緒</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
