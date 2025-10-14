import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
}

export function CategoryCard({ title, description, count, icon, gradient }: CategoryCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer">
      <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`}></div>
      
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-xl ${gradient.replace('bg-gradient-to-r', 'bg-gradient-to-br')} opacity-20 group-hover:opacity-30 transition-opacity`}>
            <div className="text-foreground">
              {icon}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {count} tools
          </Badge>
        </div>

        <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center text-primary group-hover:text-accent transition-colors">
          <span className="mr-2">Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}