import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ToolLabels, createPricingLabel, LABEL_CONFIGS } from "../components/ToolLabels";
import { Star, ExternalLink, Users, Calendar, ArrowLeft } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

interface ToolDetailPageProps {
  onBack: () => void;
  tool?: {
    name: string;
    description: string;
    category: string;
    rating: number;
    users: string;
    price: string;
    labels: any[];
    banner?: string;
  };
}

export function ToolDetailPage({ onBack, tool }: ToolDetailPageProps) {
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "SC",
      rating: 5,
      date: "2 days ago",
      text: "Absolutely incredible! This tool has revolutionized our workflow. The AI capabilities are top-notch and the interface is incredibly intuitive."
    },
    {
      id: "2",
      author: "Michael Rodriguez",
      avatar: "MR",
      rating: 4,
      date: "1 week ago",
      text: "Great tool overall. The features are robust and well-implemented. Would love to see more customization options in future updates."
    },
    {
      id: "3",
      author: "Emily Watson",
      avatar: "EW",
      rating: 5,
      date: "2 weeks ago",
      text: "This is exactly what I was looking for! The results are consistently high quality and the processing speed is impressive."
    }
  ]);

  const defaultTool = {
    name: "Neural Canvas",
    description: "Advanced image generation with unprecedented quality and control",
    category: "Image AI",
    rating: 4.9,
    users: "2.3M",
    price: "Freemium",
    labels: [
      createPricingLabel("Freemium"),
      LABEL_CONFIGS.category.image,
      LABEL_CONFIGS.capability.assistant,
      LABEL_CONFIGS.status.popular
    ],
    banner: "https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBuZXVyYWwlMjBuZXR3b3JrfGVufDF8fHx8MTc2MDAyMjM3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  };

  const currentTool = tool || defaultTool;

  const ratingDistribution = [
    { stars: 5, percentage: 75, count: 1823 },
    { stars: 4, percentage: 15, count: 364 },
    { stars: 3, percentage: 6, count: 146 },
    { stars: 2, percentage: 3, count: 73 },
    { stars: 1, percentage: 1, count: 24 }
  ];

  const handleSubmitComment = () => {
    if (newComment.trim() && userRating > 0) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        avatar: "YO",
        rating: userRating,
        date: "Just now",
        text: newComment
      };
      setComments([comment, ...comments]);
      setNewComment("");
      setUserRating(0);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Banner */}
      <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {currentTool.banner && (
          <img
            src={currentTool.banner}
            alt={currentTool.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Header */}
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl mb-4">{currentTool.name}</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                      {currentTool.description}
                    </p>
                  </div>
                </div>

                <ToolLabels labels={currentTool.labels} maxLabels={5} className="mb-6" />

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl">{currentTool.rating}</span>
                    <span className="text-sm text-muted-foreground">(2,430 reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>{currentTool.users} users</span>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {currentTool.category}
                  </Badge>
                </div>

                <Button size="lg" className="w-full md:w-auto">
                  Try {currentTool.name}
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
                  {currentTool.name} is a cutting-edge AI-powered tool designed to revolutionize your creative workflow. 
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

            {/* Comments Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>User Reviews ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center rounded-full">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p>{comment.author}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < comment.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <div className="text-5xl mb-2">{currentTool.rating}</div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(currentTool.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">2,430 total reviews</p>
                  </div>

                  <div className="space-y-3">
                    {ratingDistribution.map((item) => (
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
                    <div className="text-3xl mb-2">{currentTool.price}</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start using this tool today
                    </p>
                    <Button className="w-full" variant="outline">
                      View Plans
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
