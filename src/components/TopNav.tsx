import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Today" },
  { to: "/calendar", label: "日曆" },
  { to: "/todo", label: "To-do" },
  { to: "/tags", label: "Tags" },
  { to: "/search", label: "搜尋" }
];

export default function TopNav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-border mb-6 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold tracking-tight text-primary select-none">🧠 脈德小腦瓜</div>
        
        {/* 桌面版導航 */}
        <div className="hidden md:flex gap-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium px-2 py-1 rounded-md transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 漢堡選單按鈕 */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 行動版選單 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium px-2 py-2 rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
