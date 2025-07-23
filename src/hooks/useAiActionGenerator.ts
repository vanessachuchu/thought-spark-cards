import { useState } from 'react';

export interface ActionItem {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  category: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

export function useAiActionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateActionPlan = async (thoughtContent: string, aiMessages?: any[]): Promise<ActionItem[]> => {
    setIsGenerating(true);
    
    try {
      // 模擬AI分析思緒內容並生成具體行動計劃
      await new Promise(resolve => setTimeout(resolve, 1500)); // 模擬處理時間
      
      const actions = analyzeAndGenerateActions(thoughtContent, aiMessages);
      return actions;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateActionPlan,
    isGenerating
  };
}

function analyzeAndGenerateActions(thoughtContent: string, aiMessages: any[] = []): ActionItem[] {
  const content = thoughtContent.toLowerCase();
  const actions: ActionItem[] = [];
  
  // 分析AI對話內容以獲得更準確的建議
  const conversationContext = aiMessages.map(msg => msg.content).join(' ').toLowerCase();
  const fullContext = (content + ' ' + conversationContext).toLowerCase();
  
  // 根據對話深度生成更具體的行動項目
  const hasDeepAnalysis = conversationContext.length > 100;
  const actionKeywords = extractActionKeywords(fullContext);
  
  // 學習相關
  if (fullContext.includes('學習') || fullContext.includes('了解') || fullContext.includes('研究') || actionKeywords.includes('學習')) {
    actions.push({
      id: Date.now().toString() + '-1',
      content: '搜尋並整理相關學習資源',
      priority: 'high',
      timeEstimate: '30分鐘',
      category: '學習'
    });
    actions.push({
      id: Date.now().toString() + '-2',
      content: '制定學習計劃和時程',
      priority: 'medium',
      timeEstimate: '15分鐘',
      category: '規劃'
    });
    actions.push({
      id: Date.now().toString() + '-3',
      content: '每日安排固定學習時間',
      priority: 'medium',
      timeEstimate: '持續進行',
      category: '習慣'
    });
  }

  // 專案相關
  if (content.includes('專案') || content.includes('計劃') || content.includes('開發')) {
    actions.push({
      id: Date.now().toString() + '-4',
      content: '拆解專案成小任務',
      priority: 'high',
      timeEstimate: '45分鐘',
      category: '規劃'
    });
    actions.push({
      id: Date.now().toString() + '-5',
      content: '設定專案里程碑',
      priority: 'high',
      timeEstimate: '20分鐘',
      category: '規劃'
    });
    actions.push({
      id: Date.now().toString() + '-6',
      content: '和團隊成員討論分工',
      priority: 'medium',
      timeEstimate: '60分鐘',
      category: '協作'
    });
  }

  // 工作相關
  if (content.includes('工作') || content.includes('職業') || content.includes('事業')) {
    actions.push({
      id: Date.now().toString() + '-7',
      content: '檢視當前工作優先順序',
      priority: 'high',
      timeEstimate: '15分鐘',
      category: '工作'
    });
    actions.push({
      id: Date.now().toString() + '-8',
      content: '與主管討論目標與期望',
      priority: 'medium',
      timeEstimate: '30分鐘',
      category: '溝通'
    });
  }

  // 健康相關
  if (content.includes('健康') || content.includes('運動') || content.includes('身體')) {
    actions.push({
      id: Date.now().toString() + '-9',
      content: '安排定期運動時間',
      priority: 'medium',
      timeEstimate: '每週3次',
      category: '健康'
    });
    actions.push({
      id: Date.now().toString() + '-10',
      content: '規劃健康飲食計劃',
      priority: 'medium',
      timeEstimate: '30分鐘',
      category: '健康'
    });
  }

  // 關係相關
  if (content.includes('朋友') || content.includes('家人') || content.includes('關係')) {
    actions.push({
      id: Date.now().toString() + '-11',
      content: '主動聯繫重要的人',
      priority: 'medium',
      timeEstimate: '20分鐘',
      category: '人際'
    });
    actions.push({
      id: Date.now().toString() + '-12',
      content: '安排與親友聚會時間',
      priority: 'low',
      timeEstimate: '規劃中',
      category: '人際'
    });
  }

  // 創意相關
  if (content.includes('創意') || content.includes('想法') || content.includes('靈感')) {
    actions.push({
      id: Date.now().toString() + '-13',
      content: '建立想法收集系統',
      priority: 'medium',
      timeEstimate: '15分鐘',
      category: '創意'
    });
    actions.push({
      id: Date.now().toString() + '-14',
      content: '定期回顧並發展好想法',
      priority: 'low',
      timeEstimate: '每週1次',
      category: '創意'
    });
  }

  // 通用行動項目
  if (actions.length < 3) {
    actions.push(
      {
        id: Date.now().toString() + '-15',
        content: '將大目標拆解成具體行動',
        priority: 'high',
        timeEstimate: '20分鐘',
        category: '規劃'
      },
      {
        id: Date.now().toString() + '-16',
        content: '設定每日小目標並執行',
        priority: 'high',
        timeEstimate: '持續進行',
        category: '執行'
      },
      {
        id: Date.now().toString() + '-17',
        content: '每週檢視進度並調整方向',
        priority: 'medium',
        timeEstimate: '30分鐘',
        category: '檢討'
      }
    );
  }

  // 根據對話內容生成更個性化的建議
  if (hasDeepAnalysis && actions.length < 5) {
    const contextualActions = generateContextualActions(fullContext, conversationContext);
    actions.push(...contextualActions);
  }

  // 限制返回項目數量並按優先級排序
  return actions
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 5);
}

function extractActionKeywords(text: string): string[] {
  const keywords = [];
  if (text.includes('學習') || text.includes('研讀')) keywords.push('學習');
  if (text.includes('計劃') || text.includes('規劃')) keywords.push('規劃');
  if (text.includes('運動') || text.includes('健身')) keywords.push('健康');
  if (text.includes('工作') || text.includes('職場')) keywords.push('工作');
  if (text.includes('關係') || text.includes('溝通')) keywords.push('人際');
  return keywords;
}

function generateContextualActions(fullContext: string, conversationContext: string): ActionItem[] {
  const actions: ActionItem[] = [];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // 根據對話深度生成具體行動
  if (conversationContext.includes('目標') || conversationContext.includes('想要')) {
    actions.push({
      id: Date.now().toString() + '-contextual-1',
      content: '將剛才的討論重點整理成具體目標',
      priority: 'high',
      timeEstimate: '20分鐘',
      category: '規劃',
      startDate: now.toISOString().split('T')[0],
      startTime: '09:00'
    });
  }
  
  if (conversationContext.includes('困難') || conversationContext.includes('挑戰')) {
    actions.push({
      id: Date.now().toString() + '-contextual-2',
      content: '制定應對困難的具體策略',
      priority: 'high',
      timeEstimate: '30分鐘',
      category: '解決問題',
      startDate: tomorrow.toISOString().split('T')[0],
      startTime: '10:00'
    });
  }
  
  if (conversationContext.includes('感受') || conversationContext.includes('情緒')) {
    actions.push({
      id: Date.now().toString() + '-contextual-3',
      content: '安排時間進行情緒梳理和自我照顧',
      priority: 'medium',
      timeEstimate: '15分鐘',
      category: '自我關愛',
      startDate: now.toISOString().split('T')[0],
      startTime: '20:00'
    });
  }
  
  return actions;
}