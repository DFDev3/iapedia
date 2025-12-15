import { Button } from "./ui/button";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";

interface SearchSuggestion {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: { name: string };
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search query for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/tools/search/query?q=${encodeURIComponent(searchQuery)}&limit=3`
      );
      const data = await res.json();
      setSuggestions(data.tools || []);
      setShowSuggestions(data.tools && data.tools.length > 0);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (toolId: number) => {
    setShowSuggestions(false);
    navigate(`/tools/${toolId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Flowing curves */}
          <path d="M0,400 Q300,200 600,400 T1200,400" stroke="url(#grad1)" strokeWidth="2" fill="none">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,400 Q300,200 600,400 T1200,400;M0,300 Q300,500 600,300 T1200,300;M0,400 Q300,200 600,400 T1200,400" />
          </path>
          
          <path d="M0,600 Q400,300 800,600 T1200,600" stroke="url(#grad2)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" dur="15s" repeatCount="indefinite"
              values="M0,600 Q400,300 800,600 T1200,600;M0,500 Q400,700 800,500 T1200,500;M0,600 Q400,300 800,600 T1200,600" />
          </path>
          
          {/* Floating dots */}
          <circle cx="200" cy="300" r="3" fill="#00d4ff" opacity="0.6">
            <animate attributeName="cy" dur="8s" repeatCount="indefinite" values="300;200;300" />
          </circle>
          <circle cx="800" cy="500" r="2" fill="#00ff88" opacity="0.4">
            <animate attributeName="cy" dur="12s" repeatCount="indefinite" values="500;350;500" />
          </circle>
          <circle cx="1000" cy="200" r="4" fill="#8a2be2" opacity="0.3">
            <animate attributeName="cy" dur="6s" repeatCount="indefinite" values="200;350;200" />
          </circle>
          
          {/* Network connections */}
          <line x1="200" y1="300" x2="800" y2="500" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3">
            <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.3;0.7;0.3" />
          </line>
          <line x1="800" y1="500" x2="1000" y2="200" stroke="#00ff88" strokeWidth="0.5" opacity="0.2">
            <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0.2;0.6;0.2" />
          </line>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          WikipedIA
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Descubre, explora, y accede a las mejores herramientas IA de la última generación. 
          Es tu oportunidad de hacer parte del futuro de la inteligencia artificial.
        </p>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative" ref={suggestionsRef}>
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 pointer-events-none" />
            <Input
              placeholder="Busca herramientas IA, modelos o categorías..."
              className="pl-16 pr-32 py-6 text-lg bg-neutral-800 text-white placeholder:text-gray-300 border-gray-600 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchQuery.trim() && showSuggestions && setShowSuggestions(true)}
            />
            <Button 
              size="lg" 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Buscar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border-gray-800 z-50 overflow-hidden shadow-2xl">
                <div className="p-2">
                  {suggestions.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSuggestionClick(tool.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-neutral-800 transition-colors flex gap-3 items-center group"
                    >
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=AI';
                        }}
                        className="w-10 h-10 rounded object-cover flex-shrink-0 bg-neutral-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {tool.category.name}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
                    </button>
                  ))}
                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <button
                      onClick={handleSearch}
                      className="w-full text-center p-2 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Ver todos los resultados →
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/categories')}
          >
            Categorías
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-accent text-accent hover:bg-accent/10"
            onClick={() => {
              // Scroll to popular tools section
              setTimeout(() => {
                const element = document.getElementById('popular-tools-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            Herramientas Populares
          </Button>
        </div>
      </div>
    </section>
  );
}