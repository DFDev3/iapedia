import { PrismaClient, PlanType, LabelCategory } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed with labels...');

  // Clear existing data
  await prisma.toolLabel.deleteMany();
  await prisma.label.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.category.deleteMany();

  // Seed Labels
  console.log('Creating labels...');
  const labels = await Promise.all([
    // PRICING labels
    prisma.label.create({
      data: {
        name: 'Free',
        slug: 'free',
        category: LabelCategory.PRICING,
        color: '#10b981',
        description: 'Completely free to use',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Free Trial',
        slug: 'free-trial',
        category: LabelCategory.PRICING,
        color: '#3b82f6',
        description: 'Limited free trial available',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Freemium',
        slug: 'freemium',
        category: LabelCategory.PRICING,
        color: '#8b5cf6',
        description: 'Free tier with paid upgrades',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Paid',
        slug: 'paid',
        category: LabelCategory.PRICING,
        color: '#f59e0b',
        description: 'Paid subscription required',
      },
    }),

    // CAPABILITY labels
    prisma.label.create({
      data: {
        name: 'AI Assistant',
        slug: 'ai-assistant',
        category: LabelCategory.CAPABILITY,
        color: '#6366f1',
        description: 'Interactive AI assistant',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Automation',
        slug: 'automation',
        category: LabelCategory.CAPABILITY,
        color: '#ec4899',
        description: 'Workflow automation',
      },
    }),
    prisma.label.create({
      data: {
        name: 'API Available',
        slug: 'api-available',
        category: LabelCategory.CAPABILITY,
        color: '#14b8a6',
        description: 'Provides API access',
      },
    }),
    prisma.label.create({
      data: {
        name: 'No Code',
        slug: 'no-code',
        category: LabelCategory.CAPABILITY,
        color: '#f97316',
        description: 'No coding required',
      },
    }),
    prisma.label.create({
      data: {
        name: 'GPT Powered',
        slug: 'gpt-powered',
        category: LabelCategory.CAPABILITY,
        color: '#8b5cf6',
        description: 'Uses GPT models',
      },
    }),

    // STATUS labels
    prisma.label.create({
      data: {
        name: 'Popular',
        slug: 'popular',
        category: LabelCategory.STATUS,
        color: '#ef4444',
        description: 'Highly popular tool',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Trending',
        slug: 'trending',
        category: LabelCategory.STATUS,
        color: '#f59e0b',
        description: 'Currently trending',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Featured',
        slug: 'featured',
        category: LabelCategory.STATUS,
        color: '#eab308',
        description: 'Featured by editors',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Community Favorite',
        slug: 'community-favorite',
        category: LabelCategory.STATUS,
        color: '#06b6d4',
        description: 'Loved by the community',
      },
    }),

    // SPECIALTY labels
    prisma.label.create({
      data: {
        name: 'Text Generation',
        slug: 'text-generation',
        category: LabelCategory.SPECIALTY,
        color: '#3b82f6',
        description: 'Generates text content',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Image Generation',
        slug: 'image-generation',
        category: LabelCategory.SPECIALTY,
        color: '#a855f7',
        description: 'Creates images',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Video Editing',
        slug: 'video-editing',
        category: LabelCategory.SPECIALTY,
        color: '#ec4899',
        description: 'Video creation and editing',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Audio Processing',
        slug: 'audio-processing',
        category: LabelCategory.SPECIALTY,
        color: '#14b8a6',
        description: 'Audio and music tools',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Code Assistant',
        slug: 'code-assistant',
        category: LabelCategory.SPECIALTY,
        color: '#10b981',
        description: 'Helps with coding',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Design Tool',
        slug: 'design-tool',
        category: LabelCategory.SPECIALTY,
        color: '#f59e0b',
        description: 'Design and creative work',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Data Analysis',
        slug: 'data-analysis',
        category: LabelCategory.SPECIALTY,
        color: '#6366f1',
        description: 'Analyzes and visualizes data',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Productivity',
        slug: 'productivity',
        category: LabelCategory.SPECIALTY,
        color: '#f97316',
        description: 'Boosts productivity',
      },
    }),
  ]);

  console.log(`✅ Created ${labels.length} labels`);

  // Helper function to get labels by slug
  const getLabelsBySlug = (...slugs: string[]) => {
    return labels.filter(label => slugs.includes(label.slug)).map(l => l.id);
  };

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Writing & Content',
        description: 'AI tools for writing and content creation',
        fullDescription: 'Descubre herramientas de IA para redacción, copywriting, creación de contenido y asistencia editorial. Desde chatbots avanzados hasta asistentes de marketing, estas herramientas potencian tu creatividad y productividad en la escritura.',
        iconUrl: 'https://api.iconify.design/mdi:pencil.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Image Generation',
        description: 'Create stunning images with AI',
        fullDescription: 'Explora las mejores herramientas de generación de imágenes con IA. Desde arte conceptual hasta fotografía realista, estas plataformas transforman tus ideas en visuales impresionantes con solo descripciones de texto.',
        iconUrl: 'https://api.iconify.design/mdi:image.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Video & Animation',
        description: 'AI-powered video editing and animation',
        fullDescription: 'Herramientas de IA para edición de video, animación y creación de contenido audiovisual. Crea videos profesionales con avatares digitales, edita con asistencia inteligente y genera animaciones de forma automática.',
        iconUrl: 'https://api.iconify.design/mdi:video.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Code & Development',
        description: 'AI assistants for coding',
        fullDescription: 'Asistentes de IA para programación y desarrollo de software. Estas herramientas te ayudan a escribir código más rápido, detectar bugs, generar documentación y aprender nuevas tecnologías con sugerencias inteligentes en tiempo real.',
        iconUrl: 'https://api.iconify.design/mdi:code-tags.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Audio & Music',
        description: 'Generate music and voices with AI',
        fullDescription: 'Herramientas de IA para generación de música, síntesis de voz y edición de audio. Crea música original, clona voces, genera efectos de sonido y produce contenido de audio profesional sin experiencia musical previa.',
        iconUrl: 'https://api.iconify.design/mdi:music.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business & Productivity',
        description: 'Boost your workflow with AI',
        fullDescription: 'Optimiza tu flujo de trabajo con herramientas de IA para productividad empresarial. Automatiza tareas repetitivas, gestiona proyectos de manera inteligente, analiza datos y mejora la colaboración con tu equipo.',
        iconUrl: 'https://api.iconify.design/mdi:briefcase.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design & Art',
        description: 'Tools for designers and artists',
        fullDescription: 'Herramientas de diseño potenciadas por IA para creativos y artistas digitales. Crea diseños profesionales, genera paletas de colores, edita imágenes de forma inteligente y lleva tus proyectos visuales al siguiente nivel.',
        iconUrl: 'https://api.iconify.design/mdi:palette.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Data & Analytics',
        description: 'Analyze data with AI',
        fullDescription: 'Plataformas de IA para análisis de datos y visualización. Transforma datos complejos en insights accionables, crea dashboards automáticos, predice tendencias y toma decisiones informadas con machine learning.',
        iconUrl: 'https://api.iconify.design/mdi:chart-line.svg',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Seed Tools with Labels
  const toolsData = [
    // Writing & Content
    {
      tool: {
        name: 'ChatGPT',
        description: 'Advanced AI chatbot for conversations, writing, and problem-solving',
        url: 'https://chat.openai.com',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        categoryId: categories[0].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['freemium', 'ai-assistant', 'popular', 'text-generation', 'gpt-powered'],
    },
    {
      tool: {
        name: 'Jasper AI',
        description: 'AI copywriting assistant for marketing content and blog posts',
        url: 'https://jasper.ai',
        imageUrl: 'https://www.jasper.ai/favicon.ico',
        categoryId: categories[0].id,
        planType: PlanType.PAID,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['paid', 'ai-assistant', 'text-generation', 'no-code'],
    },
    {
      tool: {
        name: 'Copy.ai',
        description: 'Generate marketing copy and content in seconds',
        url: 'https://copy.ai',
        imageUrl: 'https://www.copy.ai/favicon.ico',
        categoryId: categories[0].id,
        planType: PlanType.FREEMIUM,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['freemium', 'ai-assistant', 'text-generation'],
    },

    // Image Generation
    {
      tool: {
        name: 'Midjourney',
        description: 'Create stunning AI-generated artwork and images',
        url: 'https://midjourney.com',
        imageUrl: 'https://www.midjourney.com/favicon.ico',
        categoryId: categories[1].id,
        planType: PlanType.PAID,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['paid', 'image-generation', 'popular', 'community-favorite'],
    },
    {
      tool: {
        name: 'DALL-E 3',
        description: 'OpenAI\'s powerful image generation model',
        url: 'https://openai.com/dall-e-3',
        imageUrl: 'https://openai.com/favicon.ico',
        categoryId: categories[1].id,
        planType: PlanType.PAID,
        isTrending: true,
        isNew: true,
      },
      labelSlugs: ['paid', 'image-generation', 'featured', 'gpt-powered'],
    },
    {
      tool: {
        name: 'Stable Diffusion',
        description: 'Open-source AI image generation model',
        url: 'https://stability.ai',
        imageUrl: 'https://stability.ai/favicon.ico',
        categoryId: categories[1].id,
        planType: PlanType.FREE,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['free', 'image-generation', 'api-available'],
    },

    // Video & Animation
    {
      tool: {
        name: 'Runway ML',
        description: 'AI-powered video editing and generation platform',
        url: 'https://runwayml.com',
        imageUrl: 'https://runwayml.com/favicon.ico',
        categoryId: categories[2].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['freemium', 'video-editing', 'trending', 'ai-assistant'],
    },
    {
      tool: {
        name: 'Synthesia',
        description: 'Create AI videos with digital avatars',
        url: 'https://synthesia.io',
        imageUrl: 'https://www.synthesia.io/favicon.ico',
        categoryId: categories[2].id,
        planType: PlanType.PAID,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['paid', 'video-editing', 'no-code'],
    },

    // Code & Development
    {
      tool: {
        name: 'GitHub Copilot',
        description: 'AI pair programmer that helps you write code faster',
        url: 'https://github.com/features/copilot',
        imageUrl: 'https://github.githubassets.com/favicons/favicon.svg',
        categoryId: categories[3].id,
        planType: PlanType.PAID,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['paid', 'code-assistant', 'popular', 'ai-assistant', 'api-available'],
    },
    {
      tool: {
        name: 'Cursor',
        description: 'AI-first code editor built for productivity',
        url: 'https://cursor.sh',
        imageUrl: 'https://cursor.sh/favicon.ico',
        categoryId: categories[3].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: true,
      },
      labelSlugs: ['freemium', 'code-assistant', 'trending', 'gpt-powered'],
    },
    {
      tool: {
        name: 'Tabnine',
        description: 'AI code completion for all major IDEs',
        url: 'https://tabnine.com',
        imageUrl: 'https://www.tabnine.com/favicon.ico',
        categoryId: categories[3].id,
        planType: PlanType.FREEMIUM,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['freemium', 'code-assistant', 'ai-assistant'],
    },

    // Audio & Music
    {
      tool: {
        name: 'ElevenLabs',
        description: 'AI voice generation and text-to-speech',
        url: 'https://elevenlabs.io',
        imageUrl: 'https://elevenlabs.io/favicon.ico',
        categoryId: categories[4].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['freemium', 'audio-processing', 'popular', 'api-available'],
    },
    {
      tool: {
        name: 'Mubert',
        description: 'AI-generated royalty-free music',
        url: 'https://mubert.com',
        imageUrl: 'https://mubert.com/favicon.ico',
        categoryId: categories[4].id,
        planType: PlanType.FREEMIUM,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['freemium', 'audio-processing', 'automation'],
    },

    // Business & Productivity
    {
      tool: {
        name: 'Notion AI',
        description: 'AI-powered writing assistant integrated with Notion',
        url: 'https://notion.so/product/ai',
        imageUrl: 'https://www.notion.so/images/favicon.ico',
        categoryId: categories[5].id,
        planType: PlanType.PAID,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['paid', 'productivity', 'ai-assistant', 'popular'],
    },
    {
      tool: {
        name: 'Zapier AI',
        description: 'Automate workflows with AI-powered automation',
        url: 'https://zapier.com',
        imageUrl: 'https://zapier.com/favicon.ico',
        categoryId: categories[5].id,
        planType: PlanType.FREEMIUM,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['freemium', 'automation', 'productivity', 'api-available', 'no-code'],
    },

    // Design & Art
    {
      tool: {
        name: 'Canva AI',
        description: 'Design tools powered by AI for everyone',
        url: 'https://canva.com',
        imageUrl: 'https://www.canva.com/favicon.ico',
        categoryId: categories[6].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: false,
      },
      labelSlugs: ['freemium', 'design-tool', 'no-code', 'community-favorite'],
    },
    {
      tool: {
        name: 'Figma AI',
        description: 'AI features in collaborative design tool',
        url: 'https://figma.com',
        imageUrl: 'https://www.figma.com/favicon.ico',
        categoryId: categories[6].id,
        planType: PlanType.FREEMIUM,
        isTrending: false,
        isNew: true,
      },
      labelSlugs: ['freemium', 'design-tool', 'featured'],
    },

    // Data & Analytics
    {
      tool: {
        name: 'Julius AI',
        description: 'AI data analyst for analyzing and visualizing data',
        url: 'https://julius.ai',
        imageUrl: 'https://julius.ai/favicon.ico',
        categoryId: categories[7].id,
        planType: PlanType.FREEMIUM,
        isTrending: true,
        isNew: true,
      },
      labelSlugs: ['freemium', 'data-analysis', 'trending', 'ai-assistant'],
    },
    {
      tool: {
        name: 'DataRobot',
        description: 'Enterprise AI platform for automated machine learning',
        url: 'https://datarobot.com',
        imageUrl: 'https://www.datarobot.com/favicon.ico',
        categoryId: categories[7].id,
        planType: PlanType.PAID,
        isTrending: false,
        isNew: false,
      },
      labelSlugs: ['paid', 'data-analysis', 'automation', 'api-available'],
    },
  ];

  console.log('Creating tools with labels...');
  for (const { tool, labelSlugs } of toolsData) {
    const createdTool = await prisma.tool.create({ data: tool });
    
    // Create tool-label relationships
    const labelIds = getLabelsBySlug(...labelSlugs);
    await prisma.toolLabel.createMany({
      data: labelIds.map(labelId => ({
        toolId: createdTool.id,
        labelId,
      })),
    });
  }

  console.log(`✅ Created ${toolsData.length} tools with labels`);
  console.log('🎉 Seed with labels completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
