import { Search, Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/global.css';

interface NavItem {
  id: string;
  label: string;
}

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/navigation')
      .then(response => response.json())
      .then(data => setNavItems(data))
      .catch(error => console.error('Error fetching navigation:', error));
  }, []);

  const handleNavClick = (id: string) => {
    const path = id === 'home' ? '/' : `/${id}`;
    navigate(path);
    setIsMenuOpen(false);
  };

  const getCurrentPage = () => {
    if (location.pathname === '/') return 'home';
    return location.pathname.slice(1);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold">WikipedIA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors ${
                  getCurrentPage() === item.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Busca herramientas..." 
                className="pl-10 w-80 bg-card border-border"
              />
            </div>
            <button
              onClick={() => handleNavClick('profile')}
              className="transition-opacity hover:opacity-80"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center cursor-pointer rounded-full">
                <User className="w-5 h-5" />
              </div>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Admin
            </button>
            <button
              onClick={() => handleNavClick('admin-text')}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Admin Text
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Busca herramientas..." 
                  className="pl-10 w-full bg-card border-border"
                />
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 transition-colors ${
                    getCurrentPage() === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </nav>
  );
}