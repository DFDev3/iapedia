import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Star, ArrowLeft, Settings, Heart, MessageSquare, Calendar, LogOut, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FavoritesCard } from "../components/FavoritesCard";

interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  joinedAt: string;
  helpfulVotes: number;
  _count: {
    reviews: number;
    favorites: number;
  };
  favorites: Array<{
    id: number;
    createdAt: string;
    tool: {
      id: number;
      name: string;
      description: string;
      imageUrl: string;
      url: string;
      viewCount: number;
      favoriteCount: number;
      isTrending: boolean;
      isNew: boolean;
      category: {
        id: number;
        name: string;
      };
      labels: Array<{
        label: {
          id: number;
          name: string;
          color: string;
        };
      }>;
      reviews?: Array<{
        rating: number;
      }>;
      averageRating?: number;
      reviewCount?: number;
    };
  }>;
  reviews: Array<{
    id: number;
    rating: number;
    content: string;
    createdAt: string;
    tool: {
      id: number;
      name: string;
    };
  }>;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !user) {
      toast.error("Please login to view your profile");
      navigate("/auth");
      return;
    }
    
    fetchUserData(user.id);
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchUserData = async (userId: number) => {
    try {
      console.log('Fetching user data for ID:', userId);
      const response = await fetch(`http://localhost:4000/api/users/${userId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch user');
      }
      
      const data = await response.json();
      console.log('User data received:', data);
      setUserData(data);
      setProfile({
        name: data.name,
        email: data.email,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(`Failed to load profile data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      const response = await fetch(`http://localhost:4000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      setUserData(updatedUser);
      setProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
      });
      
      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.name = updatedUser.name;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!userData) return;

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id })
      });

      if (!response.ok) throw new Error('Failed to delete review');

      toast.success('Review deleted successfully');
      setDeleteReviewId(null);
      
      // Refresh user data
      await fetchUserData(userData.id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleUpdateReview = async (reviewId: number) => {
    if (!userData) return;

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          rating: editReviewRating,
          content: editReviewText
        })
      });

      if (!response.ok) throw new Error('Failed to update review');

      toast.success('Review updated successfully');
      setEditingReview(null);
      setEditReviewText('');
      setEditReviewRating(0);
      
      // Refresh user data
      await fetchUserData(userData.id);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load profile</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const stats = [
    { label: "Tools Reviewed", value: userData._count.reviews.toString() },
    { label: "Favorites", value: userData._count.favorites.toString() },
    { label: "Helpful Votes", value: userData.helpfulVotes.toString() },
    { label: "Member Since", value: formatDate(userData.joinedAt) }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:text-primary"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-8 text-center">
                <img 
                  src={userData.avatarUrl} 
                  alt={userData.name}
                  className="w-24 h-24 mx-auto mb-4 rounded-full"
                />
                
                <h2 className="text-2xl mb-2">{userData.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{userData.email}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {formatDate(userData.joinedAt)}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl text-primary mb-1">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Choose Avatar</label>
                    <div className="grid grid-cols-6 gap-3 mb-4">
                      {['robot1', 'robot2', 'robot3', 'robot4', 'robot5', 'robot6', 'robot7', 'robot8', 'robot9', 'robot10', 'robot11', 'robot12'].map((seed) => {
                        const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
                        return (
                          <button
                            key={seed}
                            type="button"
                            onClick={() => setProfile({ ...profile, avatarUrl })}
                            className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
                              profile.avatarUrl === avatarUrl
                                ? 'border-orange-500 ring-2 ring-orange-500 ring-offset-2'
                                : 'border-border hover:border-orange-300'
                            }`}
                          >
                            <img src={avatarUrl} alt={seed} className="w-full h-full rounded-full" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="bg-input border-border"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="min-h-32 bg-input border-border"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      // Reset to original values
                      if (userData) {
                        setProfile({
                          name: userData.name,
                          email: userData.email,
                          bio: userData.bio,
                          avatarUrl: userData.avatarUrl,
                        });
                      }
                    }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{userData.bio}</p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="favorites">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="favorites" className="space-y-6">
                {userData.favorites.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No favorites yet. Start exploring tools!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userData.favorites.map((favorite) => (
                      <FavoritesCard 
                        key={favorite.id}
                        favorite={favorite}
                        onRemove={async (favoriteId) => {
                          try {
                            const userId = localStorage.getItem('user');
                            if (!userId) return;
                            const user = JSON.parse(userId);
                            
                            const res = await fetch(
                              `http://localhost:4000/api/tools/${favorite.tool.id}/favorite`,
                              {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user.id })
                              }
                            );
                            
                            if (res.ok) {
                              setUserData(prev => prev ? {
                                ...prev,
                                favorites: prev.favorites.filter(f => f.id !== favoriteId)
                              } : null);
                              toast.success('Removed from favorites');
                            }
                          } catch (err) {
                            console.error('Error removing favorite:', err);
                            toast.error('Failed to remove favorite');
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {userData.reviews.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews yet. Share your experience with tools!</p>
                    </CardContent>
                  </Card>
                ) : (
                  userData.reviews.map((review) => (
                    <Card key={review.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        {editingReview === review.id ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl">{review.tool.name}</h3>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setEditReviewRating(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-4 h-4 ${
                                        star <= editReviewRating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <Textarea
                              value={editReviewText}
                              onChange={(e) => setEditReviewText(e.target.value)}
                              className="min-h-24 bg-input border-border"
                              placeholder="Update your review..."
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateReview(review.id)}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingReview(null);
                                  setEditReviewText('');
                                  setEditReviewRating(0);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-xl">{review.tool.name}</h3>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingReview(review.id);
                                    setEditReviewText(review.content || '');
                                    setEditReviewRating(review.rating);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteReviewId(review.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.content || 'No review text'}</p>
                            <span className="text-xs text-muted-foreground">{getRelativeTime(review.createdAt)}</span>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Delete Review Confirmation Dialog */}
      <AlertDialog open={deleteReviewId !== null} onOpenChange={(open) => !open && setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReviewId && handleDeleteReview(deleteReviewId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
