import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="w-full bg-white border-b border-border mb-6 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold tracking-tight text-primary select-none">🧠 脈德小腦瓜</div>
        
        {/* 搜尋按鈕 */}
        <Link
          to="/search"
          className="p-2 rounded-md hover:bg-accent transition-colors"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </nav>
  );
}
