import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToolCard } from "./ToolCard";
import { useFavorites } from "../hooks/useFavorites";

interface Label {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  planType: string;
  viewCount: number;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    id: number;
    name: string;
  };
  labels: Array<{
    label: Label;
  }>;
  reviews?: Array<{
    rating: number;
  }>;
  isTrending: boolean;
  isNew: boolean;
}

export function PopularToolsSection() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use favorites hook
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tools");
      const data = await res.json();
      
      // Sort by viewCount and get top 3
      const topTools = data
        .sort((a: Tool, b: Tool) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 3);
      
      // Add computed fields for ToolCard
      const enrichedTools = topTools.map((tool: Tool) => ({
        ...tool,
        averageRating: tool.reviews && tool.reviews.length > 0
          ? parseFloat((tool.reviews.reduce((sum, r) => sum + r.rating, 0) / tool.reviews.length).toFixed(1))
          : 0,
        reviewCount: tool.reviews?.length ?? 0,
        isTrending: tool.isTrending ?? false,
        isNew: tool.isNew ?? false,
      }));

      setTools(enrichedTools);
    } catch (err) {
      console.error("Error fetching popular tools:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6" id="popular-tools-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Herramientas Populares
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Las herramientas IA más vistas y confiadas por nuestra comunidad. 
            Descubre qué está usando la mayoría de usuarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={{
                ...tool,
                isFavorited: isFavorited(tool.id)
              }}
              onFavoriteChange={(toolId, isFav) => {
                if (isFav) {
                  addFavorite(toolId);
                } else {
                  removeFavorite(toolId);
                }
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/search?sortBy=views')}
          >
            Ver Todas las Herramientas Populares
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
