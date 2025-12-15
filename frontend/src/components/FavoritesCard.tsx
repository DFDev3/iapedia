import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Heart, ExternalLink, Trash2 } from 'lucide-react';

interface FavoriteLabel {
  label: {
    name: string;
    color: string;
  };
}

interface FavoriteTool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  category: {
    name: string;
  };
  labels: FavoriteLabel[];
  viewCount: number;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Array<{ rating: number }>;
}

interface FavoriteItem {
  id: number;
  createdAt: string;
  tool: FavoriteTool;
}

interface FavoritesCardProps {
  favorite: FavoriteItem;
  onRemove?: (favoriteId: number) => void;
}

export function FavoritesCard({ favorite, onRemove }: FavoritesCardProps) {
  const tool = favorite.tool;

  // Compute averageRating if not provided
  const averageRating = tool.averageRating ?? (
    tool.reviews && tool.reviews.length > 0
      ? parseFloat((tool.reviews.reduce((sum, r) => sum + r.rating, 0) / tool.reviews.length).toFixed(1))
      : 0
  );

  const reviewCount = tool.reviewCount ?? tool.reviews?.length ?? 0;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(favorite.id);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <a href={`/tools/${tool.id}`} className="group block">
      <Card className="bg-neutral-900 border-gray-800 hover:border-primary/50 transition-all overflow-hidden h-full flex flex-col">
        <div className="relative w-full h-40 overflow-hidden bg-neutral-800">
          {/* Tool Banner/Image */}
          <img
            src={tool.imageUrl}
            alt={tool.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x160?text=AI+Tool';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          
          {/* Heart Icon Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500/90 text-white border-red-500">
              <Heart className="w-3 h-3 fill-current mr-1" />
              Favorito
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Title and Category */}
          <div className="mb-2">
            <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors line-clamp-2">
              {tool.name}
            </h3>
            <p className="text-xs text-gray-400">{tool.category.name}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {tool.description}
          </p>

          {/* Labels */}
          {tool.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tool.labels.slice(0, 2).map(({ label }, idx) => (
                <Badge
                  key={idx}
                  className="text-xs px-2 py-0.5"
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
              {tool.labels.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-gray-700 text-gray-400"
                >
                  +{tool.labels.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Added Date */}
          <p className="text-xs text-gray-500 mb-3">
            Added {getRelativeTime(favorite.createdAt)}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-3 py-2 border-t border-gray-800">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-yellow-400 font-semibold">{averageRating}</span>
              <span className="text-gray-500 text-xs">({reviewCount})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = tool.url;
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visitar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
