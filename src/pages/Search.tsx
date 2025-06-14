
import TopNav from "@/components/TopNav";
import { useState } from "react";

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

export default function SearchPage() {
  const [q, setQ] = useState("");
  const search = q.trim().toLowerCase();
  const results = !search
    ? []
    : demoThoughts.filter(
        t =>
          t.content.toLowerCase().includes(search) ||
          t.tags.some(tag => tag.toLowerCase().includes(search))
      );

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">🔍 思緒搜尋</div>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full rounded border border-border px-3 py-2 text-base mb-6"
          placeholder="輸入關鍵字或標籤"
        />
        {!search ? (
          <div className="text-muted-foreground">請輸入關鍵字開始搜尋。</div>
        ) : results.length === 0 ? (
          <div className="text-muted-foreground">找不到相關思緒</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {results.map(t => (
              <div key={t.id} className="bg-card p-4 rounded-lg border border-border">
                <div className="mb-2">{t.content}</div>
                <div className="flex gap-2">
                  {t.tags.map(tag => (
                    <span key={tag} className="bg-accent px-2 py-0.5 rounded text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
