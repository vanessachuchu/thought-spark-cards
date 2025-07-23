import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, CheckSquare, Brain, TrendingUp, Clock, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThoughtCard from "@/components/ThoughtCard";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  const completedTodos = todos.filter(todo => todo.done);
  
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
        {/* 增強統計概覽 */}
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
                  <CheckSquare className="w-5 h-5" />
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

        {/* 布局容器 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 左側：思緒輸入 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 思緒輸入區塊 */}
            <Card className="bg-gradient-to-br from-card via-background to-card shadow-elegant border border-border">
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
          </div>
          
          {/* 右側：迷你日曆和快速操作 */}
          <div className="space-y-6">
            {/* 迷你日曆 */}
            <Card className="shadow-soft border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  思緒日曆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={zhTW}
                  className="w-full"
                  modifiers={{
                    hasThoughts: getDatesWithThoughts()
                  }}
                  modifiersClassNames={{
                    hasThoughts: "bg-primary/20 text-primary font-semibold"
                  }}
                />
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="inline-block w-3 h-3 bg-primary/20 rounded mr-2"></span>
                  有思緒記錄的日期
                </div>
              </CardContent>
            </Card>

            {/* 今日思緒預覽 */}
            {getThoughtsForDate(selectedDate).length > 0 && (
              <Card className="shadow-soft border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>
                      {isSameDay(selectedDate, new Date()) ? '今日思緒' : '選定日期思緒'}
                    </span>
                    <Badge variant="secondary">
                      {getThoughtsForDate(selectedDate).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getThoughtsForDate(selectedDate).slice(0, 2).map(thought => (
                    <div key={thought.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm line-clamp-2">{thought.content}</div>
                      <div className="flex gap-1 mt-2">
                        {thought.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {getThoughtsForDate(selectedDate).length > 2 && (
                    <Link 
                      to="/calendar"
                      className="block text-center text-sm text-primary hover:text-primary/80 transition-smooth"
                    >
                      查看全部 {getThoughtsForDate(selectedDate).length} 條記錄
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 快速操作區 */}
        {(todayThoughts.length > 0 || pendingTodos.length > 0) && (
          <Card className="mb-6 shadow-soft border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">快速操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingTodos.length > 0 && (
                  <Link 
                    to="/todo"
                    className="bg-gradient-warm text-white px-4 py-3 rounded-lg font-medium text-center transition-smooth hover:shadow-soft flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    查看待辦 ({pendingTodos.length})
                  </Link>
                )}
                <Link 
                  to="/calendar"
                  className="bg-gradient-primary text-primary-foreground px-4 py-3 rounded-lg font-medium text-center transition-smooth hover:shadow-soft flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  查看完整日曆
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 最近思緒展示 */}
        <Card className="shadow-soft border border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">最近的思緒</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{thoughts.length} 個記錄</Badge>
                {thoughts.length > 6 && (
                  <Link
                    to="/search"
                    className="text-sm text-primary hover:text-primary/80 transition-smooth"
                  >
                    查看全部
                  </Link>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {thoughts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">🌸</div>
                <p className="text-lg mb-2">靜心等待第一份思緒</p>
                <p className="text-sm">點擊右下角「✨」開始記錄想法</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {thoughts.slice(0, 6).map((thought) => (
                  <ThoughtCard 
                    key={thought.id} 
                    {...thought} 
                  />
                ))}
              </div>
            )}
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