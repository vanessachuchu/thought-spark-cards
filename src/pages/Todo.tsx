
import TopNav from "@/components/TopNav";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Edit, Trash2, Plus, Calendar, Clock } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TodoPage() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();
  const [newTodoContent, setNewTodoContent] = useState("");
  const [newTodoDate, setNewTodoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTodoTime, setNewTodoTime] = useState("09:00");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const handleAddTodo = () => {
    if (!newTodoContent.trim()) return;
    addTodo({
      content: newTodoContent.trim(),
      done: false,
      scheduledDate: newTodoDate,
      scheduledTime: newTodoTime
    });
    setNewTodoContent("");
    setNewTodoDate(new Date().toISOString().split('T')[0]);
    setNewTodoTime("09:00");
  };

  const handleStartEdit = (id: string, content: string, scheduledDate?: string, scheduledTime?: string) => {
    setEditingId(id);
    setEditContent(content);
    setEditDate(scheduledDate || new Date().toISOString().split('T')[0]);
    setEditTime(scheduledTime || "09:00");
  };

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return;
    updateTodo(editingId, { 
      content: editContent.trim(),
      scheduledDate: editDate,
      scheduledTime: editTime
    });
    setEditingId(null);
    setEditContent("");
    setEditDate("");
    setEditTime("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditDate("");
    setEditTime("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除這個待辦事項嗎？")) {
      deleteTodo(id);
    }
  };

  // 按日期分組待辦事項
  const groupedTodos = todos.reduce((groups, todo) => {
    const date = todo.scheduledDate || '未安排';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(todo);
    return groups;
  }, {} as Record<string, typeof todos>);

  // 對每個日期的待辦事項按時間排序
  Object.keys(groupedTodos).forEach(date => {
    groupedTodos[date].sort((a, b) => {
      const timeA = a.scheduledTime || "00:00";
      const timeB = b.scheduledTime || "00:00";
      return timeA.localeCompare(timeB);
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">📌 行動清單 To-do</div>
        
        {/* 新增待辦區域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">新增待辦事項</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">日期</label>
                <Input
                  type="date"
                  value={newTodoDate}
                  onChange={(e) => setNewTodoDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">時間</label>
                <Input
                  type="time"
                  value={newTodoTime}
                  onChange={(e) => setNewTodoTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">內容</label>
              <Textarea
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="輸入新的待辦事項..."
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleAddTodo()}
              />
            </div>
            <Button
              onClick={handleAddTodo}
              disabled={!newTodoContent.trim()}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              新增待辦事項
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {Object.keys(groupedTodos).length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              暫無待辦，開始新增你的第一個行程吧！
            </div>
          ) : (
            Object.entries(groupedTodos)
              .sort(([dateA], [dateB]) => {
                if (dateA === '未安排') return 1;
                if (dateB === '未安排') return -1;
                return dateA.localeCompare(dateB);
              })
              .map(([date, todosForDate]) => (
                <Card key={date}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar size={20} />
                      {date === '未安排' ? '未安排日期' : 
                        new Date(date).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })
                      }
                      <span className="text-sm font-normal text-muted-foreground">
                        ({todosForDate.length} 項)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todosForDate.map(todo => (
                      <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg border border-border group hover:bg-muted/50 transition-colors">
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
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                保存
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                取消
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {todo.scheduledTime && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                    <Clock size={12} />
                                    {todo.scheduledTime}
                                  </div>
                                )}
                              </div>
                              <span className={`text-base ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {todo.content}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(todo.id, todo.content, todo.scheduledDate, todo.scheduledTime)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(todo.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            
                            {todo.thoughtId && (
                              <Link
                                to={`/thought/${todo.thoughtId}`}
                                className="text-sm underline text-muted-foreground hover:text-primary"
                              >
                                原始思緒
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </main>
    </div>
  );
}
