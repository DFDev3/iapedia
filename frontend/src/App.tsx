// App.tsx
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { FeaturedPage } from "./pages/FeaturedPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CategoryDetailPage } from "./pages/CategoryDetailPage";
import AuthPage from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div id="root-container" className="dark min-h-screen bg-background text-foreground">
          <Navigation />
          <main className="pt-16 min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:id" element={<CategoryDetailPage />} />
              <Route path="/featured" element={<FeaturedPage />} />
              <Route path="/tools/:id" element={<ToolDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
