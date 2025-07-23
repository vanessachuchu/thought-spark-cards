
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { CalendarTimeTable } from "@/components/CalendarTimeTable";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { zhTW } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { thoughts } = useThoughts();
  const { getTodosByDate } = useTodos();

  // 獲取選定日期的思緒卡片
  const getThoughtsForDate = (date: Date) => {
    return thoughts.filter(thought => {
      const thoughtDate = new Date(parseInt(thought.id));
      return isSameDay(thoughtDate, date);
    });
  };

  // 獲取有卡片記錄的日期
  const getDatesWithThoughts = () => {
    return thoughts.map(thought => new Date(parseInt(thought.id)));
  };

  // 獲取有待辦事項的日期
  const getDatesWithTodos = () => {
    const dates: Date[] = [];
    const dateStrings = new Set();
    
    // 從所有待辦事項中提取日期
    const allTodos = JSON.parse(localStorage.getItem('todos-data') || '[]');
    allTodos.forEach((todo: any) => {
      if (todo.scheduledDate && !dateStrings.has(todo.scheduledDate)) {
        dateStrings.add(todo.scheduledDate);
        dates.push(new Date(todo.scheduledDate));
      }
    });
    
    return dates;
  };

  const selectedDateThoughts = getThoughtsForDate(selectedDate);
  const selectedDateString = format(selectedDate, "yyyy-MM-dd");
  const selectedDateTodos = getTodosByDate(selectedDateString);
  
  const datesWithThoughts = getDatesWithThoughts();
  const datesWithTodos = getDatesWithTodos();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回首頁</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">思緒日曆</h1>
            <p className="text-sm text-muted-foreground">時間軸上的思維軌跡</p>
          </div>
          
          <div className="w-16"></div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* 日曆區域 */}
          <Card className="bg-white/80 border-stone-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-light text-stone-700">選擇日期</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={zhTW}
                className="w-full"
                modifiers={{
                  hasThoughts: datesWithThoughts,
                  hasTodos: datesWithTodos
                }}
                modifiersClassNames={{
                  hasThoughts: "bg-blue-100 text-blue-700 font-medium",
                  hasTodos: "bg-green-100 text-green-700 font-medium"
                }}
              />
              <div className="mt-4 text-sm text-stone-500 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded border border-blue-200"></div>
                  <span className="font-light">有思緒記錄</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 rounded border border-green-200"></div>
                  <span className="font-light">有待辦行程</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 時間表 */}
          <div className="xl:col-span-2">
            <CalendarTimeTable selectedDate={selectedDate} />
          </div>
        </div>

        {/* 思緒卡片區域 */}
        {selectedDateThoughts.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white/80 border-stone-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-light text-stone-700">
                  {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })} 的思緒
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDateThoughts.map(thought => (
                    <div
                      key={thought.id}
                      className="border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors bg-white/50"
                    >
                      <div className="text-sm text-stone-400 mb-2 font-light">
                        {format(new Date(parseInt(thought.id)), "HH:mm")}
                      </div>
                      <div className="mb-3 text-stone-700 font-light">{thought.content}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {thought.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-stone-100 px-2 py-0.5 rounded text-sm text-stone-600 font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/thought/${thought.id}`}
                          className="text-sm underline text-stone-600 hover:text-stone-500 font-light"
                        >
                          查看詳情
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
