
import TopNav from "@/components/TopNav";
import { Link } from "react-router-dom";
import { useTags } from "@/hooks/useTags";
import { useThoughts } from "@/hooks/useThoughts";

export default function TagsPage() {
  const { tags } = useTags();
  const { thoughts } = useThoughts();

  const getThoughtsByTag = (tagName: string) => {
    return thoughts.filter(thought => thought.tags.includes(tagName));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-2xl font-bold mb-6 text-primary">🏷️ 標籤管理</div>
        
        {tags.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">尚無任何標籤</p>
            <Link to="/" className="text-primary underline">去新增思緒卡片</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tags.map(tag => (
              <div key={tag.name} className="bg-card p-6 rounded-xl border border-border shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-accent px-3 py-1 rounded-full text-lg">{tag.name}</span>
                    <span className="text-sm text-muted-foreground">({tag.count} 個思緒)</span>
                  </h3>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  {getThoughtsByTag(tag.name).map(thought => (
                    <div key={thought.id} className="bg-accent/20 p-3 rounded-lg border border-accent/30">
                      <div className="text-sm text-foreground mb-2 line-clamp-2">{thought.content}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {thought.tags.filter(t => t !== tag.name).map(otherTag => (
                            <span key={otherTag} className="text-xs bg-accent px-1.5 py-0.5 rounded">
                              {otherTag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/thought/${thought.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          查看詳情
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
