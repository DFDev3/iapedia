import { CategoryCard } from "./CategoryCard";
import { ImageAIIcon, TextAIIcon, SoundAIIcon, ProductivityIcon } from "./CategoryIcons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  _count: {
    tools: number;
  };
}

interface CategoriesSectionProps {
  onCategoryClick?: (category: any) => void;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "image generation":
    case "generación de imágenes":
      return <ImageAIIcon />;
    case "text generation":
    case "writing assistants":
    case "generación de texto":
      return <TextAIIcon />;
    case "audio tools":
    case "voice synthesis":
    case "herramientas de audio":
      return <SoundAIIcon />;
    case "productivity":
    case "automation tools":
    case "productividad":
      return <ProductivityIcon />;
    default:
      return <ImageAIIcon />;
  }
};

const getCategoryGradient = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "image generation":
    case "generación de imágenes":
      return "bg-gradient-to-r from-primary to-blue-500";
    case "text generation":
    case "writing assistants":
    case "generación de texto":
      return "bg-gradient-to-r from-accent to-green-500";
    case "audio tools":
    case "voice synthesis":
    case "herramientas de audio":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "productivity":
    case "automation tools":
    case "productividad":
      return "bg-gradient-to-r from-orange-500 to-yellow-500";
    default:
      return "bg-gradient-to-r from-indigo-500 to-purple-500";
  }
};

export function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/categories/${category.id}`);
    onCategoryClick?.(category);
  };

  if (loading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground">Cargando categorías...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explora Categorías de IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre herramientas de IA especializadas organizadas por dominio. Cada categoría contiene 
            soluciones cuidadosamente seleccionadas para casos de uso específicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard 
              key={category.id} 
              title={category.name}
              description={category.description}
              count={category._count.tools}
              icon={getCategoryIcon(category.name)}
              gradient={getCategoryGradient(category.name)}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}