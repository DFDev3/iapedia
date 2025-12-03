import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Star, Users, Zap, TrendingUp, Award, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);

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
    // Add null/undefined check
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const formatUserCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
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

  const FeaturedToolCard = ({
    tool,
    gradient,
  }: {
    tool: Tool;
    gradient: string;
  }) => {
    const averageRating = calculateAverageRating(tool.reviews ?? []);
    const userCount = formatUserCount(tool.viewCount);

    return (
      <Card
        className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/tools/${tool.id}`)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`}
        ></div>

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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {userCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tool Labels */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.labels.slice(0, 4).map((tl) => (
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
            Ver Detalles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  };

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
                    <FeaturedToolCard
                      key={tool.id}
                      tool={tool}
                      gradient={section.gradient}
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
