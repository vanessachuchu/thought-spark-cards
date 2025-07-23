
import { useState } from "react";
import { Plus, Calendar as CalendarIcon, CheckSquare } from "lucide-react";
import ThoughtCard from "@/components/ThoughtCard";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { Link } from "react-router-dom";

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Index() {
  const { thoughts, addThought } = useThoughts();
  const { todos } = useTodos();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [now, setNow] = useState(getTime());
  
  // 獲取今天的思緒和待辦事項
  const today = new Date().toDateString();
  const todayThoughts = thoughts.filter(thought => {
    const thoughtDate = new Date(thought.createdAt || Date.now()).toDateString();
    return thoughtDate === today;
  });
  const pendingTodos = todos.filter(todo => !todo.done);

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
      {/* Hero Section */}
      <div className="text-center py-8 px-4">
        <div className="text-4xl mb-4">💡</div>
        <h1 className="text-3xl font-bold text-foreground mb-2">思緒探索空間</h1>
        <p className="text-muted-foreground">捕捉靈感 • 深度對話 • 化為行動</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-6">
        {/* 今日概覽 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💭</span>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">今日思緒</div>
                <div className="text-lg font-semibold text-foreground">{todayThoughts.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">待完成</div>
                <div className="text-lg font-semibold text-foreground">{pendingTodos.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">總記錄</div>
                <div className="text-lg font-semibold text-foreground">{thoughts.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 捕捉新思緒區塊 */}
        <div className="mb-8 bg-gradient-to-br from-card via-background to-card rounded-2xl p-4 md:p-8 shadow-elegant border border-border">
          <div className="relative">
            {/* 右上角的日期時間資訊 */}
            <div className="absolute top-0 right-0 text-right">
              <div className="text-sm text-stone-500 font-light" data-testid="today-date">
                {getToday()}
              </div>
              <div className="text-xs text-stone-400 font-light">
                {now}
              </div>
            </div>

            {/* 主要內容區塊 */}
            <div className="glass rounded-xl p-4 md:p-6 shadow-soft border border-border/30">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-lg md:text-xl">💭</span>
                </div>
                <h3 className="text-lg md:text-xl font-medium text-foreground">捕捉新思緒</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={4}
                    placeholder="✨ 丟掉"
                    className="w-full resize-none rounded-lg border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base placeholder-muted-foreground transition-smooth"
                  />
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <span>🌿</span>
                    <span>用心感受每一個當下</span>
                  </div>
                </div>
                
                <div>
                  <input
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="🏷️ 標籤 (用逗號或空格分隔)"
                    className="w-full rounded-lg border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base placeholder-muted-foreground transition-smooth"
                  />
                </div>
                
                <button
                  onClick={handleAdd}
                  className="w-full bg-gradient-primary text-primary-foreground px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-medium shadow-soft hover:shadow-elegant transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  disabled={!content.trim()}
                >
                  <span>✨</span>
                  <span>記錄思緒</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作區 */}
        {(todayThoughts.length > 0 || pendingTodos.length > 0) && (
          <div className="mb-6 bg-card rounded-xl p-4 shadow-soft border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">快速操作</h3>
            <div className="flex gap-3">
              {pendingTodos.length > 0 && (
                <Link 
                  to="/todo"
                  className="flex-1 bg-gradient-warm text-white px-4 py-3 rounded-lg font-medium text-center transition-smooth hover:shadow-soft"
                >
                  📋 查看待辦 ({pendingTodos.length})
                </Link>
              )}
              <Link 
                to="/calendar"
                className="flex-1 bg-gradient-primary text-primary-foreground px-4 py-3 rounded-lg font-medium text-center transition-smooth hover:shadow-soft"
              >
                📅 查看日曆
              </Link>
            </div>
          </div>
        )}

        {/* 思緒卡片網格 */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {thoughts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">🌸</div>
              <p className="text-lg mb-2">靜心等待第一份思緒</p>
              <p className="text-sm">點擊右下角「✨」開始記錄想法</p>
            </div>
          ) : (
            thoughts.slice(0, 6).map((thought) => (
              <ThoughtCard 
                key={thought.id} 
                {...thought} 
              />
            ))
          )}
          
          {thoughts.length > 6 && (
            <div className="col-span-full text-center pt-4">
              <Link
                to="/search"
                className="text-primary hover:text-primary/80 text-sm underline transition-smooth"
              >
                查看全部 {thoughts.length} 個記錄
              </Link>
            </div>
          )}
        </div>
        
        {/* 浮動新靈感按鈕 */}
        <button
          onClick={() => {
            document.querySelector('textarea')?.focus();
            document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="fab"
        >
          ✨
        </button>
      </main>
    </div>
  );
}
