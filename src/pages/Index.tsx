
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
    <div className="min-h-screen bg-stone-50">
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* 瑜珈風格的頁面頂部區塊 */}
        <div className="mb-8 bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-100 rounded-2xl p-4 md:p-8 shadow-sm border border-stone-200/50">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* 左側：日期時間區塊 - 響應式設計 */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm border border-stone-200/30">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-light text-stone-700 mb-2" data-testid="today-date">
                    {getToday()}
                  </div>
                  <div className="text-base md:text-lg text-stone-500 font-light">
                    {now}
                  </div>
                  <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-stone-200/60 text-stone-600 rounded-full text-sm font-light">
                    ✨ 今日思緒
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：新增思緒區塊 - 完全響應式設計 */}
            <div className="w-full lg:w-2/3 flex-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm border border-stone-200/30">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-stone-400 to-stone-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg md:text-xl">💭</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-light text-stone-700">捕捉新思緒</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={4}
                      placeholder="✨ 讓心中的想法靜靜流淌..."
                      className="w-full resize-none rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 bg-white/90 px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base placeholder-stone-400 transition-all duration-200 font-light"
                    />
                    <div className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                      <span>🌿</span>
                      <span>用心感受每一個當下</span>
                    </div>
                  </div>
                  
                  <div>
                    <input
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="🏷️ 標籤 (用逗號或空格分隔)"
                      className="w-full rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 bg-white/90 px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base placeholder-stone-400 transition-all duration-200 font-light"
                    />
                  </div>
                  
                  <button
                    onClick={handleAdd}
                    className="w-full bg-gradient-to-r from-stone-400 to-stone-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-light shadow-sm hover:shadow-md hover:from-stone-500 hover:to-stone-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                    disabled={!content.trim()}
                  >
                    <span>✨</span>
                    <span>記錄思緒</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 思緒卡片網格 - 響應式設計 */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {thoughts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-stone-500">
              <div className="text-4xl mb-4">🌸</div>
              <p className="font-light">靜心等待第一份思緒</p>
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
