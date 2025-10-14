import { CategoryCard } from "./CategoryCard";
import { ImageAIIcon, TextAIIcon, SoundAIIcon, ProductivityIcon } from "./CategoryIcons";

export function CategoriesSection() {
  const categories = [
    {
      title: "Image AI",
      description: "Transform, generate, and enhance images with cutting-edge AI models. From style transfer to photorealistic generation.",
      count: 127,
      icon: <ImageAIIcon />,
      gradient: "bg-gradient-to-r from-primary to-blue-500"
    },
    {
      title: "Text AI",
      description: "Natural language processing, generation, and understanding tools. Write, translate, and analyze text with AI.",
      count: 89,
      icon: <TextAIIcon />,
      gradient: "bg-gradient-to-r from-accent to-green-500"
    },
    {
      title: "Sound AI",
      description: "Audio processing, music generation, and voice synthesis. Create, enhance, and transform audio content.",
      count: 45,
      icon: <SoundAIIcon />,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      title: "Calendars & Productivity",
      description: "AI-powered productivity tools, scheduling assistants, and workflow optimization solutions.",
      count: 63,
      icon: <ProductivityIcon />,
      gradient: "bg-gradient-to-r from-orange-500 to-yellow-500"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore AI Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover specialized AI tools organized by domain. Each category contains 
            carefully curated solutions for specific use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}