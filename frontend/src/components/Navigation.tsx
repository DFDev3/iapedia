import { Search, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import '../styles/global.css';

interface NavItem {
  id: string;
  label: string;
}

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
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
    return location.pathname.slice(1).split('/')[0];
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
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
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`transition-colors ${
                  getCurrentPage() === 'admin'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Administrador
              </button>
            )}
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
              onClick={handleProfileClick}
              className="transition-opacity hover:opacity-80"
              title={isAuthenticated ? user?.name : 'Iniciar sesión'}
            >
              {isAuthenticated && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center cursor-pointer rounded-full">
                  <User className="w-5 h-5" />
                </div>
              )}
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
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-3 py-2 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                {isAuthenticated && user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                {isAuthenticated ? 'Perfil' : 'Iniciar sesión'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => { handleNavClick('admin'); setIsMenuOpen(false); }}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm mt-2"
                  >
                    Panel de Administrador
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
    </nav>
  );
}