
import { useState } from 'react';
import { AiMessage } from '@/hooks/useAiDeepDive';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ListTodo, TreeDeciduous } from 'lucide-react';

interface ActionPlanGeneratorProps {
  messages: AiMessage[];
  thoughtContent: string;
  onGenerateActionPlan: (plan: string) => void;
}

export function ActionPlanGenerator({ messages, thoughtContent, onGenerateActionPlan }: ActionPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [showPlan, setShowPlan] = useState(false);

  const generateActionPlan = async () => {
    setIsGenerating(true);
    
    // 提取對話中的關鍵內容
    const conversationSummary = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? '我' : 'AI'}: ${msg.content}`)
      .join('\n');
    
    // 生成行動方案（這裡用簡單的邏輯，實際可以調用AI API）
    const actionPlan = `基於您的思緒「${thoughtContent}」和深入探索的對話，以下是建議的行動方案：

📋 行動方案：

1. 立即行動 (今天)
   • 整理目前的想法和發現
   • 確定最重要的下一步行動

2. 短期目標 (本週)
   • 深入研究相關資源或資訊
   • 與相關人員討論或尋求建議
   • 制定具體的執行計劃

3. 中期目標 (本月)
   • 開始執行具體步驟
   • 定期檢視進度和調整方向
   • 記錄學習和成長過程

4. 長期願景 (未來)
   • 持續優化和改進
   • 分享經驗和學習成果
   • 探索更多可能性

💡 關鍵要點：
• 保持開放的心態，隨時調整計劃
• 設定可衡量的里程碑
• 定期回顧和反思進展

你可以根據實際情況調整這個計劃，或者選擇其中最適合的部分開始執行。`;
    
    setGeneratedPlan(actionPlan);
    setShowPlan(true);
    setIsGenerating(false);
  };

  const handleSaveActionPlan = () => {
    onGenerateActionPlan(generatedPlan);
  };

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TreeDeciduous size={16} />
        <span className="text-sm font-semibold">轉化為行動方案</span>
      </div>
      
      {!showPlan ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            當您覺得探索已經到達一定階段時，可以將思考過程轉化為具體的行動方案
          </p>
          <Button 
            onClick={generateActionPlan}
            disabled={isGenerating || messages.length < 3}
            className="w-full"
          >
            <ListTodo size={16} className="mr-2" />
            {isGenerating ? '正在生成行動方案...' : '生成行動方案'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={generatedPlan}
            onChange={(e) => setGeneratedPlan(e.target.value)}
            className="min-h-[200px] text-sm"
            placeholder="編輯您的行動方案..."
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveActionPlan} className="flex-1">
              <ListTodo size={16} className="mr-2" />
              轉為 To-do
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPlan(false)}
              className="flex-1"
            >
              重新生成
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
