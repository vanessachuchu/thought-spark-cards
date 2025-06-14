
import { useState } from "react";
import TopNav from "@/components/TopNav";
import ThoughtCard from "@/components/ThoughtCard";

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Index() {
  const [thoughts, setThoughts] = useState([
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
  ]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [now, setNow] = useState(getTime());

  // 自動時間刷新
  import.meta.env.SSR || setTimeout(() => setNow(getTime()), 1000);

  function handleAdd() {
    console.log("handleAdd called");
    console.log("content:", content);
    console.log("tags:", tags);
    
    if (!content.trim()) {
      console.log("Content is empty, not adding");
      return;
    }
    
    // 使用時間戳確保 ID 唯一性
    const newId = Date.now().toString();
    const processedTags = tags
      .split(/[,\s]+/)
      .filter(tag => tag.trim() !== "")
      .map(tag => tag.trim());
    
    console.log("processedTags:", processedTags);
    console.log("newId:", newId);
    
    const newThought = {
      id: newId,
      content: content.trim(),
      tags: processedTags
    };
    
    console.log("newThought:", newThought);
    
    setThoughts(prevThoughts => {
      const updatedThoughts = [...prevThoughts, newThought];
      console.log("updatedThoughts:", updatedThoughts);
      return updatedThoughts;
    });
    
    setContent("");
    setTags("");
    
    console.log("Form reset completed");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 日期與時間區塊 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-primary" data-testid="today-date">{getToday()}</div>
            <div className="text-lg text-muted-foreground">{now}</div>
          </div>
          {/* 新增卡片輸入區 */}
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={2}
                placeholder="💡 輸入新的思緒內容..."
                className="w-full min-w-[260px] max-w-md resize-none rounded-md border border-border focus:ring-2 focus:ring-primary/30 bg-white px-3 py-2 text-base"
              />
              <div className="text-xs text-muted-foreground mt-1">可加入 emoji、hashtag</div>
            </div>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tag (用逗號或空格分隔)"
              className="mt-1 md:mt-0 w-full md:w-48 rounded border border-border px-2 py-1 text-sm bg-white"
            />
            <button
              onClick={handleAdd}
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 transition disabled:opacity-50"
              disabled={!content.trim()}
            >
              新增
            </button>
          </div>
        </div>

        {/* 今日卡片列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {thoughts.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">尚無今日思緒卡片</div>
          ) : (
            thoughts.map(thought => (
              <ThoughtCard key={thought.id} {...thought} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
