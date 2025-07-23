import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';
import { ActionItem } from '@/hooks/useAiActionGenerator';

interface ActionItemSchedulerProps {
  action: ActionItem;
  onSchedule: (actionId: string, schedule: {
    startDate: string;
    endDate?: string;
    startTime: string;
    endTime?: string;
  }) => void;
  onCancel: () => void;
}

export function ActionItemScheduler({ action, onSchedule, onCancel }: ActionItemSchedulerProps) {
  const [startDate, setStartDate] = useState(action.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(action.endDate || '');
  const [startTime, setStartTime] = useState(action.startTime || '09:00');
  const [endTime, setEndTime] = useState(action.endTime || '');

  const handleSchedule = () => {
    onSchedule(action.id, {
      startDate,
      endDate: endDate || undefined,
      startTime,
      endTime: endTime || undefined
    });
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="font-medium">安排時程</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3">
        {action.content}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-xs">開始日期</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="endDate" className="text-xs">結束日期 (可選)</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="startTime" className="text-xs">開始時間</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="endTime" className="text-xs">結束時間 (可選)</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSchedule} className="flex-1" size="sm">
          <Clock className="w-3 h-3 mr-1" />
          確認安排
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1" size="sm">
          取消
        </Button>
      </div>
    </div>
  );
}