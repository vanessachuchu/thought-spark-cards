import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Brain, TrendingUp, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThoughtCard from "@/components/ThoughtCard";
import VoiceInputButton from "@/components/VoiceInputButton";
import { CarouselThoughts } from "@/components/ui/carousel-thoughts";
import { CalendarTimeTable } from "@/components/CalendarTimeTable";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Link } from "react-router-dom";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { zhTW } from "date-fns/locale";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // 語音識別功能
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported: voiceSupported,
    error: voiceError
  } = useVoiceRecognition();
  
  // 統計數據計算
  const today = new Date().toDateString();
  const thisWeek = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });
  
  const todayThoughts = thoughts.filter(thought => {
    const thoughtDate = new Date(thought.createdAt || Date.now()).toDateString();
    return thoughtDate === today;
  });
  
  const thisWeekThoughts = thoughts.filter(thought => {
    const thoughtDate = new Date(thought.createdAt || Date.now());
    return thisWeek.some(day => isSameDay(day, thoughtDate));
  });
  
  const pendingTodos = todos.filter(todo => !todo.done);
  
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

  // 自動時間刷新
  useEffect(() => {
    const timer = setInterval(() => setNow(getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 處理語音識別結果
  useEffect(() => {
    if (transcript && !isRecording) {
      setContent(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, isRecording, resetTranscript]);

  function handleAdd() {
    if (!content.trim()) return;
    
    const newId = Date.now().toString();
    const processedTags = tags
      .split(/[,\s]+/)
      .filter(tag => tag.trim() !== "")
      .map(tag => tag.trim());
    
    const newThought = {
      id: newId,
      content: content.trim(),
      tags: processedTags
    };
    
    addThought(newThought);
    setContent("");
    setTags("");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-4xl mb-4">💡</div>
          <h1 className="text-3xl font-bold mb-2">思緒探索空間</h1>
          <p className="text-primary-foreground/80">捕捉靈感 • 深度對話 • 化為行動</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-6 -mt-6">
        {/* 第一區塊：捕捉新思緒 */}
        <Card className="mb-6 bg-gradient-to-br from-card via-background to-card shadow-elegant border border-border">
          <CardHeader className="relative">
            {/* 右上角的日期時間資訊 */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-sm text-muted-foreground" data-testid="today-date">
                {getToday()}
              </div>
              <div className="text-xs text-muted-foreground/60">
                {now}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💭</span>
              </div>
              <CardTitle className="text-xl">捕捉新思緒</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  placeholder="✨ 記錄你的想法..."
                  className="w-full resize-none rounded-lg border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background px-3 py-2.5 text-sm placeholder-muted-foreground transition-smooth"
                />
                {voiceError && (
                  <div className="text-xs text-destructive mt-2 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{voiceError}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <span>🌿</span>
                  <span>用心感受每一個當下</span>
                  {voiceSupported && (
                    <span className="ml-2">• 🎤 支援語音輸入</span>
                  )}
                </div>
              </div>
              
              {voiceSupported && (
                <VoiceInputButton
                  isRecording={isRecording}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  size="lg"
                />
              )}
            </div>
            
            {isRecording && (
              <div className="text-center py-2">
                <div className="text-sm text-destructive animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-ping"></div>
                  <span>🎤 正在聆聽您的想法...</span>
                </div>
              </div>
            )}
            
            <div>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="🏷️ 標籤 (用逗號或空格分隔)"
                className="w-full rounded-lg border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background px-3 py-2.5 text-sm placeholder-muted-foreground transition-smooth"
              />
            </div>
            
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium shadow-soft hover:shadow-elegant transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!content.trim()}
            >
              <span>✨</span>
              <span>記錄思緒</span>
            </button>
          </CardContent>
        </Card>

        {/* 統計概覽 */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-accent text-white border-0 shadow-glow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{todayThoughts.length}</div>
                  <div className="text-sm text-white/80">今日思緒</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-warm text-white border-0 shadow-glow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingTodos.length}</div>
                  <div className="text-sm text-white/80">待完成</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{thisWeekThoughts.length}</div>
                  <div className="text-sm text-primary-foreground/80">本週記錄</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-secondary border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{thoughts.length}</div>
                  <div className="text-sm text-muted-foreground">總記錄</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 第二區塊：思緒日曆與今日思緒 */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：思緒日曆 */}
          <Card className="shadow-soft border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
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
                  hasThoughts: "bg-primary/20 text-primary font-semibold",
                  hasTodos: "bg-secondary/20 text-secondary-foreground font-semibold"
                }}
              />
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-primary/20 rounded"></span>
                  <span>有思緒記錄</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-secondary/20 rounded"></span>
                  <span>有待辦行程</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 右側：今日思緒 */}
          <Card className="shadow-soft border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
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
                        className="p-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer"
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
                    <p className="text-sm">在上方輸入框記錄新的想法吧</p>
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
          <Card className="mb-6 shadow-soft border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
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

        {/* 第三區塊：時間表 */}
        <Card className="mb-6 shadow-soft border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })} 行程安排
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CalendarTimeTable selectedDate={selectedDate} />
          </CardContent>
        </Card>
        
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