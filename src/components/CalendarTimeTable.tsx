
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTodos, Todo } from "@/hooks/useTodos";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CalendarTimeTableProps {
  selectedDate: Date;
}

export function CalendarTimeTable({ selectedDate }: CalendarTimeTableProps) {
  const { updateTodo, deleteTodo, toggleTodo, getTodosByDate } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const selectedDateString = format(selectedDate, "yyyy-MM-dd");
  const dayTodos = getTodosByDate(selectedDateString);

  // 生成 6AM-11PM 的時間表
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const todosAtThisHour = dayTodos.filter(todo => {
        if (!todo.startTime) return false;
        const todoHour = parseInt(todo.startTime.split(':')[0]);
        return todoHour === hour;
      });
      
      slots.push({
        time: timeString,
        displayTime: `${hour.toString().padStart(2, '0')}:00`,
        todos: todosAtThisHour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();


  const handleUpdateTodo = (todo: Todo, updates: Partial<Todo>) => {
    updateTodo(todo.id, updates);
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: string) => {
    if (window.confirm("確定要刪除這個待辦事項嗎？")) {
      deleteTodo(id);
    }
  };

  return (
    <Card className="bg-white/80 border-stone-200/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-light text-stone-700">
            {format(selectedDate, "MM月dd日 EEEE", { locale: zhTW })} 的行程
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timeSlots.map((slot) => (
            <div key={slot.time} className="border-b border-stone-100 pb-2">
              <div className="flex items-start gap-3">
                <div className="w-16 text-sm text-stone-500 font-mono pt-1">
                  {slot.displayTime}
                </div>
                <div className="flex-1 min-h-[2rem] bg-stone-50/50 rounded p-2">
                  {slot.todos.length === 0 ? (
                    <div className="text-stone-300 text-sm">─</div>
                  ) : (
                    <div className="space-y-2">
                      {slot.todos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-2 bg-white rounded p-2 border border-stone-200 group"
                        >
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs transition-colors ${
                              todo.done
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-white border-stone-300"
                            }`}
                          >
                            {todo.done ? "✓" : ""}
                          </button>
                          
                          <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Clock size={12} />
                            {todo.startTime}
                            {todo.endTime && ` - ${todo.endTime}`}
                          </div>
                          
                          <span className={`text-sm flex-1 ${
                            todo.done ? "line-through text-stone-400" : "text-stone-700"
                          }`}>
                            {todo.content}
                          </span>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingTodo(todo)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* 編輯對話框 */}
      {editingTodo && (
        <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>編輯行程</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">時間</label>
                <Input
                  type="time"
                  value={editingTodo.startTime || "09:00"}
                  onChange={(e) => setEditingTodo({...editingTodo, startTime: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">內容</label>
                <Textarea
                  value={editingTodo.content}
                  onChange={(e) => setEditingTodo({...editingTodo, content: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUpdateTodo(editingTodo, {
                    content: editingTodo.content,
                    startTime: editingTodo.startTime
                  })} 
                  className="flex-1"
                >
                  保存
                </Button>
                <Button variant="outline" onClick={() => setEditingTodo(null)} className="flex-1">
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
