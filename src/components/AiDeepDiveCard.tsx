
import { useRef, useState } from "react";
import { useAiDeepDive } from "@/hooks/useAiDeepDive";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Send } from "lucide-react";
import { MindMapVisualization } from "./MindMapVisualization";
import { ActionPlanGenerator } from "./ActionPlanGenerator";

/**
 * AI 深入自我探索卡片 (用於思緒內容自我提問、反思引導)
 */
export function AiDeepDiveCard({ 
  thoughtContent, 
  thoughtId,
  initialConversation,
  onActionPlanGenerated,
  onConversationUpdate 
}: { 
  thoughtContent: string;
  thoughtId: string;
  initialConversation?: Array<{role: "user" | "assistant" | "system"; content: string}>;
  onActionPlanGenerated?: (plan: string) => void;
  onConversationUpdate?: (messages: Array<{role: "user" | "assistant" | "system"; content: string}>) => void;
}) {
  const {
    messages,
    answering,
    error,
    apiKey,
    saveApiKey,
    sendMessage,
    reset
  } = useAiDeepDive(thoughtContent, initialConversation, onConversationUpdate);

  const [input, setInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(!apiKey);
  const [showMindMap, setShowMindMap] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
    inputRef.current?.focus();
  }

  const handleActionPlanGenerated = (plan: string) => {
    if (onActionPlanGenerated) {
      onActionPlanGenerated(plan);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow flex flex-col gap-3">
      <div className="font-bold text-base mb-2 flex items-center gap-2">
        🌱 AI自我探索
        <div className="ml-auto flex gap-2">
          <button
            className="text-xs underline text-muted-foreground"
            onClick={() => setShowMindMap(!showMindMap)}
            title="顯示/隱藏思考脈絡圖"
          >
            {showMindMap ? '隱藏' : '顯示'}脈絡圖
          </button>
          <button
            className="text-xs underline text-muted-foreground"
            onClick={reset}
            title="重啟對話"
            aria-label="重啟對話"
          >
            <RefreshCcw size={15} className="inline mr-1 mb-1" />
            重新開始
          </button>
        </div>
      </div>

      {/* 思考脈絡圖 */}
      {showMindMap && messages.length > 2 && (
        <div className="mb-4">
          <MindMapVisualization messages={messages} thoughtContent={thoughtContent} />
        </div>
      )}

      {/* API KEY 提示條區塊 */}
      {showApiKey ? (
        <div className="mb-2 flex flex-col gap-2">
          <label className="text-sm font-medium">請輸入你的 OpenAI API 金鑰：</label>
          <input
            type="password"
            autoComplete="off"
            className="rounded border border-border px-3 py-2 text-sm bg-background"
            placeholder="sk-..."
            value={apiKey}
            onChange={e => saveApiKey(e.target.value)}
            style={{ fontFamily: 'monospace', letterSpacing: 1 }}
          />
          <Button
            type="button"
            className="self-end mt-1"
            size="sm"
            onClick={() => setShowApiKey(false)}
            disabled={!apiKey}
          >
            開始對話
          </Button>
          <div className="text-xs text-muted-foreground mt-1">
            API 金鑰只存於本機 localStorage。請勿存入生產、商業用途。
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-[150px] overflow-y-auto px-1 py-3 bg-background rounded">
            {messages
              .filter(msg => msg.role !== "system") // system 指令不顯示
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex items-start gap-2 ${
                    msg.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap text-sm ${
                      msg.role === "assistant"
                        ? "bg-accent text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="mt-1">
                    {msg.role === "assistant" ? (
                      <span className="text-base">🤖</span>
                    ) : (
                      <span className="text-base">🙋</span>
                    )}
                  </div>
                </div>
              ))}
            {answering && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <span className="animate-pulse">🤖 正在回覆...</span>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-500 mb-2">⚠️ {error}</div>
            )}
          </div>
          
          {/* 傳訊息輸入 */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-center mt-2"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              className="resize-none"
              placeholder="回應AI的提問，或輸入自我探索的想法…"
              disabled={answering}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10"
              disabled={!input.trim() || answering}
              title="送出"
              tabIndex={0}
            >
              <Send size={18} />
            </Button>
          </form>
          
          {/* 行動方案生成器 */}
          {messages.length > 2 && (
            <ActionPlanGenerator 
              messages={messages}
              thoughtContent={thoughtContent}
              onGenerateActionPlan={handleActionPlanGenerated}
            />
          )}
          
          <button
            className="text-xs text-muted-foreground underline mt-2"
            onClick={() => setShowApiKey(true)}
            type="button"
          >
            切換/修改 API 金鑰
          </button>
        </>
      )}
    </div>
  );
}

export default AiDeepDiveCard;
