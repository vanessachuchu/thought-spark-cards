
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
        {/* 統一的頁面頂部區塊 - 創意設計 */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 左側：日期時間區塊 */}
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2" data-testid="today-date">
                    {getToday()}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">
                    {now}
                  </div>
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ✨ 今日思緒
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：新增思緒區塊 */}
            <div className="flex-1 lg:w-2/3">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">捕捉新思緒</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={4}
                      placeholder="✨ 你的想法是什麼？讓創意自由流淌..."
                      className="w-full resize-none rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white px-4 py-3 text-base placeholder-gray-500 transition-all duration-200"
                    />
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span>💫</span>
                      <span>支援 emoji、hashtag 和任何創意表達</span>
                    </div>
                  </div>
                  
                  <div>
                    <input
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="🏷️ 標籤 (用逗號或空格分隔)"
                      className="w-full rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white px-4 py-3 text-sm placeholder-gray-500 transition-all duration-200"
                    />
                  </div>
                  
                  <button
                    onClick={handleAdd}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!content.trim()}
                  >
                    <span>✨</span>
                    <span>新增思緒</span>
                  </button>
                </div>
              </div>
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
