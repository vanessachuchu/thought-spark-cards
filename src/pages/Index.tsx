
import { useState } from "react";
import TopNav from "@/components/TopNav";
import DraggableThoughtCard from "@/components/DraggableThoughtCard";
import { useThoughts } from "@/hooks/useThoughts";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function DroppableArea({ children }: { children: React.ReactNode }) {
  const [, drop] = useDrop({
    accept: 'thought-card',
    drop: () => ({ name: 'drop-area' }),
  });

  return (
    <div ref={drop} className="relative min-h-[600px] bg-accent/10 rounded-lg border-2 border-dashed border-accent p-4">
      {children}
    </div>
  );
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
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* 日期與時間區塊 */}
          <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="today-date">{getToday()}</div>
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

          {/* 自由拖移的卡片區域 */}
          <DroppableArea>
            {thoughts.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                尚無今日思緒卡片
              </div>
            ) : (
              thoughts.map((thought, index) => (
                <DraggableThoughtCard 
                  key={thought.id} 
                  {...thought} 
                  initialPosition={{
                    x: 20 + (index % 3) * 300,
                    y: 20 + Math.floor(index / 3) * 200
                  }}
                />
              ))
            )}
          </DroppableArea>
        </main>
      </div>
    </DndProvider>
  );
}
