import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Hash } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useThoughts, type Thought } from '@/hooks/useThoughts';
import VoiceInputButton from '@/components/VoiceInputButton';
import { useToast } from '@/hooks/use-toast';

interface NewThoughtDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewThoughtDialog({ isOpen, onClose }: NewThoughtDialogProps) {
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { addThought } = useThoughts();
  const { toast } = useToast();
  
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported: voiceSupported,
    error: voiceError
  } = useVoiceRecognition();

  // 同步語音轉錄到內容
  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // 顯示語音錯誤
  useEffect(() => {
    if (voiceError) {
      toast({
        title: "語音輸入錯誤",
        description: voiceError,
        variant: "destructive",
      });
    }
  }, [voiceError, toast]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "請輸入思緒內容",
        description: "思緒內容不能為空",
        variant: "destructive",
      });
      return;
    }

    const newThought: Thought = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
      tags: tags,
    };

    addThought(newThought);
    
    toast({
      title: "思緒已記錄",
      description: "您的新思緒已成功保存",
    });

    // 重置表單
    setContent('');
    setTags([]);
    setTagInput('');
    onClose();
  };

  const handleClose = () => {
    // 重置表單
    setContent('');
    setTags([]);
    setTagInput('');
    resetTranscript();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-gradient-text">
            ✨ 記錄新思緒
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 思緒內容輸入區 */}
          <div className="space-y-3">
            <Label htmlFor="content" className="text-sm font-medium">
              思緒內容
            </Label>
            <div className="relative">
              <Textarea
                id="content"
                placeholder="寫下您的想法、靈感或感受..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] pr-14 resize-none"
              />
              {voiceSupported && (
                <div className="absolute top-3 right-3">
                  <VoiceInputButton
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    size="sm"
                  />
                </div>
              )}
            </div>
            {isRecording && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                正在錄音中... 再次點擊停止
              </div>
            )}
          </div>

          {/* 標籤輸入區 */}
          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-medium">
              標籤
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="tags"
                  placeholder="新增標籤"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddTag}
                variant="outline"
                disabled={!tagInput.trim()}
              >
                新增
              </Button>
            </div>
            
            {/* 已新增的標籤 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="bg-gradient-accent hover:shadow-soft"
            >
              記錄思緒
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}