import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Eye, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ToolLabel {
  label: {
    id: number;
    name: string;
    color: string;
  };
}

interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  category?: { id: number; name: string };
  labels: ToolLabel[];
  averageRating?: number;
  reviewCount?: number;
  reviews?: Array<{ rating: number }>;
  viewCount: number;
  favoriteCount?: number;
  isTrending: boolean;
  isNew: boolean;
  isFavorited?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  onVisit?: () => void;
  onFavoriteChange?: (toolId: number, isFavorited: boolean) => void;
}

export function ToolCard({ tool, onVisit, onFavoriteChange }: ToolCardProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(tool.isFavorited ?? false);
  const [favoriteCount, setFavoriteCount] = useState(tool.favoriteCount ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  const displayedLabels = tool.labels.slice(0, 3);
  const hiddenLabels = tool.labels.slice(3);

  // Compute averageRating and reviewCount if not provided
  const averageRating = tool.averageRating ?? (
    tool.reviews && tool.reviews.length > 0
      ? parseFloat((tool.reviews.reduce((sum, r) => sum + r.rating, 0) / tool.reviews.length).toFixed(1))
      : 0
  );

  const reviewCount = tool.reviewCount ?? tool.reviews?.length ?? 0;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to add favorites');
      window.location.href = '/auth';
      return;
    }

    try {
      setIsLoading(true);
      
      if (isFavorited) {
        // Remove favorite
        await api.removeFromFavorites(tool.id);
        setIsFavorited(false);
        setFavoriteCount(prev => Math.max(0, prev - 1));
        onFavoriteChange?.(tool.id, false);
        toast.success('Removed from favorites');
      } else {
        // Add favorite
        await api.addToFavorites(tool.id);
        setIsFavorited(true);
        setFavoriteCount(prev => prev + 1);
        onFavoriteChange?.(tool.id, true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update favorite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <a href={`/tools/${tool.id}`} className="group block h-full">
      <Card className="bg-neutral-900 border-gray-800 hover:border-primary/50 transition-all overflow-hidden h-full">
        <div className="p-6 flex gap-4 h-full flex-col">
          {/* Tool Header with Image */}
          <div className="flex gap-4">
            {/* Tool Image */}
            <div className="flex-shrink-0 w-24 h-24">
              <img
                src={tool.imageUrl}
                alt={tool.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=AI';
                }}
                className="w-full h-full object-cover rounded-lg bg-neutral-800"
              />
            </div>

            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  {tool.category && (
                    <p className="text-sm text-gray-400">{tool.category.name}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
                  {tool.isNew && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 whitespace-nowrap">
                      Nuevo
                    </Badge>
                  )}
                  {tool.isTrending && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 whitespace-nowrap">
                      Tendencia
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Labels with Tooltip */}
          {tool.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 relative">
              {displayedLabels.map(({ label }) => (
                <Badge
                  key={label.id}
                  className="text-xs cursor-default"
                  style={{
                    backgroundColor: `${label.color}20`,
                    color: label.color,
                    borderColor: `${label.color}40`,
                  }}
                  variant="outline"
                >
                  {label.name}
                </Badge>
              ))}
              
              {hiddenLabels.length > 0 && (
                <div className="relative group/tooltip">
                  <Badge 
                    variant="outline" 
                    className="text-xs border-gray-700 text-gray-400 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    +{hiddenLabels.length}
                  </Badge>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full right-0 mb-2 bg-neutral-800 border border-gray-700 rounded-lg p-3 whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 shadow-lg">
                    <div className="text-xs font-semibold text-gray-300 mb-2">Más etiquetas:</div>
                    <div className="flex flex-wrap gap-2">
                      {hiddenLabels.map(({ label }) => (
                        <Badge
                          key={label.id}
                          className="text-xs"
                          style={{
                            backgroundColor: `${label.color}20`,
                            color: label.color,
                            borderColor: `${label.color}40`,
                          }}
                          variant="outline"
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full right-6 border-4 border-transparent border-t-neutral-800"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Stats and CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-yellow-400 font-semibold">{averageRating}</span>
                <span className="text-gray-500">({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{tool.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{favoriteCount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className={`${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = tool.url;
                  onVisit?.();
                }}
              >
                Visitar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
