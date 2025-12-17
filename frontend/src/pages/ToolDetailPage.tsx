import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Star, ExternalLink, Users, Calendar, ArrowLeft, TrendingUp, Sparkles } from "lucide-react";
import { toast } from "sonner";
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
  bannerUrl: string | null;
  planType: string;
  isTrending: boolean;
  isNew: boolean;
  viewCount: number;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  labels: Array<{
    label: Label;
  }>;
  reviews: Review[];
  favorites: Array<{
    userId: number;
  }>;
}

export function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTool();
    
    // Track view - use a small delay to batch any duplicate calls from StrictMode
    const timer = setTimeout(() => {
      trackView();
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  const trackView = async () => {
    try {
      await fetch(`http://localhost:4000/api/tools/${id}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const fetchTool = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tools/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tool');
      const data = await response.json();
      setTool(data);
    } catch (error) {
      console.error('Error fetching tool:', error);
      toast.error('Failed to load tool details');
    } finally {
      setLoading(false);
    }
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

  const calculateRatingStats = () => {
    if (!tool || tool.reviews.length === 0) {
      return {
        average: 0,
        distribution: [
          { stars: 5, percentage: 0, count: 0 },
          { stars: 4, percentage: 0, count: 0 },
          { stars: 3, percentage: 0, count: 0 },
          { stars: 2, percentage: 0, count: 0 },
          { stars: 1, percentage: 0, count: 0 }
        ]
      };
    }

    const total = tool.reviews.length;
    const distribution = [5, 4, 3, 2, 1].map(stars => {
      const count = tool.reviews.filter(r => r.rating === stars).length;
      return {
        stars,
        percentage: Math.round((count / total) * 100),
        count
      };
    });

    const sum = tool.reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    return { average: parseFloat(average), distribution };
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || userRating === 0) return;

    // Check if user is logged in
    if (!isAuthenticated || !user) {
      toast.error('Please login to submit a review');
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          toolId: parseInt(id!),
          rating: userRating,
          content: newComment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setNewComment("");
      setUserRating(0);
      
      // Refresh tool data to show new review
      await fetchTool();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading tool details...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Tool not found</p>
        <Button onClick={() => navigate('/categories')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
      </div>
    );
  }

  const stats = calculateRatingStats();

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Banner */}
      <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {tool.bannerUrl ? (
          <img
            src={tool.bannerUrl}
            alt={tool.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageWithFallback
              src={tool.imageUrl}
              alt={tool.name}
              className="w-32 h-32 object-contain opacity-40"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
             {/* Tool Header */}
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-4">
                  <ImageWithFallback
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h1 className="text-4xl md:text-5xl flex-1">{tool.name}</h1>
                      <div className="flex gap-2">
                        {tool.isNew && <Sparkles className="w-6 h-6 text-yellow-500" />}
                        {tool.isTrending && <TrendingUp className="w-6 h-6 text-orange-500" />}
                      </div>
                    </div>
                    <p className="text-xl text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.labels.map((tl) => (
                    <Badge
                      key={tl.label.id}
                      className="text-sm"
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

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl">{stats.average}</span>
                    <span className="text-sm text-muted-foreground">({tool.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>{tool.viewCount.toLocaleString()} views</span>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {tool.category.name}
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {tool.planType}
                  </Badge>
                </div>

                <Button 
                  size="lg" 
                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                  onClick={() => window.open(tool.url, '_blank')}
                >
                  Visit {tool.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Tool Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>About this Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {tool.name} is a cutting-edge AI-powered tool designed to revolutionize your creative workflow. 
                  Built with state-of-the-art machine learning algorithms, it delivers exceptional results with minimal effort.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">High Quality Output</h4>
                      <p className="text-sm text-muted-foreground">
                        Consistently delivers professional-grade results
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">Easy Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        Seamlessly fits into your existing workflow
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">Active Community</h4>
                      <p className="text-sm text-muted-foreground">
                        Join millions of satisfied users worldwide
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">Regular Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Continuous improvements and new features
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating & Review Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Rate & Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Your Rating</p>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || userRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {userRating} {userRating === 1 ? "star" : "stars"}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Your Review</label>
                  <Textarea
                    placeholder="Share your experience with this tool..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-32 bg-input border-border"
                  />
                </div>

                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || userRating === 0}
                  className="w-full md:w-auto"
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>User Reviews ({tool.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tool.reviews.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  tool.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{review.user.name}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{getRelativeTime(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content || 'No review text provided'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Rating Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Rating Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center pb-4 border-b border-border">
                    <div className="text-5xl mb-2">{stats.average}</div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(stats.average)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.reviews.length} total reviews</p>
                  </div>

                  <div className="space-y-3">
                    {stats.distribution.map((item) => (
                      <div key={item.stars} className="flex items-center space-x-3">
                        <span className="text-sm w-6">{item.stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Progress value={item.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">{tool.planType}</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start using this tool today
                    </p>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600" 
                      onClick={() => window.open(tool.url, '_blank')}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
