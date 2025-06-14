
import { useParams, useNavigate, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { useState } from "react";
import AiDeepDiveCard from "@/components/AiDeepDiveCard";
import { useThoughts } from "@/hooks/useThoughts";

export default function ThoughtDetail() {
  const { id } = useParams<{ id: string }>();
  const { getThoughtById } = useThoughts();
  const thought = getThoughtById(id || "") || {
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
          <Link
            to="/"
            className="text-muted-foreground text-sm underline hover:text-primary"
          >
            &larr; 返回 Today
          </Link>
        </div>
        <div className="bg-card rounded-xl shadow p-6 border border-border mb-8">
          <div className="text-xl font-bold mb-3">思緒內容</div>
          <div className="text-lg text-foreground mb-3">{thought.content}</div>
          <div className="flex gap-2 mb-3">
            {thought.tags.map(tag => (
              <span
                key={tag}
                className="bg-accent px-2 py-0.5 rounded text-sm"
              >
                {tag}
              </span>
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
        {/* 新增 AI 自我探索卡片 */}
        <AiDeepDiveCard thoughtContent={thought.content} />
      </main>
    </div>
  );
}
