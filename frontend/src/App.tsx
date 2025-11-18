// App.tsx
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { FeaturedPage } from "./pages/FeaturedPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
// import { CategoryDetailPage } from "./pages/CategoryDetailPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminDashboard } from "./pages/AdminText";

export default function App() {
  return (
    <Router>
      <div id="root-container" className="dark min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/featured" element={<FeaturedPage />} />
            <Route path="/tool-detail" element={<ToolDetailPage />} />
            {/* <Route path="/category-detail" element={<CategoryDetailPage />} /> */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin-text" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
