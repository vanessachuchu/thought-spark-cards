import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Today" },
  { to: "/calendar", label: "日曆" },
  { to: "/todo", label: "To-do" },
  { to: "/tags", label: "Tags" },
  { to: "/search", label: "搜尋" }
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 bg-white border-b border-border mb-6 shadow-sm sticky top-0 z-20">
      <div className="text-xl font-bold tracking-tight text-primary select-none">🧠 脈德小腦瓜</div>
      <div className="flex gap-4">
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
    </nav>
  );
}
