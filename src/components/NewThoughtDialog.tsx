import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoiceInputButton from "@/components/VoiceInputButton";
import AiDeepDiveCard from "@/components/AiDeepDiveCard";
import { useThoughts } from "@/hooks/useThoughts";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { MessageCircle, Sparkles } from "lucide-react";

interface NewThoughtDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function getToday() {
  return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function NewThoughtDialog({ isOpen, onClose }: NewThoughtDialogProps) {
  const { addThought } = useThoughts();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [now, setNow] = useState(getTime());
  const [showAiChat, setShowAiChat] = useState(false);
  const [thoughtId, setThoughtId] = useState<string | null>(null);
  const [recordedThoughtContent, setRecordedThoughtContent] = useState("");
  
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

  // 自動時間刷新
  useEffect(() => {
    const timer = setInterval(() => setNow(getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 處理語音識別結果
  useEffect(() => {
    if (transcript) {
      setContent(transcript);
    }
  }, [transcript]);

  // 重置對話框狀態
  useEffect(() => {
    if (!isOpen) {
      setContent("");
      setTags("");
      setShowAiChat(false);
      setThoughtId(null);
    }
  }, [isOpen]);

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
    setThoughtId(newId);
    setRecordedThoughtContent(content.trim());
    setContent("");
    setTags("");
    
    // 記錄思緒後關閉對話框，用戶會回到原先頁面看到新思緒
    setTimeout(() => {
      onClose();
    }, 500);
  }

  function handleStartAiChat() {
    if (!content.trim()) return;
    
    // 如果還沒記錄思緒，先記錄
    if (!thoughtId) {
      handleAdd();
    }
    setShowAiChat(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">💭</span>
            記錄新思緒
          </DialogTitle>
        </DialogHeader>

        {!showAiChat ? (
          <div className="space-y-6">
            {/* 思緒輸入區域 */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-elegant border border-border/50">
              <CardHeader className="relative">
                {/* 右上角的日期時間資訊 */}
                <div className="absolute top-4 right-4 text-right">
                  <div className="text-sm text-muted-foreground">
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
                  <CardTitle className="text-xl font-medium">捕捉新思緒</CardTitle>
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
                
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium shadow-soft hover:shadow-elegant transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!content.trim()}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>記錄思緒</span>
                  </button>
                  
                  <button
                    onClick={handleStartAiChat}
                    className="flex-1 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium shadow-soft hover:shadow-elegant transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!content.trim()}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>深度對話</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 顯示今日已記錄的思緒 */}
            {thoughtId && (
              <Card className="bg-primary/5 border border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium text-primary">已記錄思緒</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date().toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <p className="text-sm">{content || "剛才記錄的內容"}</p>
                  {tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.split(/[,\s]+/).filter(tag => tag.trim()).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {thoughtId && recordedThoughtContent && (
              <AiDeepDiveCard 
                thoughtId={thoughtId}
                thoughtContent={recordedThoughtContent}
              />
            )}
            <div className="flex justify-center">
              <button
                onClick={() => setShowAiChat(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                返回思緒記錄
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}