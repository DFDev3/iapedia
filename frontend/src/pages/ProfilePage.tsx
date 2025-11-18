import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Star, ArrowLeft, Settings, Heart, MessageSquare, Calendar } from "lucide-react";



export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "AI enthusiast and tech professional exploring cutting-edge tools to enhance productivity and creativity.",
    location: "San Francisco, CA",
    joinDate: "January 2024"
  });

  const favorites = [
    {
      name: "Neural Canvas",
      category: "Image AI",
      rating: 4.9,
      lastUsed: "2 days ago"
    },
    {
      name: "LinguaForge",
      category: "Text AI",
      rating: 4.8,
      lastUsed: "1 week ago"
    },
    {
      name: "AudioCraft Pro",
      category: "Sound AI",
      rating: 4.7,
      lastUsed: "2 weeks ago"
    }
  ];

  const reviews = [
    {
      tool: "Neural Canvas",
      rating: 5,
      date: "2 days ago",
      text: "Absolutely incredible! This tool has revolutionized our workflow."
    },
    {
      tool: "TaskMaster AI",
      rating: 4,
      date: "1 week ago",
      text: "Great productivity tool. Helps me stay organized and efficient."
    }
  ];

  const stats = [
    { label: "Tools Reviewed", value: "12" },
    { label: "Favorites", value: "8" },
    { label: "Comments", value: "24" },
    { label: "Member Since", value: "Jan 2024" }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-2xl rounded-full">
                  AJ
                </div>
                
                <h2 className="text-2xl mb-2">{profile.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {profile.joinDate}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
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
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Location</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="bg-input border-border"
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
                    <Button className="flex-1" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-24">Location:</span>
                      <span>{profile.location}</span>
                    </div>
                  </div>
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

              <TabsContent value="favorites" className="space-y-4">
                {favorites.map((tool, index) => (
                  <Card key={index} className="bg-card border-border hover:bg-card/80 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl">{tool.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{tool.rating}</span>
                            </div>
                            <span>Last used {tool.lastUsed}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4 fill-primary text-primary" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl">{review.tool}</h3>
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
                      </div>
                      <p className="text-muted-foreground mb-2">{review.text}</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
