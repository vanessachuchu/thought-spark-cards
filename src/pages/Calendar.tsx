
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
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-2xl font-bold mb-6 text-primary">📅 思緒日曆</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 日曆區域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">選擇日期</CardTitle>
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
                  hasThoughts: "bg-primary/20 text-primary font-semibold"
                }}
              />
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/20 rounded"></div>
                  <span>有思緒記錄的日期</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 選定日期的思緒卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })} 的思緒
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateThoughts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-2">🤔</div>
                  <p>這天還沒有思緒記錄</p>
                  <p className="text-sm mt-1">到「Today」頁面新增今日的思緒吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateThoughts.map(thought => (
                    <div
                      key={thought.id}
                      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="text-sm text-muted-foreground mb-2">
                        {format(new Date(parseInt(thought.id)), "HH:mm")}
                      </div>
                      <div className="mb-3 text-foreground">{thought.content}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {thought.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-accent px-2 py-0.5 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/thought/${thought.id}`}
                          className="text-sm underline text-primary hover:text-primary/80"
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

        {/* 統計信息 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{thoughts.length}</div>
                <div className="text-sm text-muted-foreground">總思緒數</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{datesWithThoughts.length}</div>
                <div className="text-sm text-muted-foreground">有記錄的天數</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedDateThoughts.length}</div>
                <div className="text-sm text-muted-foreground">今日思緒數</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
