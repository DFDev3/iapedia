import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const [favoritedToolIds, setFavoritedToolIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        if (!isAuthenticated || !user) {
          setLoading(false);
          return;
        }

        // Fetch user data which includes their favorites
        const userData = await api.getCurrentUser() as any;
        const toolIds: Set<number> = new Set((userData.favorites ?? []).map((fav: any) => fav.toolId as number));
        setFavoritedToolIds(toolIds);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFavorites();
  }, [isAuthenticated, user]);

  const isFavorited = (toolId: number) => favoritedToolIds.has(toolId);

  const addFavorite = (toolId: number) => {
    setFavoritedToolIds(prev => new Set([...prev, toolId]));
  };

  const removeFavorite = (toolId: number) => {
    setFavoritedToolIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(toolId);
      return newSet;
    });
  };

  return {
    isFavorited,
    addFavorite,
    removeFavorite,
    loading
  };
}
