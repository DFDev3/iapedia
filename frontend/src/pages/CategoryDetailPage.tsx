import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ImageAIIcon, TextAIIcon, SoundAIIcon, ProductivityIcon } from "../components/CategoryIcons";
import { ArrowLeft, Grid, List, TrendingUp, Sparkles, ArrowRight, Search, Star, Users } from "lucide-react";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";

interface Label {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
}

interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
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
  labels: { label: Label }[];
  reviews: Review[];
  favorites: Array<{
    userId: number;
  }>;
}

interface Category {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  iconUrl: string;
  createdAt: string;
  _count: {
    tools: number;
  };
  tools: Tool[];
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "image generation":
      return <ImageAIIcon />;
    case "text generation":
    case "writing assistants":
      return <TextAIIcon />;
    case "audio tools":
    case "voice synthesis":
      return <SoundAIIcon />;
    case "productivity":
    case "automation tools":
      return <ProductivityIcon />;
    default:
      return <ImageAIIcon />;
  }
};

const getCategoryGradient = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "image generation":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "text generation":
    case "writing assistants":
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "audio tools":
    case "voice synthesis":
      return "bg-gradient-to-r from-green-500 to-emerald-500";
    case "productivity":
    case "automation tools":
      return "bg-gradient-to-r from-orange-500 to-amber-500";
    default:
      return "bg-gradient-to-r from-indigo-500 to-purple-500";
  }
};

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando categoría...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Categoría no encontrada</p>
        <Button onClick={() => navigate('/categories')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Categorías
        </Button>
      </div>
    );
  }

  const icon = getCategoryIcon(category.name);
  const gradient = getCategoryGradient(category.name);

  // Filter tools based on search
  const filteredTools = category.tools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.labels.some(tl => tl.label.name.toLowerCase().includes(query))
    );
  });

  // Calculate statistics
  const newToolsCount = category.tools.filter(t => t.isNew).length;
  const trendingToolsCount = category.tools.filter(t => t.isTrending).length;
  const freeToolsCount = category.tools.filter(t => t.planType === 'FREE').length;

  return (
    <section className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/categories')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Categorías
        </Button>

        {/* Category Header */}
        <div className="relative mb-12">
          <div className={`absolute inset-0 ${gradient} opacity-5 rounded-2xl`}></div>
          <div className="relative bg-card border border-border rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon */}
              <div className={`p-6 rounded-xl ${gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-15 flex-shrink-0`}>
                <div className="text-foreground w-20 h-20 flex items-center justify-center">
                  {icon}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {category.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">
                      {category._count.tools}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Herramientas</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-500 flex items-center gap-2">
                      {trendingToolsCount}
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-muted-foreground">En Tendencia</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                      {newToolsCount}
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-muted-foreground">Herramientas Nuevas</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-500">
                      {freeToolsCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Herramientas Gratis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar herramientas en esta categoría..."
              className="pl-12 h-12 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="lg"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="lg"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Encontrada{filteredTools.length !== 1 ? 's' : ''} <span className="font-semibold text-foreground">{filteredTools.length}</span> herramienta{filteredTools.length !== 1 ? 's' : ''} que coincide{filteredTools.length !== 1 ? 'n' : ''} con "{searchQuery}"
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  No se encontraron herramientas que coincidan con "{searchQuery}"
                </p>
                <Button onClick={() => setSearchQuery("")} variant="outline">
                  Limpiar búsqueda
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Aún no hay herramientas en esta categoría.</p>
            )}
          </div>
        )}

        {/* Tools Grid/List */}
        {filteredTools.length > 0 && (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredTools.map((tool) => {
              // Grid View
              if (viewMode === "grid") {
                return (
                  <Card
                    key={tool.id}
                    className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradient}`}></div>
                    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    <CardContent className="p-6 relative flex flex-col h-full">
                      {/* Tool Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <ImageWithFallback
                          src={tool.imageUrl}
                          alt={tool.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                              {tool.name}
                            </h3>
                            <div className="flex gap-1 flex-shrink-0">
                              {tool.isNew && <Sparkles className="w-4 h-4 text-yellow-500" />}
                              {tool.isTrending && <TrendingUp className="w-4 h-4 text-orange-500" />}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {tool.planType}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {tool.description}
                      </p>

                      {/* Rating and Users */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {tool.reviews && tool.reviews.length > 0
                              ? (tool.reviews.reduce((acc, r) => acc + r.rating, 0) / tool.reviews.length).toFixed(1)
                              : 'Nuevo'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {tool.viewCount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      {tool.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
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
                          {tool.labels.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tool.labels.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* View Details Button */}
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all mt-auto hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tools/${tool.id}`);
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              // List View
              return (
                <Card
                  key={tool.id}
                  className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradient}`}></div>
                  <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  <CardContent className="p-6 relative">
                    <div className="flex items-center gap-6">
                      {/* Tool Logo */}
                      <ImageWithFallback
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {tool.name}
                            </h3>
                            <div className="flex gap-2">
                              {tool.isNew && (
                                <Badge className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  New
                                </Badge>
                              )}
                              {tool.isTrending && (
                                <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {tool.planType}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {tool.description}
                        </p>

                        {/* Labels in List */}
                        {tool.labels.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tool.labels.map((tl) => (
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
                        )}
                      </div>

                      {/* View Details Button */}
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tools/${tool.id}`);
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
