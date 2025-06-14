
import { useParams, useNavigate, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { useState } from "react";
import AiDeepDiveCard from "@/components/AiDeepDiveCard";
import { useThoughts } from "@/hooks/useThoughts";
import { useTodos } from "@/hooks/useTodos";
import { Edit, Trash2 } from "lucide-react";

export default function ThoughtDetail() {
  const { id } = useParams<{ id: string }>();
  const { getThoughtById, updateThought, updateAiConversation, deleteThought } = useThoughts();
  const { addTodo } = useTodos();
  const thought = getThoughtById(id || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(thought?.content || "");
  const [editTags, setEditTags] = useState(thought?.tags.join(", ") || "");
  const navigate = useNavigate();

  if (!thought) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="max-w-2xl mx-auto px-6 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">找不到此思緒卡片</h1>
            <Link to="/" className="text-primary underline">返回首頁</Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSaveEdit = () => {
    const processedTags = editTags
      .split(/[,\s]+/)
      .filter(tag => tag.trim() !== "")
      .map(tag => tag.trim());
    
    updateThought(thought.id, {
      content: editContent.trim(),
      tags: processedTags
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(thought.content);
    setEditTags(thought.tags.join(", "));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("確定要刪除這個思緒卡片嗎？")) {
      deleteThought(thought.id);
      navigate("/");
    }
  };

  function handleToDo() {
    // 將思緒轉為待辦事項
    addTodo({
      content: thought.content,
      thoughtId: thought.id,
      done: false
    });
    navigate("/todo");
  }

  function handleActionPlanGenerated(plan: string) {
    console.log("生成的行動方案:", plan);
    // 將行動方案轉為待辦事項
    addTodo({
      content: plan,
      thoughtId: thought.id,
      done: false
    });
    navigate("/todo", { state: { newActionPlan: plan } });
  }

  // 處理 AI 對話更新
  const handleConversationUpdate = (messages: Array<{role: "user" | "assistant" | "system"; content: string}>) => {
    console.log("ThoughtDetail: Updating AI conversation for thought", thought.id);
    updateAiConversation(thought.id, messages);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-muted-foreground text-sm underline hover:text-primary"
          >
            &larr; 返回 Today
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-primary transition"
              title="編輯思緒"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-500 transition"
              title="刪除思緒"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        {/* 整合的思緒內容與AI探索卡片 */}
        <div className="bg-card rounded-xl shadow p-6 border border-border mb-8">
          <div className="text-xl font-bold mb-4">💭 思緒內容與智慧探索</div>
          
          {/* 思緒內容區塊 */}
          <div className="mb-6 p-4 bg-accent/30 rounded-lg border border-accent">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border rounded resize-none"
                  rows={4}
                />
                <input
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Tags (用逗號分隔)"
                  className="w-full p-2 border rounded text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg text-foreground mb-3">{thought.content}</div>
                <div className="flex gap-2 mb-3">
                  {thought.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-accent px-2 py-0.5 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {thought.aiConversation && (
                  <div className="text-xs text-muted-foreground">
                    💬 包含 {thought.aiConversation.messages.filter(m => m.role !== 'system').length} 則對話記錄
                    <span className="ml-2">
                      📅 {new Date(thought.aiConversation.lastUpdated).toLocaleString('zh-TW')}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* AI探索區域 */}
          {!isEditing && (
            <div className="mb-6">
              <AiDeepDiveCard 
                thoughtContent={thought.content}
                thoughtId={thought.id}
                initialConversation={thought.aiConversation?.messages}
                onActionPlanGenerated={handleActionPlanGenerated}
                onConversationUpdate={handleConversationUpdate}
              />
            </div>
          )}

          {/* 轉為 To-do 按鈕 */}
          {!isEditing && (
            <button
              onClick={handleToDo}
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 transition"
            >
              轉為 To-do
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
