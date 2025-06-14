
import { useEffect, useRef } from 'react';
import { AiMessage } from '@/hooks/useAiDeepDive';

interface MindMapVisualizationProps {
  messages: AiMessage[];
  thoughtContent: string;
}

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: number;
  parentId?: string;
  type: 'root' | 'topic' | 'insight';
}

// 摘要長文本為關鍵詞
function extractKeywords(text: string): string {
  // 移除標點符號和多餘空格
  const cleaned = text.replace(/[？！。，；：「」『』（）]/g, '').trim();
  
  // 如果文本很短，直接返回
  if (cleaned.length <= 15) return cleaned;
  
  // 嘗試提取關鍵詞或短語
  const words = cleaned.split(/\s+/);
  if (words.length <= 3) return cleaned;
  
  // 取前幾個重要詞彙
  return words.slice(0, 3).join(' ') + '...';
}

export function MindMapVisualization({ messages, thoughtContent }: MindMapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 設置canvas尺寸
    canvas.width = 800;
    canvas.height = 400; // Initial height
    
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成樹狀圖節點
    const nodes: MindMapNode[] = [];
    const canvasWidth = canvas.width;
    const yStep = 90; // Vertical distance between levels
    
    // 根節點
    nodes.push({
      id: 'root',
      text: `核心: ${extractKeywords(thoughtContent)}`,
      x: canvasWidth / 2,
      y: 50,
      level: 0,
      type: 'root'
    });
    
    // 處理對話訊息
    const userMessages = messages.filter(msg => msg.role === 'user' && msg.content !== thoughtContent);
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    const conversationRounds = Math.min(userMessages.length, assistantMessages.length);
    
    if (conversationRounds > 0) {
      const topicWidth = canvasWidth / conversationRounds;

      for (let i = 0; i < conversationRounds; i++) {
        const userMsg = userMessages[i];
        const aiMsg = assistantMessages[i];
        
        if (!userMsg || !aiMsg) continue;
        
        const topicX = (i + 0.5) * topicWidth;
        const topicY = 50 + yStep;
        
        // 用戶思考節點（話題）
        nodes.push({
          id: `topic-${i}`,
          text: extractKeywords(userMsg.content),
          x: topicX,
          y: topicY,
          level: 1,
          parentId: 'root',
          type: 'topic'
        });
        
        // AI洞察節點
        const insightX = topicX;
        const insightY = topicY + yStep * 0.8;
        
        nodes.push({
          id: `insight-${i}`,
          text: extractKeywords(aiMsg.content),
          x: insightX,
          y: insightY,
          level: 2,
          parentId: `topic-${i}`,
          type: 'insight'
        });
      }
    }

    // 調整canvas高度以適應內容
    const requiredHeight = conversationRounds > 0 ? 50 + yStep + yStep * 0.8 + 50 : 150;
    if (canvas.height < requiredHeight) {
      canvas.height = requiredHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // 繪製連線 - 使用直線
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    
    nodes.forEach(node => {
      if (node.parentId) {
        const parent = nodes.find(n => n.id === node.parentId);
        if (parent) {
          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }
    });
    
    // 繪製節點
    nodes.forEach(node => {
      // 根據節點類型設置顏色
      let nodeColor = '#64748b';
      let nodeSize = 6;
      
      switch (node.type) {
        case 'root':
          nodeColor = '#3b82f6';
          nodeSize = 10;
          break;
        case 'topic':
          nodeColor = '#10b981';
          nodeSize = 8;
          break;
        case 'insight':
          nodeColor = '#f59e0b';
          nodeSize = 7;
          break;
      }
      
      // 節點背景
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // 節點文字背景
      ctx.font = node.type === 'root' ? '14px sans-serif' : '12px sans-serif';
      const textWidth = ctx.measureText(node.text).width;
      const textHeight = node.type === 'root' ? 18 : 16;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(node.x - textWidth / 2 - 6, node.y - textHeight / 2 - 15, textWidth + 12, textHeight + 6);
      
      // 節點文字邊框
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(node.x - textWidth / 2 - 6, node.y - textHeight / 2 - 15, textWidth + 12, textHeight + 6);
      
      // 節點文字
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.text, node.x, node.y - 12);
    });
    
  }, [messages, thoughtContent]);
  
  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="text-sm font-semibold mb-2 text-foreground">🧠 思考流程樹狀圖</div>
      <canvas 
        ref={canvasRef}
        className="w-full h-auto border border-border rounded"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="text-xs text-muted-foreground mt-2">
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>核心思緒
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1 ml-4"></span>探討話題
        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-4"></span>AI洞察
      </div>
    </div>
  );
}
