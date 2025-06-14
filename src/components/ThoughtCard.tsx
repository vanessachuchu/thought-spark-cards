import { Link } from "react-router-dom";
import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { useThoughts } from "@/hooks/useThoughts";

export interface ThoughtCardProps {
  id: string;
  content: string;
  tags: string[];
}

export default function ThoughtCard({ id, content, tags }: ThoughtCardProps) {
  const { updateThought, deleteThought } = useThoughts();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editTags, setEditTags] = useState(tags.join(", "));

  const handleSave = () => {
    console.log("ThoughtCard handleSave called for id:", id);
    const processedTags = editTags
      .split(/[,\s]+/)
      .filter(tag => tag.trim() !== "")
      .map(tag => tag.trim());
    
    updateThought(id, {
      content: editContent.trim(),
      tags: processedTags
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setEditTags(tags.join(", "));
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("ThoughtCard handleDelete called for id:", id);
    if (window.confirm("確定要刪除這個思緒卡片嗎？")) {
      console.log("User confirmed deletion for id:", id);
      deleteThought(id);
      console.log("deleteThought called for id:", id);
    } else {
      console.log("User cancelled deletion for id:", id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-card p-5 rounded-xl shadow border border-border">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full mb-3 p-2 border rounded resize-none"
          rows={3}
        />
        <input
          value={editTags}
          onChange={(e) => setEditTags(e.target.value)}
          placeholder="Tags (用逗號分隔)"
          className="w-full mb-3 p-2 border rounded text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-5 rounded-xl shadow group hover:shadow-lg transition-shadow flex flex-col gap-2 border border-border">
      <div className="text-base leading-relaxed text-foreground mb-2 min-h-[64px]">{content}</div>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded bg-accent text-[15px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-primary transition opacity-0 group-hover:opacity-100"
            title="編輯"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            title="刪除"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <Link
          to={`/thought/${id}`}
          className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition"
        >
          深入挖掘
        </Link>
      </div>
    </div>
  );
}
