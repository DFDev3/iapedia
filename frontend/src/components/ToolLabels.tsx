import { Badge } from "./ui/badge";
import { 
  Crown, Gift, DollarSign, Clock, 
  Wand2, MessageSquare, Mic, Image, 
  Code, Video, BarChart3, Calendar,
  Palette, Zap, Users, Star,
  TrendingUp, Sparkles
} from "lucide-react";

// Types of labels
export type LabelType = 'pricing' | 'category' | 'capability' | 'status' | 'feature';

export interface ToolLabel {
  text: string;
  type: LabelType;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
  icon?: React.ReactNode;
}

interface ToolLabelsProps {
  labels?: ToolLabel[];
  className?: string;
  maxLabels?: number;
}

// Predefined label configurations
export const LABEL_CONFIGS = {
  // Pricing labels
  pricing: {
    free: {
      text: "Free",
      type: 'pricing' as const,
      icon: <Gift className="w-3 h-3" />,
      className: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    freemium: {
      text: "Freemium",
      type: 'pricing' as const,
      icon: <Clock className="w-3 h-3" />,
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    trial: {
      text: "Free Trial",
      type: 'pricing' as const,
      icon: <Clock className="w-3 h-3" />,
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    paid: {
      text: "Paid",
      type: 'pricing' as const,
      icon: <DollarSign className="w-3 h-3" />,
      className: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    },
    premium: {
      text: "Premium",
      type: 'pricing' as const,
      icon: <Crown className="w-3 h-3" />,
      className: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  },
  
  // Category labels
  category: {
    image: {
      text: "Image",
      type: 'category' as const,
      icon: <Image className="w-3 h-3" />,
      className: "bg-pink-500/20 text-pink-400 border-pink-500/30"
    },
    text: {
      text: "Text",
      type: 'category' as const,
      icon: <MessageSquare className="w-3 h-3" />,
      className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    audio: {
      text: "Audio",
      type: 'category' as const,
      icon: <Mic className="w-3 h-3" />,
      className: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    },
    video: {
      text: "Video",
      type: 'category' as const,
      icon: <Video className="w-3 h-3" />,
      className: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    code: {
      text: "Code",
      type: 'category' as const,
      icon: <Code className="w-3 h-3" />,
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    design: {
      text: "Design",
      type: 'category' as const,
      icon: <Palette className="w-3 h-3" />,
      className: "bg-violet-500/20 text-violet-400 border-violet-500/30"
    },
    analytics: {
      text: "Analytics",
      type: 'category' as const,
      icon: <BarChart3 className="w-3 h-3" />,
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    productivity: {
      text: "Productivity",
      type: 'category' as const,
      icon: <Calendar className="w-3 h-3" />,
      className: "bg-teal-500/20 text-teal-400 border-teal-500/30"
    }
  },
  
  // Capability labels
  capability: {
    gpt: {
      text: "GPT",
      type: 'capability' as const,
      className: "bg-primary/20 text-primary border-primary/30"
    },
    assistant: {
      text: "Assistant",
      type: 'capability' as const,
      icon: <Wand2 className="w-3 h-3" />,
      className: "bg-blue-600/20 text-blue-300 border-blue-600/30"
    },
    automation: {
      text: "Automation",
      type: 'capability' as const,
      icon: <Zap className="w-3 h-3" />,
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    },
    social: {
      text: "Social Media",
      type: 'capability' as const,
      icon: <Users className="w-3 h-3" />,
      className: "bg-sky-500/20 text-sky-400 border-sky-500/30"
    },
    marketing: {
      text: "Marketing",
      type: 'capability' as const,
      className: "bg-orange-600/20 text-orange-300 border-orange-600/30"
    }
  },
  
  // Status labels
  status: {
    new: {
      text: "New",
      type: 'status' as const,
      icon: <Sparkles className="w-3 h-3" />,
      className: "bg-accent/20 text-accent border-accent/30"
    },
    trending: {
      text: "Trending",
      type: 'status' as const,
      icon: <TrendingUp className="w-3 h-3" />,
      className: "bg-primary/20 text-primary border-primary/30"
    },
    popular: {
      text: "Popular",
      type: 'status' as const,
      icon: <Star className="w-3 h-3" />,
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    },
    featured: {
      text: "Featured",
      type: 'status' as const,
      icon: <Crown className="w-3 h-3" />,
      className: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  }
};

export function ToolLabels({ labels, className = "", maxLabels }: ToolLabelsProps) {
  // Handle undefined or empty labels
  if (!labels || labels.length === 0) {
    return null;
  }
  
  const displayLabels = maxLabels ? labels.slice(0, maxLabels) : labels;
  const remainingCount = maxLabels && labels.length > maxLabels ? labels.length - maxLabels : 0;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {displayLabels.map((label, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`text-xs flex items-center gap-1 ${label.className || ''}`}
        >
          {label.icon}
          {label.text}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className="text-xs bg-muted/20 text-muted-foreground border-muted/30"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}

// Helper function to create labels from simple arrays
export function createLabelsFromConfig(labelKeys: Array<{key: string, category: keyof typeof LABEL_CONFIGS}>): ToolLabel[] {
  return labelKeys.map(({key, category}) => {
    const config = LABEL_CONFIGS[category][key as keyof typeof LABEL_CONFIGS[typeof category]];
    return config || { text: key, type: category };
  });
}

// Helper function for pricing labels
export function createPricingLabel(price: string): ToolLabel {
  const lowerPrice = price.toLowerCase();
  
  if (lowerPrice === "free") {
    return LABEL_CONFIGS.pricing.free;
  }
  
  if (lowerPrice.includes("trial")) {
    return LABEL_CONFIGS.pricing.trial;
  }
  
  if (lowerPrice.includes("freemium")) {
    return LABEL_CONFIGS.pricing.freemium;
  }
  
  if (lowerPrice.includes("/mo") || lowerPrice.includes("/month")) {
    const amount = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (amount > 50) {
      return LABEL_CONFIGS.pricing.premium;
    }
    return LABEL_CONFIGS.pricing.paid;
  }
  
  return LABEL_CONFIGS.pricing.paid;
}