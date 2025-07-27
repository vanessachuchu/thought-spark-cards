
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiMessage } from '@/hooks/useAiDeepDive';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListTodo, Sparkles, Clock, AlertCircle, Circle, Calendar } from 'lucide-react';
import { useAiActionGenerator, ActionItem } from '@/hooks/useAiActionGenerator';
import { useTodos } from '@/hooks/useTodos';
import { useThoughts } from '@/hooks/useThoughts';
import { ActionItemScheduler } from './ActionItemScheduler';

interface ActionPlanGeneratorProps {
  messages: AiMessage[];
  thoughtContent: string;
  onGenerateActionPlan: (plan: string) => void;
  thoughtId?: string;
}

const getPriorityColor = (priority: ActionItem['priority']) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityIcon = (priority: ActionItem['priority']) => {
  switch (priority) {
    case 'high': return <AlertCircle className="w-3 h-3" />;
    case 'medium': return <Circle className="w-3 h-3" />;
    case 'low': return <Circle className="w-3 h-3" />;
    default: return <Circle className="w-3 h-3" />;
  }
};

// 主元件
export function ActionPlanGenerator({ messages, thoughtContent, onGenerateActionPlan, thoughtId }: ActionPlanGeneratorProps) {
  const navigate = useNavigate();
  const { generateActionPlan, isGenerating } = useAiActionGenerator();
  const { addTodo } = useTodos();
  const { getThoughtById, updateGeneratedActions } = useThoughts();
  
  // 從思緒中獲取已生成的行動計畫
  const thought = thoughtId ? getThoughtById(thoughtId) : null;
  const savedActions = thought?.generatedActions || [];
  
  const [generatedActions, setGeneratedActions] = useState<ActionItem[]>(savedActions);
  const [showList, setShowList] = useState(savedActions.length > 0);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [schedulingActionId, setSchedulingActionId] = useState<string | null>(null);

  const handleGenerateActions = async () => {
    const actions = await generateActionPlan(thoughtContent, messages);
    setGeneratedActions(actions);
    setShowList(true);
    
    // 保存到思緒中
    if (thoughtId) {
      updateGeneratedActions(thoughtId, actions);
    }
    
    // 預設選擇前3個高優先級的項目
    const defaultSelected = new Set(
      actions
        .filter(action => action.priority === 'high')
        .slice(0, 3)
        .map(action => action.id)
    );
    setSelectedActions(defaultSelected);
  };

  const toggleActionSelection = (actionId: string) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(actionId)) {
      newSelected.delete(actionId);
    } else {
      newSelected.add(actionId);
    }
    setSelectedActions(newSelected);
  };

  const handleSaveSelectedActions = async () => {
    const selectedItems = generatedActions.filter(action => selectedActions.has(action.id));
    
    console.log(`開始處理 ${selectedItems.length} 個選中的行動項目`);
    
    // 批量添加待辦事項
    const todoPromises = selectedItems.map(action => {
      const todoData = {
        content: action.content,
        done: false,
        thoughtId: thoughtId,
        startDate: action.startDate || undefined,
        startTime: action.startTime || undefined
      };
      
      console.log('Adding todo with data:', todoData);
      return new Promise<void>((resolve) => {
        addTodo(todoData);
        resolve();
      });
    });

    // 等待所有待辦事項添加完成
    await Promise.all(todoPromises);

    // 為了兼容舊的接口，也調用原來的回調
    const todoText = selectedItems
      .map((action, idx) => `${idx + 1}. ${action.content}`)
      .join('\n');
    onGenerateActionPlan(todoText);
    
    console.log(`成功加入 ${selectedItems.length} 個待辦事項到清單`);
    
    // 重置狀態
    setShowList(false);
    setGeneratedActions([]);
    setSelectedActions(new Set());
    
    // 使用 React Router 導航
    navigate('/todo');
  };

  const handleScheduleAction = (actionId: string, schedule: {
    startDate: string;
    endDate?: string;
    startTime: string;
    endTime?: string;
  }) => {
    // 更新行動項目的時程
    const updatedActions = generatedActions.map(action => 
      action.id === actionId 
        ? { ...action, ...schedule }
        : action
    );
    setGeneratedActions(updatedActions);
    
    // 同時更新思緒中的生成行動
    if (thoughtId) {
      updateGeneratedActions(thoughtId, updatedActions);
    }
    
    // 找到被安排的行動並立即加入待辦清單
    const scheduledAction = updatedActions.find(action => action.id === actionId);
    if (scheduledAction) {
      const todoData = {
        content: scheduledAction.content,
        done: false,
        thoughtId: thoughtId,
        startDate: schedule.startDate,
        startTime: schedule.startTime,
        endDate: schedule.endDate,
        endTime: schedule.endTime
      };
      
      console.log('Adding scheduled todo with data:', todoData);
      addTodo(todoData);
      
      // 使用 React Router 導航到待辦頁面
      navigate('/todo');
    }
    
    setSchedulingActionId(null);
  };

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">AI 智慧行動規劃</span>
      </div>
      
      {!showList ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            基於你的思緒內容，AI 將為你生成具體可執行的行動計劃
          </p>
          <Button 
            onClick={handleGenerateActions}
            disabled={isGenerating}
            className="w-full bg-gradient-primary text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? '正在分析並生成行動計劃...' : '生成智慧行動計劃'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            AI 為你生成了 {generatedActions.length} 個建議行動，請選擇要加入待辦清單的項目：
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedActions.map((action) => (
              <Card 
                key={action.id} 
                className={`cursor-pointer transition-all ${
                  selectedActions.has(action.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => toggleActionSelection(action.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded border-2 mt-1 flex items-center justify-center ${
                      selectedActions.has(action.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {selectedActions.has(action.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {getPriorityIcon(action.priority)}
                          <span className="ml-1">
                            {action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}優先級
                          </span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {action.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {action.timeEstimate}
                        </div>
                        {action.startDate && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Calendar className="w-3 h-3" />
                            {action.startDate} {action.startTime}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{action.content}</p>
                      {schedulingActionId === action.id ? (
                        <ActionItemScheduler
                          action={action}
                          onSchedule={handleScheduleAction}
                          onCancel={() => setSchedulingActionId(null)}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSchedulingActionId(action.id);
                          }}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          設定時程
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSaveSelectedActions} 
              className="flex-1 bg-gradient-primary text-primary-foreground"
              disabled={selectedActions.size === 0}
            >
              <ListTodo className="w-4 h-4 mr-2" />
              加入待辦清單 ({selectedActions.size})
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
