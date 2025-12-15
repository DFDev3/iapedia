import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter } from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import { useFavorites } from '../hooks/useFavorites';

interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  planType: string;
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  favoriteCount?: number;
  category: { id: number; name: string };
  labels: Array<{ label: { id: number; name: string; color: string } }>;
  isTrending: boolean;
  isNew: boolean;
}

interface SearchResponse {
  tools: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'views');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch labels for filtering
  const [availableLabels, setAvailableLabels] = useState<Array<{ id: number; name: string; category: string; color: string }>>([]);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

  // Use favorites hook
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/labels');
        const data = await res.json();
        setAvailableLabels(data);
      } catch (err) {
        console.error('Error fetching labels:', err);
      }
    };
    fetchLabels();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          q: searchQuery,
          sortBy,
          page: currentPage.toString(),
          ...(selectedLabels.length > 0 && { labels: selectedLabels.join(',') })
        });

        const res = await fetch(`http://localhost:4000/api/tools/search/query?${query}`);
        const data: SearchResponse = await res.json();
        setTools(data.tools);
        setTotalPages(data.pagination.pages);
      } catch (err) {
        console.error('Error searching tools:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, sortBy, currentPage, selectedLabels]);

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
    setSearchParams({ q: newQuery });
  };

  const handleLabelToggle = (labelId: number) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedLabels([]);
    setCurrentPage(1);
  };

  const groupedLabels = availableLabels.reduce((acc, label) => {
    if (!acc[label.category]) acc[label.category] = [];
    acc[label.category].push(label);
    return acc;
  }, {} as Record<string, typeof availableLabels>);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Busca herramientas IA, modelos o categorías..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-neutral-800 text-white placeholder:text-gray-400 border-gray-600"
            />
          </div>

          {/* Results Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {searchQuery ? `Resultados de búsqueda: "${searchQuery}"` : 'Todas las herramientas'}
            </h1>
            <p className="text-gray-400">
              Se encontraron <span className="text-primary font-semibold">{tools.length}</span> herramientas
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-neutral-900 rounded-lg p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Filtros</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  ✕
                </Button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-neutral-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-gray-700">
                    <SelectItem value="views">Más vistas</SelectItem>
                    <SelectItem value="rating">Mejor calificadas</SelectItem>
                    <SelectItem value="trending">Tendencias</SelectItem>
                    <SelectItem value="newest">Más nuevas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Labels */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-300">Etiquetas</h3>
                  {selectedLabels.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-xs text-primary hover:bg-primary/10"
                    >
                      Limpiar
                    </Button>
                  )}
                </div>

                {Object.entries(groupedLabels).map(([category, labels]) => (
                  <div key={category} className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</p>
                    <div className="space-y-2">
                      {labels.map(label => (
                        <div key={label.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`label-${label.id}`}
                            checked={selectedLabels.includes(label.id)}
                            onChange={() => handleLabelToggle(label.id)}
                            className="w-4 h-4 rounded border-gray-600 bg-neutral-800 cursor-pointer"
                          />
                          <label
                            htmlFor={`label-${label.id}`}
                            className="ml-2 text-sm text-gray-300 cursor-pointer flex-1"
                          >
                            {label.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Tools Grid */}
          <div className="flex-1 w-full">
            {/* Mobile Filter Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="md:hidden mb-6 w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Buscando herramientas...</p>
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No se encontraron herramientas</p>
                <p className="text-gray-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 mb-8">
                  {tools.map(tool => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-700 text-gray-300 hover:bg-neutral-800"
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? 'bg-primary text-primary-foreground'
                              : 'border-gray-700 text-gray-300 hover:bg-neutral-800'
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-700 text-gray-300 hover:bg-neutral-800"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
