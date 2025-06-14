
import { Link } from "react-router-dom";

export interface DraggableThoughtCardProps {
  id: string;
  content: string;
  tags: string[];
  initialPosition?: { x: number; y: number };
}

export default function DraggableThoughtCard({ 
  id, 
  content, 
  tags
}: DraggableThoughtCardProps) {
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
      <div className="mt-auto flex justify-end">
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
