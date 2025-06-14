
import { useState } from "react";
import TopNav from "@/components/TopNav";
import ThoughtCard from "@/components/ThoughtCard";
import { useThoughts } from "@/hooks/useThoughts";

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Index() {
  const { thoughts, addThought } = useThoughts();
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
    
    addThought(newThought);
    
    setContent("");
    setTags("");
    
    console.log("Form reset completed");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 頁面標題與新增思緒區塊 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-primary mb-2" data-testid="today-date">{getToday()}</div>
            <div className="text-lg text-muted-foreground">{now}</div>
          </div>
          
          {/* 新增思緒輸入區塊 */}
          <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-3">新增思緒</h3>
            <div className="space-y-3">
              <div>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  placeholder="💡 輸入新的思緒內容..."
                  className="w-full min-w-[300px] resize-none rounded-md border border-border focus:ring-2 focus:ring-primary/30 bg-white px-3 py-2 text-base"
                />
                <div className="text-xs text-muted-foreground mt-1">可加入 emoji、hashtag</div>
              </div>
              <div>
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Tag (用逗號或空格分隔)"
                  className="w-full rounded border border-border px-3 py-2 text-sm bg-white"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 transition disabled:opacity-50"
                disabled={!content.trim()}
              >
                新增思緒
              </button>
            </div>
          </div>
        </div>

        {/* 思緒卡片網格 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {thoughts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              尚無今日思緒卡片
            </div>
          ) : (
            thoughts.map((thought) => (
              <ThoughtCard 
                key={thought.id} 
                {...thought} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
