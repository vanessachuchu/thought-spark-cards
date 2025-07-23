import { Link, useLocation } from "react-router-dom";
import { Home, CheckSquare, Calendar, Brain, MessageCircle, Plus } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";

const navItems = [
  { 
    to: "/", 
    label: "首頁", 
    icon: Home,
    key: "home" as const
  },
  { 
    to: "/todo", 
    label: "行動", 
    icon: CheckSquare,
    key: "todo" as const,
    showBadge: true
  },
  { 
    to: "/calendar", 
    label: "日曆", 
    icon: Calendar,
    key: "calendar" as const
  },
  { 
    to: "/tags", 
    label: "標籤", 
    icon: Brain,
    key: "tags" as const
  }
];

export default function BottomNav() {
  const location = useLocation();
  const { todos } = useTodos();
  
  // 計算未完成的待辦事項數量
  const pendingTodosCount = todos.filter(todo => !todo.done).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map(({ to, label, icon: Icon, key, showBadge }) => {
            const isActive = location.pathname === to;
            const badgeCount = showBadge && key === 'todo' ? pendingTodosCount : 0;
            
            return (
              <Link
                key={key}
                to={to}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-1" />
                  {badgeCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}