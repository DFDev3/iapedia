import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ImageAIIcon, TextAIIcon, SoundAIIcon, ProductivityIcon } from "../components/CategoryIcons";
import { Search, Filter, Grid, List, TrendingUp, Sparkles, ArrowRight, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";

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
  imageUrl: string;
  isTrending: boolean;
  isNew: boolean;
  labels: { label: Label }[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl?: string;
  createdAt: string;
  _count?: {
    tools: number;
  };
  tools?: Tool[];
}

export function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    minTools: 0,
    hasNewTools: false,
    hasTrendingTools: false,
    sortBy: "name" as "name" | "tools" | "recent",
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      });
  }, []);

  const getCategoryIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('image') || lowercaseName.includes('design')) return <ImageAIIcon />;
    if (lowercaseName.includes('text') || lowercaseName.includes('writing') || lowercaseName.includes('content')) return <TextAIIcon />;
    if (lowercaseName.includes('audio') || lowercaseName.includes('music') || lowercaseName.includes('sound')) return <SoundAIIcon />;
    if (lowercaseName.includes('productivity') || lowercaseName.includes('business')) return <ProductivityIcon />;
    return <TextAIIcon />; // Default icon
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-primary to-blue-500",
      "bg-gradient-to-r from-accent to-green-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-orange-500 to-yellow-500",
      "bg-gradient-to-r from-blue-600 to-cyan-500",
      "bg-gradient-to-r from-red-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-purple-600",
      "bg-gradient-to-r from-teal-500 to-emerald-500",
    ];
    return gradients[index % gradients.length];
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase();
    const matchesCategory = 
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query);
    
    // Also search in tools
    const matchesTools = category.tools?.some(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
    
    const matchesSearch = matchesCategory || matchesTools;
    
    // Apply filters
    const toolCount = category._count?.tools || 0;
    const matchesMinTools = toolCount >= filters.minTools;
    
    const hasNewTools = category.tools?.some(t => t.isNew) || false;
    const matchesNewTools = !filters.hasNewTools || hasNewTools;
    
    const hasTrendingTools = category.tools?.some(t => t.isTrending) || false;
    const matchesTrendingTools = !filters.hasTrendingTools || hasTrendingTools;
    
    return matchesSearch && matchesMinTools && matchesNewTools && matchesTrendingTools;
  });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (filters.sortBy) {
      case "tools":
        return (b._count?.tools || 0) - (a._count?.tools || 0);
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const activeFiltersCount = 
    (filters.minTools > 0 ? 1 : 0) +
    (filters.hasNewTools ? 1 : 0) +
    (filters.hasTrendingTools ? 1 : 0) +
    (filters.sortBy !== "name" ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      minTools: 0,
      hasNewTools: false,
      hasTrendingTools: false,
      sortBy: "name",
    });
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6">AI Categories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore our comprehensive collection of AI tools organized by category. 
            Find the perfect solution for your specific needs.
          </p>
          
          {/* Stats */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-3xl font-bold text-primary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-3xl font-bold text-accent">
                  {categories.reduce((acc, cat) => acc + (cat._count?.tools || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Tools</div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <div className="text-sm text-muted-foreground">Updated Daily</div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search categories or tools..." 
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
              variant="outline" 
              size="lg"
              onClick={() => setShowFilterDialog(true)}
              className={activeFiltersCount > 0 ? "border-orange-500 text-orange-500" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
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

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.minTools > 0 && (
              <Badge variant="secondary" className="gap-1">
                Min {filters.minTools} tools
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, minTools: 0})} />
              </Badge>
            )}
            {filters.hasNewTools && (
              <Badge variant="secondary" className="gap-1">
                Has new tools
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, hasNewTools: false})} />
              </Badge>
            )}
            {filters.hasTrendingTools && (
              <Badge variant="secondary" className="gap-1">
                Has trending tools
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, hasTrendingTools: false})} />
              </Badge>
            )}
            {filters.sortBy !== "name" && (
              <Badge variant="secondary" className="gap-1">
                Sort: {filters.sortBy}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, sortBy: "name"})} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found <span className="font-semibold text-foreground">{sortedCategories.length}</span> {sortedCategories.length === 1 ? 'category' : 'categories'} matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedCategories.length === 0 && (
          <div className="text-center py-12">
            {searchQuery || activeFiltersCount > 0 ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  No categories found matching your {searchQuery ? 'search' : 'filters'}
                </p>
                <div className="flex gap-2 justify-center">
                  {searchQuery && (
                    <Button onClick={() => setSearchQuery("")} variant="outline">
                      Clear search
                    </Button>
                  )}
                  {activeFiltersCount > 0 && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No categories found. Try seeding the database!</p>
            )}
          </div>
        )}

        {/* Categories Grid/List */}
        {!loading && sortedCategories.length > 0 && (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-4"
          }>
            {sortedCategories.map((category, index) => {
              const gradient = getCategoryGradient(index);
              const icon = getCategoryIcon(category.name);
              const toolCount = category._count?.tools || 0;
              const featuredTools = category.tools?.slice(0, 3) || [];

              // List view - horizontal card
              if (viewMode === "list") {
                return (
                  <Card 
                    key={category.id} 
                    className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/categories/${category.id}`)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradient}`}></div>
                    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <CardContent className="p-6 relative">
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className={`p-4 rounded-lg ${gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-15 group-hover:opacity-25 transition-opacity flex-shrink-0`}>
                          <div className="text-foreground w-10 h-10 flex items-center justify-center">
                            {icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                              <Badge variant="secondary" className="text-xs font-medium">
                                {toolCount} tool{toolCount !== 1 ? 's' : ''}
                              </Badge>
                              {featuredTools.some(t => t.isTrending) && (
                                <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {category.description}
                          </p>

                          {/* Featured Tools in List */}
                          {featuredTools.length > 0 && (
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-muted-foreground">Featured:</span>
                              {featuredTools.map((tool) => (
                                <div 
                                  key={tool.id}
                                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/tools/${tool.id}`);
                                  }}
                                >
                                  {tool.imageUrl && (
                                    <img 
                                      src={tool.imageUrl} 
                                      alt={tool.name}
                                      className="w-4 h-4 rounded object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span className="text-xs font-medium">{tool.name}</span>
                                  {tool.isNew && <Sparkles className="w-3 h-3 text-yellow-500" />}
                                </div>
                              ))}
                              {toolCount > 3 && (
                                <span className="text-xs text-muted-foreground">+{toolCount - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Button */}
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600 text-white transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0 flex-shrink-0"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              // Grid view - vertical card (existing)
              return (
                <Card 
                  key={category.id} 
                  className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`}></div>
                  
                  {/* Background gradient overlay on hover */}
                  <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <CardContent className="p-6 relative flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-15 group-hover:opacity-25 transition-opacity`}>
                        <div className="text-foreground w-8 h-8 flex items-center justify-center">
                          {icon}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {toolCount} tool{toolCount !== 1 ? 's' : ''}
                        </Badge>
                        {featuredTools.some(t => t.isTrending) && (
                          <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>

                    {/* Featured Tools - grows to fill space */}
                    <div className="mb-4 space-y-2 flex-1">
                      {featuredTools.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Featured Tools
                          </p>
                          <div className="space-y-2">
                            {featuredTools.map((tool) => (
                              <div 
                                key={tool.id} 
                                className="flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tools/${tool.id}`);
                                }}
                              >
                                {tool.imageUrl && (
                                  <img 
                                    src={tool.imageUrl} 
                                    alt={tool.name}
                                    className="w-6 h-6 rounded object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium truncate">
                                      {tool.name}
                                    </span>
                                    {tool.isNew && (
                                      <Sparkles className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                                {tool.labels && tool.labels.length > 0 && (
                                  <Badge 
                                    className="text-xs px-2 py-0 text-white border-0"
                                    style={{ backgroundColor: tool.labels[0].label.color }}
                                  >
                                    {tool.labels[0].label.name}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          {toolCount > 3 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              +{toolCount - 3} more tool{toolCount - 3 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Explore Button - always at bottom */}
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all mt-auto hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0"
                    >
                      <span>Explore {category.name}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Categories</DialogTitle>
            <DialogDescription>
              Refine your search with these filters
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Minimum Tools Filter */}
            <div className="space-y-2">
              <Label htmlFor="minTools">Minimum Number of Tools</Label>
              <Select
                value={filters.minTools.toString()}
                onValueChange={(value) => setFilters({...filters, minTools: parseInt(value)})}
              >
                <SelectTrigger id="minTools">
                  <SelectValue placeholder="Select minimum tools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No minimum</SelectItem>
                  <SelectItem value="5">At least 5 tools</SelectItem>
                  <SelectItem value="10">At least 10 tools</SelectItem>
                  <SelectItem value="15">At least 15 tools</SelectItem>
                  <SelectItem value="20">At least 20 tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By Filter */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: "name" | "tools" | "recent") => setFilters({...filters, sortBy: value})}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="tools">Most Tools</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Boolean Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasNewTools"
                  checked={filters.hasNewTools}
                  onCheckedChange={(checked) => 
                    setFilters({...filters, hasNewTools: checked === true})
                  }
                />
                <label
                  htmlFor="hasNewTools"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Has new tools
                  <span className="ml-2 text-xs text-muted-foreground">
                    Show only categories with newly added tools
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTrendingTools"
                  checked={filters.hasTrendingTools}
                  onCheckedChange={(checked) => 
                    setFilters({...filters, hasTrendingTools: checked === true})
                  }
                />
                <label
                  htmlFor="hasTrendingTools"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Has trending tools
                  <span className="ml-2 text-xs text-muted-foreground">
                    Show only categories with trending tools
                  </span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}