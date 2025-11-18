import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ToolLabels, createPricingLabel, LABEL_CONFIGS } from "../components/ToolLabels";
import { Star, Users, ArrowLeft, Filter } from "lucide-react";

interface CategoryDetailPageProps {
  category: {
    title: string;
    description: string;
    count: number;
    icon: React.ReactNode;
    gradient: string;
  };
  onBack?: () => void;
  onViewTool?: (tool: any) => void;
}

export function CategoryDetailPage({ category, onBack, onViewTool }: CategoryDetailPageProps) {
  // Sample tools data - this would be filtered by category in a real app
  const getToolsForCategory = () => {
    const allTools = [
      {
        name: "Neural Canvas",
        description: "Advanced image generation with unprecedented quality and control. Create stunning visuals from text prompts.",
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
        gradient: "from-primary/20 to-blue-500/20"
      },
      {
        name: "PixelForge AI",
        description: "Professional image editing powered by AI. Enhance, restore, and transform photos with one click.",
        category: "Image AI",
        rating: 4.8,
        users: "1.5M",
        price: "Free",
        labels: [
          createPricingLabel("Free"),
          LABEL_CONFIGS.category.image,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.trending
        ],
        gradient: "from-primary/20 to-purple-500/20"
      },
      {
        name: "StyleTransfer Pro",
        description: "Apply artistic styles to your images instantly. Transform photos into paintings, sketches, and more.",
        category: "Image AI",
        rating: 4.7,
        users: "980K",
        price: "$15/mo",
        labels: [
          createPricingLabel("$15/mo"),
          LABEL_CONFIGS.category.image,
          LABEL_CONFIGS.capability.api,
          LABEL_CONFIGS.status.featured
        ],
        gradient: "from-primary/20 to-pink-500/20"
      },
      {
        name: "LinguaForge",
        description: "Next-generation language model for creative writing and analysis. Perfect for content creators.",
        category: "Text AI",
        rating: 4.8,
        users: "1.8M",
        price: "$25/mo",
        labels: [
          createPricingLabel("$25/mo"),
          LABEL_CONFIGS.category.text,
          LABEL_CONFIGS.capability.gpt,
          LABEL_CONFIGS.status.featured
        ],
        gradient: "from-accent/20 to-green-500/20"
      },
      {
        name: "TextCraft AI",
        description: "Generate high-quality content for blogs, social media, and marketing with AI assistance.",
        category: "Text AI",
        rating: 4.6,
        users: "1.2M",
        price: "Freemium",
        labels: [
          createPricingLabel("Freemium"),
          LABEL_CONFIGS.category.text,
          LABEL_CONFIGS.capability.gpt,
          LABEL_CONFIGS.status.popular
        ],
        gradient: "from-accent/20 to-blue-500/20"
      },
      {
        name: "CodeAssist Pro",
        description: "AI-powered coding assistant. Write, debug, and optimize code faster with intelligent suggestions.",
        category: "Text AI",
        rating: 4.9,
        users: "2.1M",
        price: "$20/mo",
        labels: [
          createPricingLabel("$20/mo"),
          LABEL_CONFIGS.category.text,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.trending
        ],
        gradient: "from-accent/20 to-purple-500/20"
      },
      {
        name: "AudioCraft Pro",
        description: "Professional audio generation and enhancement suite. Create music, sound effects, and voiceovers.",
        category: "Sound AI",
        rating: 4.7,
        users: "890K",
        price: "Free Trial",
        labels: [
          createPricingLabel("Free Trial"),
          LABEL_CONFIGS.category.audio,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.new
        ],
        gradient: "from-purple-500/20 to-pink-500/20"
      },
      {
        name: "VoiceGen AI",
        description: "Realistic text-to-speech and voice cloning. Generate natural-sounding voices in multiple languages.",
        category: "Sound AI",
        rating: 4.8,
        users: "1.1M",
        price: "$18/mo",
        labels: [
          createPricingLabel("$18/mo"),
          LABEL_CONFIGS.category.audio,
          LABEL_CONFIGS.capability.api,
          LABEL_CONFIGS.status.featured
        ],
        gradient: "from-purple-500/20 to-blue-500/20"
      },
      {
        name: "MusicMuse",
        description: "AI music composition and generation. Create original tracks, melodies, and background music.",
        category: "Sound AI",
        rating: 4.5,
        users: "650K",
        price: "Freemium",
        labels: [
          createPricingLabel("Freemium"),
          LABEL_CONFIGS.category.audio,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.trending
        ],
        gradient: "from-purple-500/20 to-green-500/20"
      },
      {
        name: "TaskFlow AI",
        description: "Intelligent task management and scheduling. Optimize your workflow with AI-powered insights.",
        category: "Calendars & Productivity",
        rating: 4.7,
        users: "1.3M",
        price: "Free",
        labels: [
          createPricingLabel("Free"),
          LABEL_CONFIGS.category.productivity,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.popular
        ],
        gradient: "from-orange-500/20 to-yellow-500/20"
      },
      {
        name: "SmartScheduler",
        description: "AI calendar assistant that finds optimal meeting times and manages your schedule automatically.",
        category: "Calendars & Productivity",
        rating: 4.6,
        users: "980K",
        price: "$12/mo",
        labels: [
          createPricingLabel("$12/mo"),
          LABEL_CONFIGS.category.productivity,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.featured
        ],
        gradient: "from-orange-500/20 to-blue-500/20"
      },
      {
        name: "ProductivityPlus",
        description: "All-in-one productivity suite with AI automation. Streamline tasks, notes, and project management.",
        category: "Calendars & Productivity",
        rating: 4.8,
        users: "1.6M",
        price: "Freemium",
        labels: [
          createPricingLabel("Freemium"),
          LABEL_CONFIGS.category.productivity,
          LABEL_CONFIGS.capability.assistant,
          LABEL_CONFIGS.status.new
        ],
        gradient: "from-orange-500/20 to-pink-500/20"
      }
    ];

    return allTools.filter(tool => tool.category === category.title);
  };

  const tools = getToolsForCategory();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>

          {/* Category Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className={`p-6 rounded-2xl ${category.gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-30`}>
              <div className="text-foreground w-12 h-12">
                {category.icon}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl">{category.title}</h1>
                <Badge variant="secondary" className="text-sm">
                  {tools.length} tools
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl">
                {category.description}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                All Filters
              </Button>
              <Button variant="ghost" size="sm">Most Popular</Button>
              <Button variant="ghost" size="sm">Highest Rated</Button>
              <Button variant="ghost" size="sm">Free</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Card 
              key={index} 
              onClick={() => onViewTool?.(tool)}
              className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              
              <CardContent className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {tool.category}
                  </Badge>
                </div>

                <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{tool.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{tool.users}</span>
                    </div>
                  </div>
                </div>

                {/* Tool Labels */}
                <ToolLabels labels={tool.labels} maxLabels={3} className="mb-0" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no tools) */}
        {tools.length === 0 && (
          <div className="text-center py-24">
            <div className="text-muted-foreground mb-4 text-6xl">🔍</div>
            <h3 className="text-2xl mb-2">No tools found</h3>
            <p className="text-muted-foreground">
              Check back soon for new additions to this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
