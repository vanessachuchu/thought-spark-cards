
import { useState } from 'react';
import { AiMessage } from '@/hooks/useAiDeepDive';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ListTodo, TreeDeciduous, Sparkles } from 'lucide-react';

interface ActionPlanGeneratorProps {
  messages: AiMessage[];
  thoughtContent: string;
  onGenerateActionPlan: (plan: string) => void;
}

function parseTodoListFromAI(messages: AiMessage[], thoughtContent: string): string {
  // 根據最近的使用者與 AI 對話內容產生約 3~5 個建議 to-do
  // 此為簡版，本地生成，更進階可串接 AI
  const latestUserMsg = messages.filter(m => m.role === "user" && m.content !== thoughtContent).slice(-1)[0]?.content
    || thoughtContent;
  const lastAssistantMsg = messages.filter(m => m.role === "assistant").slice(-1)[0]?.content || "";

  // 簡單根據關鍵詞提出建議
  let suggestions: string[] = [];

  if (latestUserMsg.includes("專案") || lastAssistantMsg.includes("專案")) {
    suggestions.push("規劃專案下一步行動");
    suggestions.push("和團隊討論專案細節");
    suggestions.push("設立專案時程與關鍵里程碑");
  }
  if (latestUserMsg.includes("學習") || lastAssistantMsg.includes("學習")) {
    suggestions.push("搜尋相關主題資源");
    suggestions.push("安排學習時間表");
    suggestions.push("整理學習重點到筆記");
  }
  if (latestUserMsg.length > 14) {
    suggestions.push("將想法拆分成更小的行動步驟");
  }
  // 保底建議
  if (suggestions.length < 3) {
    suggestions = [
      "列出明確可執行的下一步",
      "設定小目標並立即執行第一件事",
      "每日檢視進度，調整處理方向"
    ];
  }

  // 取前面 5 條
  return suggestions.slice(0, 5)
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join('\n');
}

// 主元件
export function ActionPlanGenerator({ messages, thoughtContent, onGenerateActionPlan }: ActionPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTodos, setGeneratedTodos] = useState<string>('');
  const [showList, setShowList] = useState(false);

  const generateTodoList = async () => {
    setIsGenerating(true);
    // 在此如串接 AI 可換成真正API取得結果，現本地產生
    const todoList = parseTodoListFromAI(messages, thoughtContent);
    setGeneratedTodos(todoList);
    setShowList(true);
    setIsGenerating(false);
  };

  const handleSaveTodoList = () => {
    onGenerateActionPlan(generatedTodos);
  };

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} />
        <span className="text-sm font-semibold">AI 生成 To-do List</span>
      </div>
      {!showList ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            當探索到一定階段，可請 AI 幫你產生具體可執行的待辦清單
          </p>
          <Button 
            onClick={generateTodoList}
            disabled={isGenerating || messages.length < 3}
            className="w-full"
          >
            <ListTodo size={16} className="mr-2" />
            {isGenerating ? '正在產生待辦清單...' : '生成 To-do List'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={generatedTodos}
            onChange={(e) => setGeneratedTodos(e.target.value)}
            className="min-h-[140px] text-sm"
            placeholder="可進一步編輯你的待辦清單..."
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveTodoList} className="flex-1">
              <ListTodo size={16} className="mr-2" />
              轉為 To-do
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowList(false)}
              className="flex-1"
              type="button"
            >
              重新生成
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

