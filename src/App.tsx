
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThoughtDetail from "./pages/ThoughtDetail";
import TodoPage from "./pages/Todo";
import TagsPage from "./pages/Tags";
import SearchPage from "./pages/Search";

import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

export type PageType = 'home' | 'chat' | 'todo' | 'calendar' | 'mindmap' | 'tags' | 'search';

const App = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background pb-16">
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/thought/:id" element={<ThoughtDetail />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
