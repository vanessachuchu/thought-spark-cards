
import TopNav from "@/components/TopNav";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";

export default function TodoPage() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();
  const [newTodoContent, setNewTodoContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAddTodo = () => {
    if (!newTodoContent.trim()) return;
    addTodo({
      content: newTodoContent.trim(),
      done: false
    });
    setNewTodoContent("");
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return;
    updateTodo(editingId, { content: editContent.trim() });
    setEditingId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除這個待辦事項嗎？")) {
      deleteTodo(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">📌 行動清單 To-do</div>
        
        {/* 新增待辦區域 */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-3">新增待辦事項</h3>
          <div className="flex gap-3">
            <input
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              placeholder="輸入新的待辦事項..."
              className="flex-1 rounded border border-border px-3 py-2 text-sm bg-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button
              onClick={handleAddTodo}
              disabled={!newTodoContent.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={16} />
              新增
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {todos.length === 0 ? (
            <div className="text-muted-foreground">暫無待辦，從思緒卡片新增吧！</div>
          ) : todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border shadow group">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.done
                    ? "bg-primary border-primary"
                    : "bg-white border-border"
                }`}
                onClick={() => toggleTodo(todo.id)}
                aria-label="打勾完成"
              >
                {todo.done ? (
                  <span className="text-white text-lg font-bold">✓</span>
                ) : null}
              </button>
              
              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 rounded border border-border px-2 py-1 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <>
                  <span className={`text-base flex-1 ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {todo.content}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(todo.id, todo.content)}
                      className="p-1 text-gray-500 hover:text-primary transition"
                      title="編輯"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-1 text-gray-500 hover:text-red-500 transition"
                      title="刪除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {todo.thoughtId && (
                    <Link
                      to={`/thought/${todo.thoughtId}`}
                      className="text-sm underline text-muted-foreground hover:text-primary"
                    >原始思緒</Link>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
