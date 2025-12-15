import { useState, useEffect } from "react";
import { Award, TrendingUp, Zap } from "lucide-react";
import { ToolCard } from "../components/ToolCard";
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
  isTrending: boolean;
  isNew: boolean;
  viewCount: number;
  favoriteCount?: number;
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
  favorites: Array<{
    userId: number;
  }>;
}

export function FeaturedPage() {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  
  // Use favorites hook
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

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

  // Filter tools by categories
  const editorChoiceTools = tools
    .filter((t) => t.labels.some((l) => l.label.slug === "featured"))
    .slice(0, 3);

  const trendingTools = tools.filter((t) => t.isTrending).slice(0, 3);

  const newTools = tools.filter((t) => t.isNew).slice(0, 3);

  if (loading) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground">
            Cargando herramientas destacadas...
          </p>
        </div>
      </section>
    );
  }

  const featuredSections = [
    {
      title: "Elección del Editor",
      description: "Seleccionadas a mano por nuestros expertos en IA",
      icon: <Award className="w-6 h-6" />,
      tools: editorChoiceTools,
      gradient: "from-primary/20 to-blue-500/20",
    },
    {
      title: "En Tendencia",
      description: "Las herramientas IA más populares esta semana",
      icon: <TrendingUp className="w-6 h-6" />,
      tools: trendingTools,
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Últimas Adiciones",
      description: "Las herramientas IA más nuevas en la plataforma",
      icon: <Zap className="w-6 h-6" />,
      tools: newTools,
      gradient: "from-orange-500/20 to-yellow-500/20",
    },
  ].filter((section) => section.tools.length > 0);

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Herramientas IA Destacadas</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre las herramientas IA más innovadoras, populares y revolucionarias.
            Estas selecciones representan la vanguardia de la inteligencia
            artificial.
          </p>
        </div>

        {/* Featured Sections */}
        <div className="space-y-16">
          {featuredSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
              </div>

              {section.tools.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aún no hay herramientas disponibles en esta categoría.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.tools.map((tool) => (
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
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
