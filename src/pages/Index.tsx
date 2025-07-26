
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Brain } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThoughtCard from "@/components/ThoughtCard";
import NewThoughtDialog from "@/components/NewThoughtDialog";
import { CarouselThoughts } from "@/components/ui/carousel-thoughts";
import { CalendarTimeTable } from "@/components/CalendarTimeTable";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { zhTW } from "date-fns/locale";

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Index() {
  const { thoughts } = useThoughts();
  const { todos } = useTodos();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isNewThoughtDialogOpen, setIsNewThoughtDialogOpen] = useState(false);
  
  // 統計數據計算
  const today = new Date().toDateString();
  
  const todayThoughts = thoughts.filter(thought => {
    const thoughtDate = new Date(thought.createdAt || Date.now()).toDateString();
    return thoughtDate === today;
  });
  
  // 獲取指定日期的思緒
  const getThoughtsForDate = (date: Date) => {
    return thoughts.filter(thought => {
      const thoughtDate = new Date(thought.createdAt || Date.now());
      return isSameDay(thoughtDate, date);
    });
  };
  
  // 獲取有思緒記錄的日期
  const getDatesWithThoughts = () => {
    return thoughts.map(thought => new Date(thought.createdAt || Date.now()));
  };

  // 獲取有待辦事項的日期
  const getDatesWithTodos = () => {
    const dates: Date[] = [];
    const dateStrings = new Set();
    
    todos.forEach((todo) => {
      if (todo.scheduledDate && !dateStrings.has(todo.scheduledDate)) {
        dateStrings.add(todo.scheduledDate);
        dates.push(new Date(todo.scheduledDate));
      }
    });
    
    return dates;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-4xl mb-4">🧘‍♀️</div>
          <h1 className="text-3xl font-light mb-2">脈德小腦瓜</h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-6 -mt-6">
        {/* 思緒日曆與今日思緒 - 提到最前面作為主要內容 */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：思緒日曆 - 占2個網格 */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 font-medium">
                  <CalendarIcon className="w-6 h-6" />
                  思緒日曆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setCurrentCardIndex(0); // 重置卡片索引
                    }
                  }}
                  locale={zhTW}
                  className="w-full"
                  modifiers={{
                    hasThoughts: getDatesWithThoughts(),
                    hasTodos: getDatesWithTodos()
                  }}
                  modifiersClassNames={{
                    hasThoughts: "bg-primary/30 text-primary-foreground font-semibold border border-primary/50 relative after:content-['●'] after:absolute after:top-1 after:right-1 after:text-primary after:text-xs",
                    hasTodos: "bg-accent/30 text-accent-foreground font-semibold border border-accent/50 relative before:content-['■'] before:absolute before:bottom-1 before:left-1 before:text-secondary-foreground before:text-xs"
                  }}
                />
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                    <span className="inline-block w-3 h-3 bg-primary/30 rounded border border-primary/50"></span>
                    <span>有思緒記錄 ●</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
                    <span className="inline-block w-3 h-3 bg-accent/30 rounded border border-accent/50"></span>
                    <span>有待辦行程 ■</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：今日思緒 - 占1個網格 */}
          <Card className="shadow-soft border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 font-medium">
                <Brain className="w-6 h-6" />
                今日思緒
                {todayThoughts.length > 0 && (
                  <Badge variant="secondary">
                    {todayThoughts.length} 條記錄
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayThoughts.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {todayThoughts
                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                    .map((thought) => (
                      <div 
                        key={thought.id}
                        className="p-3 border border-border rounded-lg bg-background/60 hover:bg-muted/30 transition-smooth cursor-pointer shadow-soft"
                        onClick={() => window.location.href = `/thought/${thought.id}`}
                      >
                        <div className="text-sm text-muted-foreground mb-1">
                          {new Date(thought.createdAt || Date.now()).toLocaleTimeString('zh-TW', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <p className="text-sm line-clamp-2">
                          {thought.content}
                        </p>
                        {thought.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {thought.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="flex items-center justify-center text-center text-muted-foreground min-h-[200px]">
                  <div>
                    <div className="text-4xl mb-4">💭</div>
                    <p className="text-lg mb-2">今日還沒有思緒記錄</p>
                    <p className="text-sm">點擊右下角 ✨ 按鈕記錄新想法</p>
                  </div>
                </div>
              )}
              
              {todayThoughts.length > 0 && (
                <div className="mt-4 text-right">
                  <Link
                    to="/search"
                    className="text-sm text-primary hover:text-primary/80 transition-smooth"
                  >
                    查看全部思緒
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>



        {/* 選定日期的思緒內容（當不是今日時顯示） */}
        {!isSameDay(selectedDate, new Date()) && (
          <Card className="mb-6 shadow-soft border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 font-medium">
                <CalendarIcon className="w-6 h-6" />
                {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })} 的思緒
                {getThoughtsForDate(selectedDate).length > 0 && (
                  <Badge variant="secondary">
                    {getThoughtsForDate(selectedDate).length} 條記錄
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getThoughtsForDate(selectedDate).length > 0 ? (
                <CarouselThoughts
                  currentIndex={currentCardIndex}
                  onIndexChange={setCurrentCardIndex}
                >
                  {getThoughtsForDate(selectedDate).map((thought) => (
                    <ThoughtCard 
                      key={thought.id} 
                      {...thought} 
                    />
                  ))}
                </CarouselThoughts>
              ) : (
                <div className="flex items-center justify-center text-center text-muted-foreground min-h-[200px]">
                  <div>
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-lg mb-2">
                      {format(selectedDate, 'MM月dd日', { locale: zhTW })}沒有思緒記錄
                    </p>
                    <p className="text-sm">選擇其他有記錄的日期來查看</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 時間表 - 只顯示今日的 */}
        {isSameDay(selectedDate, new Date()) && (
          <Card className="mb-6 shadow-soft border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 font-medium">
                <CalendarIcon className="w-6 h-6" />
                今日行程安排
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CalendarTimeTable selectedDate={selectedDate} />
            </CardContent>
          </Card>
        )}
        
        {/* 浮動新思緒按鈕 */}
        <button
          onClick={() => setIsNewThoughtDialogOpen(true)}
          className="fab"
        >
          ✨
        </button>

        {/* 新思緒對話框 */}
        <NewThoughtDialog
          isOpen={isNewThoughtDialogOpen}
          onClose={() => setIsNewThoughtDialogOpen(false)}
        />
      </main>
    </div>
  );
}
