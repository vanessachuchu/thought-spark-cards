
import TopNav from "@/components/TopNav";

export default function TagsPage() {
  // DEMO tags
  const tags = [
    { tag: "#創意", count: 1 },
    { tag: "#行動", count: 1 },
    { tag: "✨", count: 1 },
    { tag: "🔥", count: 1 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">🏷️ 標籤 Tags</div>
        <div className="flex flex-wrap gap-4">
          {tags.map(t => (
            <div key={t.tag} className="bg-accent rounded-lg px-4 py-2 flex items-center gap-2 text-base font-medium">
              <span>{t.tag}</span>
              <span className="text-xs text-muted-foreground">({t.count})</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
