
import { useParams, useNavigate, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { useState } from "react";

export default function ThoughtDetail() {
  // 預設用 demo cards。後續可接資料層。
  const demoThoughts = [
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
  const { id } = useParams<{ id: string }>();
  const thought = demoThoughts.find(t => t.id === id) || {
    id: "",
    content: "找不到此思緒卡片",
    tags: []
  };
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  function handleToDo() {
    // 目前僅導向 To-Do 頁
    navigate("/todo");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground text-sm underline hover:text-primary">&larr; 返回 Today</Link>
        </div>
        <div className="bg-card rounded-xl shadow p-6 border border-border mb-8">
          <div className="text-xl font-bold mb-3">思緒內容</div>
          <div className="text-lg text-foreground mb-3">{thought.content}</div>
          <div className="flex gap-2 mb-3">
            {thought.tags.map(tag => (
              <span key={tag} className="bg-accent px-2 py-0.5 rounded text-sm">{tag}</span>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-base font-semibold mb-1">✏️ 筆記／延伸反思</div>
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 mb-2"
              placeholder="寫下你的反思或筆記..."
            />
            {/* 不做筆記儲存（暫存於本地） */}
          </div>
          <button
            onClick={handleToDo}
            className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 transition"
          >
            轉為 To-do
          </button>
        </div>
      </main>
    </div>
  );
}
