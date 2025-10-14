import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { FeaturedPage } from "./pages/FeaturedPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTool, setSelectedTool] = useState<any>(null);

  const handleViewTool = (tool: any) => {
    setSelectedTool(tool);
    setCurrentPage('tool-detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedTool(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewTool={handleViewTool} />;
      case 'categories':
        return <CategoriesPage onViewTool={handleViewTool} />;
      case 'featured':
        return <FeaturedPage onViewTool={handleViewTool} />;
      case 'tool-detail':
        return <ToolDetailPage onBack={handleBackToHome} tool={selectedTool} />;
      case 'profile':
        return <ProfilePage onBack={handleBackToHome} />;
      default:
        return <HomePage onViewTool={handleViewTool} />;
    }
  };

return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
);
}