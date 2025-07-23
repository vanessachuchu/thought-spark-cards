import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase.functions.invoke('generate-action-plan', {
        body: {
          thoughtContent,
          aiMessages: aiMessages || []
        }
      });

      if (error) {
        console.error('生成行動計劃錯誤:', error);
        throw new Error(error.message || '生成行動計劃失敗');
      }

      return data?.actions || [];
    } catch (error) {
      console.error('調用行動計劃API失敗:', error);
      // 返回空數組而不是拋出錯誤，以保持應用穩定性
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateActionPlan,
    isGenerating
  };
}
