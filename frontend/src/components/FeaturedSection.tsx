import { Card, CardContent } from "./ui/card"; 
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";

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
  category: {
    id: number;
    name: string;
  };
  labels: Array<{
    label: Label;
  }>;
  reviews: Array<{
    rating: number;
  }>;
}

interface FeaturedSectionProps {
  onViewTool?: (tool: any) => void;
}

export function FeaturedSection({ onViewTool }: FeaturedSectionProps) {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/tools");
      if (!response.ok) throw new Error("Failed to fetch tools");
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews: any[] | undefined) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const formatUserCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getGradientForIndex = (index: number) => {
    const gradients = [
      "from-blue-500/20 to-cyan-500/20",
      "from-green-500/20 to-emerald-500/20",
      "from-yellow-500/20 to-orange-500/20",
    ];
    return gradients[index % gradients.length];
  };

  // Get featured tools (with "featured" label)
  const featuredTools = tools
    .filter((t) => t.labels.some((l) => l.label.slug === "featured"))
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground">Cargando herramientas destacadas...</p>
        </div>
      </section>
    );
  }

  if (featuredTools.length === 0) {
    return null; // Don't show section if no featured tools
  }

  return (
    <section className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Herramientas IA Destacadas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas seleccionadas a mano que representan la vanguardia de la tecnología de IA. 
            Confiadas por millones de usuarios en todo el mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTools.map((tool, index) => {
            const averageRating = calculateAverageRating(tool.reviews);
            const userCount = formatUserCount(tool.viewCount);
            const gradient = getGradientForIndex(index);

            return (
              <Card
                key={tool.id}
                onClick={() => {
                  navigate(`/tools/${tool.id}`);
                  onViewTool?.(tool);
                }}
                className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                
                <CardContent className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {tool.category.name}
                    </Badge>
                    <ImageWithFallback
                      src={tool.imageUrl}
                      alt={tool.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{userCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tool Labels */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.labels.slice(0, 3).map((tl) => (
                      <Badge
                        key={tl.label.id}
                        className="text-xs"
                        style={{
                          backgroundColor: `${tl.label.color}20`,
                          color: tl.label.color,
                          borderColor: `${tl.label.color}40`,
                        }}
                      >
                        {tl.label.name}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0">
                    Probar Ahora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate('/featured')}
          >
            Ver Todas las Herramientas Destacadas
          </Button>
        </div>
      </div>
    </section>
  );
}