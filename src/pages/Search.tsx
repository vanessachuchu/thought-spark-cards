
import TopNav from "@/components/TopNav";
import { useState, useMemo } from "react";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import ThoughtCard from "@/components/ThoughtCard";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const { thoughts } = useThoughts();
  const { todos } = useTodos();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"thoughts" | "todos">("thoughts");

  const filteredThoughts = useMemo(() => {
    if (!searchQuery.trim()) return thoughts;
    
    const query = searchQuery.toLowerCase();
    return thoughts.filter(thought => 
      thought.content.toLowerCase().includes(query) ||
      thought.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [thoughts, searchQuery]);

  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos;
    
    const query = searchQuery.toLowerCase();
    return todos.filter(todo => 
      todo.content.toLowerCase().includes(query)
    );
  }, [todos, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">🔍 搜尋</div>
        
        {/* 搜尋輸入框 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋思緒內容或標籤..."
            className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:ring-2 focus:ring-primary/30 bg-white"
          />
        </div>

        {/* 標籤切換 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("thoughts")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "thoughts"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            思緒卡片 ({filteredThoughts.length})
          </button>
          <button
            onClick={() => setActiveTab("todos")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "todos"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            待辦事項 ({filteredTodos.length})
          </button>
        </div>

        {/* 搜尋結果 */}
        {searchQuery.trim() === "" ? (
          <div className="text-center py-12 text-muted-foreground">
            在上方輸入關鍵字開始搜尋
          </div>
        ) : (
          <div>
            {activeTab === "thoughts" ? (
              filteredThoughts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  沒有找到符合的思緒卡片
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredThoughts.map(thought => (
                    <ThoughtCard key={thought.id} {...thought} />
                  ))}
                </div>
              )
            ) : (
              filteredTodos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  沒有找到符合的待辦事項
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTodos.map(todo => (
                    <div key={todo.id} className="bg-card p-4 rounded-xl border border-border shadow flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        todo.done
                          ? "bg-primary border-primary"
                          : "bg-white border-border"
                      }`}>
                        {todo.done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`flex-1 ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {todo.content}
                      </span>
                      {todo.thoughtId && (
                        <Link
                          to={`/thought/${todo.thoughtId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          原始思緒
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
