import { Badge } from "./ui/badge";
import { Crown, Gift, DollarSign, Clock } from "lucide-react";

interface PricingLabelProps {
  price: string;
  className?: string;
}

export function PricingLabel({ price, className = "" }: PricingLabelProps) {
  const getPricingInfo = (price: string) => {
    const lowerPrice = price.toLowerCase();
    
    if (lowerPrice === "free") {
      return {
        label: "Free",
        variant: "secondary" as const,
        icon: <Gift className="w-3 h-3" />,
        className: "bg-green-500/20 text-green-400 border-green-500/30"
      };
    }
    
    if (lowerPrice.includes("trial") || lowerPrice.includes("freemium")) {
      return {
        label: "Free Trial",
        variant: "outline" as const,
        icon: <Clock className="w-3 h-3" />,
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
      };
    }
    
    if (lowerPrice.includes("/mo") || lowerPrice.includes("/month")) {
      return {
        label: "Paid Plan",
        variant: "outline" as const,
        icon: <DollarSign className="w-3 h-3" />,
        className: "bg-orange-500/20 text-orange-400 border-orange-500/30"
      };
    }
    
    if (lowerPrice.includes("premium") || lowerPrice.includes("pro") || parseFloat(price.replace(/[^0-9.]/g, '')) > 50) {
      return {
        label: "Premium",
        variant: "outline" as const,
        icon: <Crown className="w-3 h-3" />,
        className: "bg-purple-500/20 text-purple-400 border-purple-500/30"
      };
    }
    
    // Default for other paid plans
    return {
      label: "Paid",
      variant: "outline" as const,
      icon: <DollarSign className="w-3 h-3" />,
      className: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    };
  };

  const pricingInfo = getPricingInfo(price);

  return (
    <Badge 
      variant={pricingInfo.variant}
      className={`text-xs flex items-center gap-1 ${pricingInfo.className} ${className}`}
    >
      {pricingInfo.icon}
      {pricingInfo.label}
    </Badge>
  );
}