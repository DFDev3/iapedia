import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedSection } from "../components/FeaturedSection";

interface HomePageProps {
  onViewTool?: (tool: any) => void;
}

export function HomePage({ onViewTool }: HomePageProps) {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection onViewTool={onViewTool} />
    </>
  );
}