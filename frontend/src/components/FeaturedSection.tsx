import { Card, CardContent } from "./ui/card"; 
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ToolLabels, createPricingLabel, LABEL_CONFIGS} from "./ToolLabels";
import { Star, ExternalLink, Users } from "lucide-react";

interface FeaturedSectionProps {
  onViewTool?: (tool: any) => void;
}

export function FeaturedSection({ onViewTool }: FeaturedSectionProps) {
  const featuredTools = [
    {
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
      gradient: "from-blue-500/20 to-cyan-500/20",
      banner: "https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBuZXVyYWwlMjBuZXR3b3JrfGVufDF8fHx8MTc2MDAyMjM3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "LinguaForge",
      description: "Next-generation language model for creative writing and analysis",
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
      gradient: "from-green-500/20 to-emerald-500/20",
      banner: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjB0ZXh0JTIwZ2VuZXJhdGlvbnxlbnwxfHx8fDE3NjAwMjIzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "AudioCraft Pro",
      description: "Professional audio generation and enhancement suite",
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
      gradient: "from-yellow-500/20 to-orange-500/20",
      banner: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBhdWRpb3xlbnwxfHx8fDE3NjAwMjIzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

// "from-red-500/20 to-rose-500/20"
// "from-indigo-500/20 to-violet-500/20"
// "from-teal-500/20 to-sky-500/20"
// "from-fuchsia-500/20 to-purple-500/20"
// "from-amber-500/20 to-lime-500/20"
// "from-slate-500/20 to-zinc-500/20"

  return (
    <section className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured AI Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Handpicked tools that represent the cutting edge of AI technology. 
            Trusted by millions of users worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTools.map((tool, index) => (
            <Card
              key={index}
              onClick={() => onViewTool?.(tool)}
              className="group relative overflow-hidden border-border bg-card transition-all duration-300 cursor-pointer"
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
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
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
                <ToolLabels labels={tool.labels} maxLabels={3} className="mb-6" />

                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Try Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            View All Featured Tools
          </Button>
        </div>
      </div>
    </section>
  );
}