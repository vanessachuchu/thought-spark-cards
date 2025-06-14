
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
    canvas.height = 600;
    
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成心智圖節點
    const nodes: MindMapNode[] = [];
    
    // 根節點（原始思緒）
    nodes.push({
      id: 'root',
      text: thoughtContent,
      x: canvas.width / 2,
      y: canvas.height / 2,
      level: 0
    });
    
    // 處理對話訊息，生成分支節點
    const userMessages = messages.filter(msg => msg.role === 'user' && msg.content !== thoughtContent);
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    userMessages.forEach((msg, index) => {
      const angle = (index * 2 * Math.PI) / Math.max(userMessages.length, 1);
      const radius = 150;
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius;
      
      nodes.push({
        id: `user-${index}`,
        text: msg.content.length > 30 ? msg.content.substring(0, 30) + '...' : msg.content,
        x,
        y,
        level: 1,
        parentId: 'root'
      });
      
      // 對應的AI回應
      if (assistantMessages[index]) {
        const aiAngle = angle + 0.3;
        const aiRadius = 220;
        const aiX = canvas.width / 2 + Math.cos(aiAngle) * aiRadius;
        const aiY = canvas.height / 2 + Math.sin(aiAngle) * aiRadius;
        
        nodes.push({
          id: `ai-${index}`,
          text: assistantMessages[index].content.length > 25 ? assistantMessages[index].content.substring(0, 25) + '...' : assistantMessages[index].content,
          x: aiX,
          y: aiY,
          level: 2,
          parentId: `user-${index}`
        });
      }
    });
    
    // 繪製連線
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    
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
      // 節點背景
      ctx.fillStyle = node.level === 0 ? '#3b82f6' : node.level === 1 ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // 節點文字背景
      ctx.font = '12px sans-serif';
      const textWidth = ctx.measureText(node.text).width;
      const textHeight = 16;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(node.x - textWidth / 2 - 4, node.y - textHeight / 2 - 12, textWidth + 8, textHeight + 4);
      
      // 節點文字
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.text, node.x, node.y - 8);
    });
    
  }, [messages, thoughtContent]);
  
  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="text-sm font-semibold mb-2 text-foreground">🧠 思考脈絡圖</div>
      <canvas 
        ref={canvasRef}
        className="w-full h-auto border border-border rounded"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="text-xs text-muted-foreground mt-2">
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>原始思緒
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1 ml-4"></span>你的想法
        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-4"></span>AI回應
      </div>
    </div>
  );
}
