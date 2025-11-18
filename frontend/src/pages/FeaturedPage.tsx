import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ToolLabels, createPricingLabel, LABEL_CONFIGS} from "../components/ToolLabels";
import { Star, Users, ExternalLink, Zap, TrendingUp, Award } from "lucide-react";

export function FeaturedPage() {

  const featuredSections = [
    {
      title: "Editor's Choice",
      description: "Hand-picked by our AI experts",
      icon: <Award className="w-6 h-6" />,
      tools: [
        {
          name: "Neural Canvas Pro",
          description: "Revolutionary image generation with artistic control that rivals human creativity",
          category: "Image AI",
          rating: 4.9,
          users: "2.3M",
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.capability.assistant,
            LABEL_CONFIGS.status.featured
          ],
          gradient: "from-primary/20 to-blue-500/20"
        },
        {
          name: "LinguaForge Premium",
          description: "Advanced language model that understands context like never before",
          category: "Text AI",
          rating: 4.8,
          users: "1.8M",
          price: "$29/mo",
          labels: [
            createPricingLabel("$29/mo"),
            LABEL_CONFIGS.category.text,
            LABEL_CONFIGS.capability.gpt,
            LABEL_CONFIGS.status.featured
          ],
          gradient: "from-accent/20 to-green-500/20"
        },
        {
          name: "DataViz Master",
          description: "Transform complex data into stunning visualizations with AI-powered insights",
          category: "Analytics AI",
          rating: 4.7,
          users: "945K",
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.analytics,
            LABEL_CONFIGS.capability.automation,
            LABEL_CONFIGS.status.featured
          ],
          gradient: "from-violet-500/20 to-purple-500/20"
        }
      ]
    },
    {
      title: "Trending Now",
      description: "The hottest AI tools this week",
      icon: <TrendingUp className="w-6 h-6" />,
      tools: [
        {
          name: "VoiceClone AI",
          description: "Clone any voice with just 10 seconds of audio sample",
          category: "Sound AI",
          rating: 4.7,
          users: "456K",
          price: "$19/mo",
          labels: [
            createPricingLabel("$19/mo"),
            LABEL_CONFIGS.category.audio,
            LABEL_CONFIGS.status.trending,
            LABEL_CONFIGS.status.new
          ],
          gradient: "from-purple-500/20 to-pink-500/20"
        },
        {
          name: "CodeMentor AI",
          description: "AI pair programmer that writes production-ready code",
          category: "Code AI",
          rating: 4.6,
          users: "892K",
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.code,
            LABEL_CONFIGS.capability.assistant,
            LABEL_CONFIGS.status.trending
          ],
          gradient: "from-blue-600/20 to-cyan-500/20"
        },
        {
          name: "VideoScript AI",
          description: "Generate engaging video scripts and storyboards automatically",
          category: "Video AI",
          rating: 4.5,
          users: "312K",
          price: "Free Trial",
          labels: [
            createPricingLabel("Free Trial"),
            LABEL_CONFIGS.category.video,
            LABEL_CONFIGS.capability.marketing,
            LABEL_CONFIGS.status.trending
          ],
          gradient: "from-red-500/20 to-orange-500/20"
        }
      ]
    },
    {
      title: "Most Innovative",
      description: "Breakthrough AI technologies",
      icon: <Zap className="w-6 h-6" />,
      tools: [
        {
          name: "RealityForge",
          description: "Generate 3D scenes and environments from simple text descriptions",
          category: "3D AI",
          rating: 4.5,
          users: "234K",
          price: "$99/mo",
          labels: [
            createPricingLabel("$99/mo"),
            LABEL_CONFIGS.category.design,
            LABEL_CONFIGS.capability.assistant,
            LABEL_CONFIGS.status.new
          ],
          gradient: "from-indigo-500/20 to-purple-600/20"
        },
        {
          name: "TimeSync AI",
          description: "AI that predicts optimal scheduling across multiple time zones",
          category: "Productivity",
          rating: 4.4,
          users: "167K",
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.productivity,
            LABEL_CONFIGS.capability.automation,
            LABEL_CONFIGS.status.new
          ],
          gradient: "from-orange-500/20 to-yellow-500/20"
        },
        {
          name: "EmotionRead",
          description: "Advanced facial recognition for real-time emotion analysis",
          category: "Recognition AI",
          rating: 4.3,
          users: "89K",
          price: "$35/mo",
          labels: [
            createPricingLabel("$35/mo"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.category.analytics,
            LABEL_CONFIGS.status.new
          ],
          gradient: "from-teal-500/20 to-cyan-500/20"
        }
      ]
    }
  ];

  const FeaturedToolCard = ({ tool }: { tool: any }) => (
    <Card 
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
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {tool.description}
        </p>

        <div className="flex items-center justify-between mb-6">
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
        <ToolLabels labels={tool.labels} maxLabels={4} className="mb-6" />

        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Try Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Featured AI Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the most innovative, popular, and groundbreaking AI tools. 
            These selections represent the cutting edge of artificial intelligence.
          </p>
        </div>

        {/* Featured Sections */}
        <div className="space-y-16">
          {featuredSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.tools.map((tool, toolIndex) => (
                  <FeaturedToolCard key={toolIndex} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get notified about new featured tools and breakthrough AI technologies. 
                Join our community of AI enthusiasts and professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Subscribe to Updates
                </Button>
                <Button size="lg" variant="outline">
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}