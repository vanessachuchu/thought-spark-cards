import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotionSettings from "@/components/NotionSettings";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
          <h1 className="text-2xl font-semibold">設定</h1>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🧘‍♀️ 脈德小腦瓜 設定</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                在這裡管理你的應用設定和整合功能
              </p>
            </CardContent>
          </Card>

          {/* Notion Integration */}
          <NotionSettings />
        </div>
      </div>
    </div>
  );
}