import { PrismaClient, PlanType } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.tool.deleteMany();
  await prisma.category.deleteMany();

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

  // Seed Tools
  const tools = [
    // Writing & Content
    {
      name: 'ChatGPT',
      description: 'Advanced AI chatbot for conversations, writing, and problem-solving',
      url: 'https://chat.openai.com',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categoryId: categories[0].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Jasper AI',
      description: 'AI copywriting assistant for marketing content and blog posts',
      url: 'https://jasper.ai',
      imageUrl: 'https://www.jasper.ai/favicon.ico',
      categoryId: categories[0].id,
      planType: PlanType.PAID,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Copy.ai',
      description: 'Generate marketing copy and content in seconds',
      url: 'https://copy.ai',
      imageUrl: 'https://www.copy.ai/favicon.ico',
      categoryId: categories[0].id,
      planType: PlanType.FREEMIUM,
      isTrending: false,
      isNew: false,
    },

    // Image Generation
    {
      name: 'Midjourney',
      description: 'Create stunning AI-generated artwork and images',
      url: 'https://midjourney.com',
      imageUrl: 'https://www.midjourney.com/favicon.ico',
      categoryId: categories[1].id,
      planType: PlanType.PAID,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'DALL-E 3',
      description: 'OpenAI\'s powerful image generation model',
      url: 'https://openai.com/dall-e-3',
      imageUrl: 'https://openai.com/favicon.ico',
      categoryId: categories[1].id,
      planType: PlanType.PAID,
      isTrending: true,
      isNew: true,
    },
    {
      name: 'Stable Diffusion',
      description: 'Open-source AI image generation model',
      url: 'https://stability.ai',
      imageUrl: 'https://stability.ai/favicon.ico',
      categoryId: categories[1].id,
      planType: PlanType.FREE,
      isTrending: false,
      isNew: false,
    },

    // Video & Animation
    {
      name: 'Runway ML',
      description: 'AI-powered video editing and generation platform',
      url: 'https://runwayml.com',
      imageUrl: 'https://runwayml.com/favicon.ico',
      categoryId: categories[2].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Synthesia',
      description: 'Create AI videos with digital avatars',
      url: 'https://synthesia.io',
      imageUrl: 'https://www.synthesia.io/favicon.ico',
      categoryId: categories[2].id,
      planType: PlanType.PAID,
      isTrending: false,
      isNew: false,
    },

    // Code & Development
    {
      name: 'GitHub Copilot',
      description: 'AI pair programmer that helps you write code faster',
      url: 'https://github.com/features/copilot',
      imageUrl: 'https://github.githubassets.com/favicons/favicon.svg',
      categoryId: categories[3].id,
      planType: PlanType.PAID,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Cursor',
      description: 'AI-first code editor built for productivity',
      url: 'https://cursor.sh',
      imageUrl: 'https://cursor.sh/favicon.ico',
      categoryId: categories[3].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: true,
    },
    {
      name: 'Tabnine',
      description: 'AI code completion for all major IDEs',
      url: 'https://tabnine.com',
      imageUrl: 'https://www.tabnine.com/favicon.ico',
      categoryId: categories[3].id,
      planType: PlanType.FREEMIUM,
      isTrending: false,
      isNew: false,
    },

    // Audio & Music
    {
      name: 'ElevenLabs',
      description: 'AI voice generation and text-to-speech',
      url: 'https://elevenlabs.io',
      imageUrl: 'https://elevenlabs.io/favicon.ico',
      categoryId: categories[4].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Mubert',
      description: 'AI-generated royalty-free music',
      url: 'https://mubert.com',
      imageUrl: 'https://mubert.com/favicon.ico',
      categoryId: categories[4].id,
      planType: PlanType.FREEMIUM,
      isTrending: false,
      isNew: false,
    },

    // Business & Productivity
    {
      name: 'Notion AI',
      description: 'AI-powered writing assistant integrated with Notion',
      url: 'https://notion.so/product/ai',
      imageUrl: 'https://www.notion.so/images/favicon.ico',
      categoryId: categories[5].id,
      planType: PlanType.PAID,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Zapier AI',
      description: 'Automate workflows with AI-powered automation',
      url: 'https://zapier.com',
      imageUrl: 'https://zapier.com/favicon.ico',
      categoryId: categories[5].id,
      planType: PlanType.FREEMIUM,
      isTrending: false,
      isNew: false,
    },

    // Design & Art
    {
      name: 'Canva AI',
      description: 'Design tools powered by AI for everyone',
      url: 'https://canva.com',
      imageUrl: 'https://www.canva.com/favicon.ico',
      categoryId: categories[6].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: false,
    },
    {
      name: 'Figma AI',
      description: 'AI features in collaborative design tool',
      url: 'https://figma.com',
      imageUrl: 'https://www.figma.com/favicon.ico',
      categoryId: categories[6].id,
      planType: PlanType.FREEMIUM,
      isTrending: false,
      isNew: true,
    },

    // Data & Analytics
    {
      name: 'Julius AI',
      description: 'AI data analyst for analyzing and visualizing data',
      url: 'https://julius.ai',
      imageUrl: 'https://julius.ai/favicon.ico',
      categoryId: categories[7].id,
      planType: PlanType.FREEMIUM,
      isTrending: true,
      isNew: true,
    },
    {
      name: 'DataRobot',
      description: 'Enterprise AI platform for automated machine learning',
      url: 'https://datarobot.com',
      imageUrl: 'https://www.datarobot.com/favicon.ico',
      categoryId: categories[7].id,
      planType: PlanType.PAID,
      isTrending: false,
      isNew: false,
    },
  ];

  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }

  console.log(`✅ Created ${tools.length} tools`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
