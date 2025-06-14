
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopNav from "@/components/TopNav";
import { useThoughts } from "@/hooks/useThoughts";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { zhTW } from "date-fns/locale";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { thoughts } = useThoughts();

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

  const selectedDateThoughts = getThoughtsForDate(selectedDate);
  const datesWithThoughts = getDatesWithThoughts();

  return (
    <div className="min-h-screen bg-stone-50">
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="text-2xl font-light mb-6 text-stone-700">📅 思緒日曆</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
                  hasThoughts: datesWithThoughts
                }}
                modifiersClassNames={{
                  hasThoughts: "bg-stone-200/60 text-stone-700 font-medium"
                }}
              />
              <div className="mt-4 text-sm text-stone-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-stone-200/60 rounded"></div>
                  <span className="font-light">有思緒記錄的日期</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 選定日期的思緒卡片 */}
          <Card className="bg-white/80 border-stone-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-light text-stone-700">
                {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })} 的思緒
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateThoughts.length === 0 ? (
                <div className="text-center text-stone-500 py-8">
                  <div className="text-4xl mb-2">🌸</div>
                  <p className="font-light">這天還沒有思緒記錄</p>
                  <p className="text-sm mt-1 font-light">到「Today」頁面新增今日的思緒吧！</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
