
import { useState, useRef } from "react";
import { useDrag } from 'react-dnd';
import { Link } from "react-router-dom";

export interface DraggableThoughtCardProps {
  id: string;
  content: string;
  tags: string[];
  initialPosition: { x: number; y: number };
}

export default function DraggableThoughtCard({ 
  id, 
  content, 
  tags, 
  initialPosition 
}: DraggableThoughtCardProps) {
  const [position, setPosition] = useState(initialPosition);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'thought-card',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        const clientOffset = monitor.getClientOffset();
        if (clientOffset) {
          const container = ref.current?.parentElement;
          if (container) {
            const containerRect = container.getBoundingClientRect();
            setPosition({
              x: clientOffset.x - containerRect.left - 150, // 卡片寬度的一半
              y: clientOffset.y - containerRect.top - 100,  // 卡片高度的一半
            });
          }
        }
      }
    },
  });

  drag(ref);

  return (
    <div
      ref={ref}
      className={`absolute w-80 bg-card p-5 rounded-xl shadow-lg border border-border cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 rotate-2' : 'hover:shadow-xl hover:scale-105'
      }`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <div className="text-base leading-relaxed text-foreground mb-3 min-h-[64px]">
        {content}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded bg-accent text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          to={`/thought/${id}`}
          className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition"
          onClick={(e) => e.stopPropagation()}
        >
          深入挖掘
        </Link>
      </div>
    </div>
  );
}
