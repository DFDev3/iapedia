import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ToolLabels, createPricingLabel, LABEL_CONFIGS} from "../components/ToolLabels";
import { ImageAIIcon, TextAIIcon, SoundAIIcon, ProductivityIcon } from "../components/CategoryIcons";
import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "../components/ui/input";

export function CategoriesPage() {

  // Fallback categories if API fails
  const fallbackCategories = [
    {
      title: "Image AI",
      description: "Transform, generate, and enhance images with cutting-edge AI models",
      count: 127,
      icon: <ImageAIIcon />,
      gradient: "bg-gradient-to-r from-primary to-blue-500",
      tools: [
        { 
          name: "DALL-E 3", 
          price: "Free Trial",
          labels: [
            createPricingLabel("Free Trial"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Midjourney", 
          price: "$10/mo",
          labels: [
            createPricingLabel("$10/mo"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.status.popular
          ]
        },
        { 
          name: "Stable Diffusion", 
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Adobe Firefly", 
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.image,
            LABEL_CONFIGS.category.design
          ]
        }
      ]
    },
    {
      title: "Text AI", 
      description: "Natural language processing, generation, and understanding tools",
      count: 89,
      icon: <TextAIIcon />,
      gradient: "bg-gradient-to-r from-accent to-green-500",
      tools: [
        { 
          name: "GPT-4", 
          price: "$20/mo",
          labels: [
            createPricingLabel("$20/mo"),
            LABEL_CONFIGS.category.text,
            LABEL_CONFIGS.capability.gpt,
            LABEL_CONFIGS.status.popular
          ]
        },
        { 
          name: "Claude", 
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.text,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Gemini", 
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.text,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Llama 2", 
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.text,
            LABEL_CONFIGS.capability.assistant
          ]
        }
      ]
    },
    {
      title: "Sound AI",
      description: "Audio processing, music generation, and voice synthesis",
      count: 45,
      icon: <SoundAIIcon />,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      tools: [
        { 
          name: "ElevenLabs", 
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.audio,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Mubert", 
          price: "$14/mo",
          labels: [
            createPricingLabel("$14/mo"),
            LABEL_CONFIGS.category.audio,
            LABEL_CONFIGS.capability.automation
          ]
        },
        { 
          name: "AIVA", 
          price: "Free Trial",
          labels: [
            createPricingLabel("Free Trial"),
            LABEL_CONFIGS.category.audio,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Speechify", 
          price: "$29/mo",
          labels: [
            createPricingLabel("$29/mo"),
            LABEL_CONFIGS.category.audio,
            LABEL_CONFIGS.category.productivity
          ]
        }
      ]
    },
    {
      title: "Calendars & Productivity",
      description: "AI-powered productivity tools and workflow optimization",
      count: 63,
      icon: <ProductivityIcon />,
      gradient: "bg-gradient-to-r from-orange-500 to-yellow-500",
      tools: [
        { 
          name: "Motion", 
          price: "$34/mo",
          labels: [
            createPricingLabel("$34/mo"),
            LABEL_CONFIGS.category.productivity,
            LABEL_CONFIGS.capability.automation
          ]
        },
        { 
          name: "Reclaim.ai", 
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.productivity,
            LABEL_CONFIGS.capability.automation
          ]
        },
        { 
          name: "Clockify", 
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.productivity,
            LABEL_CONFIGS.capability.automation
          ]
        },
        { 
          name: "Notion AI", 
          price: "$10/mo",
          labels: [
            createPricingLabel("$10/mo"),
            LABEL_CONFIGS.category.productivity,
            LABEL_CONFIGS.capability.assistant
          ]
        }
      ]
    },
    {
      title: "Code AI",
      description: "Programming assistance, code generation, and debugging tools",
      count: 78,
      icon: <TextAIIcon />,
      gradient: "bg-gradient-to-r from-blue-600 to-cyan-500",
      tools: [
        { 
          name: "GitHub Copilot", 
          price: "$10/mo",
          labels: [
            createPricingLabel("$10/mo"),
            LABEL_CONFIGS.category.code,
            LABEL_CONFIGS.capability.assistant,
            LABEL_CONFIGS.status.popular
          ]
        },
        { 
          name: "Cursor", 
          price: "$20/mo",
          labels: [
            createPricingLabel("$20/mo"),
            LABEL_CONFIGS.category.code,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "CodeT5", 
          price: "Free",
          labels: [
            createPricingLabel("Free"),
            LABEL_CONFIGS.category.code,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Replit AI", 
          price: "Free Trial",
          labels: [
            createPricingLabel("Free Trial"),
            LABEL_CONFIGS.category.code,
            LABEL_CONFIGS.capability.assistant
          ]
        }
      ]
    },
    {
      title: "Video AI",
      description: "Video editing, generation, and enhancement with AI",
      count: 34,
      icon: <ImageAIIcon />,
      gradient: "bg-gradient-to-r from-red-500 to-pink-600",
      tools: [
        { 
          name: "RunwayML", 
          price: "$15/mo",
          labels: [
            createPricingLabel("$15/mo"),
            LABEL_CONFIGS.category.video,
            LABEL_CONFIGS.capability.assistant
          ]
        },
        { 
          name: "Synthesia", 
          price: "$30/mo",
          labels: [
            createPricingLabel("$30/mo"),
            LABEL_CONFIGS.category.video,
            LABEL_CONFIGS.capability.marketing
          ]
        },
        { 
          name: "Descript", 
          price: "Freemium",
          labels: [
            createPricingLabel("Freemium"),
            LABEL_CONFIGS.category.video,
            LABEL_CONFIGS.category.audio
          ]
        },
        { 
          name: "Luma AI", 
          price: "Free Trial",
          labels: [
            createPricingLabel("Free Trial"),
            LABEL_CONFIGS.category.video,
            LABEL_CONFIGS.capability.assistant
          ]
        }
      ]
    }
  ];

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6">AI Categories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore our comprehensive collection of AI tools organized by category. 
            Find the perfect solution for your specific needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search categories or tools..." 
              className="pl-12 h-12 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="lg">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fallbackCategories.map((category, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${category.gradient}`}></div>
              
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-xl ${category.gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-20 group-hover:opacity-30 transition-opacity`}>
                    <div className="text-foreground">
                      {category.icon}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} tools
                  </Badge>
                </div>

                <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Featured Tools */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Popular tools:</p>
                  <div className="space-y-3">
                    {category.tools.slice(0, 3).map((tool, toolIndex) => (
                      <div key={toolIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{tool.name}</span>
                        </div>
                        <ToolLabels labels={tool.labels} maxLabels={3} />
                      </div>
                    ))}
                    {category.tools.length > 3 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        +{category.tools.length - 3} more tools
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Explore Category
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}