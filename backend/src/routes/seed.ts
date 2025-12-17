import { Router } from 'express';
import { PrismaClient, PlanType, LabelCategory, UserRole } from '../generated/prisma/client.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/run', async (req, res) => {
  try {
    console.log('🌱 Starting seed with labels via API...');

    // Clear existing data in correct order (respecting foreign keys)
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.toolLabel.deleteMany();
    await prisma.tool.deleteMany();
    await prisma.label.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Reset auto-increment sequences in PostgreSQL
    console.log('Resetting ID sequences...');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "User_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Category_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Tool_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Label_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "ToolLabel_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Review_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Favorite_id_seq" RESTART WITH 1');
    console.log('✅ Sequences reset');

    // Seed Users
    console.log('Creating users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'ddiaz216@unab.edu.co',
          name: 'Admin User',
          password: 'Admin123', // In production, this should be hashed
          role: UserRole.ADMIN,
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
          bio: 'System administrator with full access to all features.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          password: 'password123', // In production, this should be hashed
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          bio: 'AI enthusiast and tech blogger. Love exploring new tools and sharing insights.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          bio: 'Product designer passionate about AI-powered design tools. Always testing the latest apps.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'alex.johnson@example.com',
          name: 'Alex Johnson',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          bio: 'Full-stack developer and AI researcher. Building the future with machine learning.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'demo@iapedia.com',
          name: 'Demo User',
          password: 'demo123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          bio: 'Demo account for testing purposes. Feel free to explore!',
        },
      }),
      prisma.user.create({
        data: {
          email: 'maria.garcia@example.com',
          name: 'Maria Garcia',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
          bio: 'Content creator and digital marketer. Obsessed with AI writing tools.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'david.chen@example.com',
          name: 'David Chen',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
          bio: 'Data scientist exploring AI analytics platforms. Always on the hunt for better tools.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'sarah.wilson@example.com',
          name: 'Sarah Wilson',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          bio: 'Video editor and animator. Testing every AI video tool I can find.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'michael.brown@example.com',
          name: 'Michael Brown',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
          bio: 'Entrepreneur and productivity enthusiast. Automating everything with AI.',
        },
      }),
      prisma.user.create({
        data: {
          email: 'emily.davis@example.com',
          name: 'Emily Davis',
          password: 'password123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
          bio: 'Graphic designer and digital artist. AI art tools are my playground.',
        },
      }),
    ]);
    console.log(`✅ Created ${users.length} users`);

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
    const createdTools = [];
    for (const { tool, labelSlugs } of toolsData) {
      // Add random initial view count between 200-300
      const viewCount = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      
      const createdTool = await prisma.tool.create({ 
        data: {
          ...tool,
          viewCount
        }
      });
      
      createdTools.push(createdTool);
      
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

    // Seed Reviews - Each user creates 6-8 reviews on different tools
    console.log('Creating reviews...');
    const reviewsData = [
      // John Doe's reviews
      { userId: users[1].id, toolId: createdTools[0]!.id, rating: 5, content: 'ChatGPT is absolutely amazing! It has revolutionized how I write content and solve problems.' },
      { userId: users[1].id, toolId: createdTools[3]!.id, rating: 5, content: 'Midjourney creates stunning artwork. The quality is unmatched!' },
      { userId: users[1].id, toolId: createdTools[8]!.id, rating: 4, content: 'GitHub Copilot has made me so much more productive. A must-have for developers.' },
      { userId: users[1].id, toolId: createdTools[11]!.id, rating: 5, content: 'ElevenLabs voice quality is incredible. Best text-to-speech I\'ve tried.' },
      { userId: users[1].id, toolId: createdTools[14]!.id, rating: 4, content: 'Canva AI makes design accessible to everyone. Great for quick graphics.' },
      { userId: users[1].id, toolId: createdTools[16]!.id, rating: 4, content: 'Julius AI helps me analyze data quickly. Very intuitive interface.' },
      
      // Jane Smith's reviews
      { userId: users[2].id, toolId: createdTools[1]!.id, rating: 4, content: 'Jasper AI is great for marketing copy. Saves me hours every week.' },
      { userId: users[2].id, toolId: createdTools[4]!.id, rating: 5, content: 'DALL-E 3 is mind-blowing! The images are so realistic and creative.' },
      { userId: users[2].id, toolId: createdTools[6]!.id, rating: 4, content: 'Runway ML is powerful but has a learning curve. Great results though.' },
      { userId: users[2].id, toolId: createdTools[14]!.id, rating: 5, content: 'Canva AI is my go-to for all design work. Can\'t live without it!' },
      { userId: users[2].id, toolId: createdTools[15]!.id, rating: 4, content: 'Figma AI features are impressive. Speeds up my design workflow.' },
      { userId: users[2].id, toolId: createdTools[12]!.id, rating: 5, content: 'Notion AI is perfect for organizing my thoughts and projects.' },
      { userId: users[2].id, toolId: createdTools[2]!.id, rating: 3, content: 'Copy.ai is decent but sometimes needs tweaking. Good for ideas though.' },
      
      // Alex Johnson's reviews
      { userId: users[3].id, toolId: createdTools[8]!.id, rating: 5, content: 'GitHub Copilot is a game changer. Best coding assistant by far.' },
      { userId: users[3].id, toolId: createdTools[9]!.id, rating: 5, content: 'Cursor is incredible! The AI integration is seamless and intuitive.' },
      { userId: users[3].id, toolId: createdTools[10]!.id, rating: 4, content: 'Tabnine works well across all my IDEs. Reliable code completion.' },
      { userId: users[3].id, toolId: createdTools[0]!.id, rating: 5, content: 'ChatGPT helps me debug and learn new concepts. Essential tool.' },
      { userId: users[3].id, toolId: createdTools[17]!.id, rating: 4, content: 'DataRobot is powerful for ML projects. Great for automation.' },
      { userId: users[3].id, toolId: createdTools[13]!.id, rating: 4, content: 'Zapier AI automates my workflow perfectly. Saves so much time.' },
      
      // Demo User's reviews
      { userId: users[4].id, toolId: createdTools[5]!.id, rating: 4, content: 'Stable Diffusion is impressive and free! Open source at its best.' },
      { userId: users[4].id, toolId: createdTools[7]!.id, rating: 3, content: 'Synthesia is interesting but expensive. Good for business videos.' },
      { userId: users[4].id, toolId: createdTools[12]!.id, rating: 5, content: 'Notion AI integrates perfectly with my workflow. Love it!' },
      { userId: users[4].id, toolId: createdTools[3]!.id, rating: 5, content: 'Midjourney is worth every penny. Creating art has never been easier.' },
      { userId: users[4].id, toolId: createdTools[11]!.id, rating: 4, content: 'ElevenLabs voices sound so natural. Great for content creation.' },
      { userId: users[4].id, toolId: createdTools[1]!.id, rating: 4, content: 'Jasper AI helps with writer\'s block. Good content suggestions.' },
      
      // Maria Garcia's reviews
      { userId: users[5].id, toolId: createdTools[0]!.id, rating: 5, content: 'ChatGPT is my daily assistant. From emails to blog posts, it does it all!' },
      { userId: users[5].id, toolId: createdTools[1]!.id, rating: 5, content: 'Jasper AI is a content creator\'s dream. Amazing marketing copy!' },
      { userId: users[5].id, toolId: createdTools[2]!.id, rating: 4, content: 'Copy.ai is great for quick social media posts. Very handy!' },
      { userId: users[5].id, toolId: createdTools[14]!.id, rating: 5, content: 'Canva AI helps me create stunning graphics for my content.' },
      { userId: users[5].id, toolId: createdTools[12]!.id, rating: 4, content: 'Notion AI keeps my content calendar organized and generates ideas.' },
      { userId: users[5].id, toolId: createdTools[11]!.id, rating: 5, content: 'ElevenLabs is perfect for voiceovers. My videos sound professional!' },
      { userId: users[5].id, toolId: createdTools[4]!.id, rating: 4, content: 'DALL-E 3 creates unique images for my blog posts. Love it!' },
      
      // David Chen's reviews
      { userId: users[6].id, toolId: createdTools[16]!.id, rating: 5, content: 'Julius AI makes data analysis so easy. Natural language queries work perfectly!' },
      { userId: users[6].id, toolId: createdTools[17]!.id, rating: 5, content: 'DataRobot is enterprise-grade ML platform. Excellent for complex models.' },
      { userId: users[6].id, toolId: createdTools[0]!.id, rating: 4, content: 'ChatGPT helps me understand complex data patterns and write scripts.' },
      { userId: users[6].id, toolId: createdTools[8]!.id, rating: 4, content: 'GitHub Copilot speeds up my Python data analysis scripts.' },
      { userId: users[6].id, toolId: createdTools[13]!.id, rating: 5, content: 'Zapier AI automates my data pipelines flawlessly. Set and forget!' },
      { userId: users[6].id, toolId: createdTools[12]!.id, rating: 4, content: 'Notion AI helps me document my analysis and findings efficiently.' },
      { userId: users[6].id, toolId: createdTools[9]!.id, rating: 5, content: 'Cursor is amazing for data science work. The AI understands context!' },
      
      // Sarah Wilson's reviews
      { userId: users[7].id, toolId: createdTools[6]!.id, rating: 5, content: 'Runway ML is the future of video editing. AI features are incredible!' },
      { userId: users[7].id, toolId: createdTools[7]!.id, rating: 4, content: 'Synthesia saves me time on client videos. Avatar quality is impressive.' },
      { userId: users[7].id, toolId: createdTools[4]!.id, rating: 5, content: 'DALL-E 3 creates perfect thumbnails for my videos. So convenient!' },
      { userId: users[7].id, toolId: createdTools[3]!.id, rating: 5, content: 'Midjourney is essential for concept art and storyboards. Love it!' },
      { userId: users[7].id, toolId: createdTools[11]!.id, rating: 5, content: 'ElevenLabs provides professional voiceovers for all my videos.' },
      { userId: users[7].id, toolId: createdTools[14]!.id, rating: 4, content: 'Canva AI helps with quick video graphics and social media posts.' },
      { userId: users[7].id, toolId: createdTools[12]!.id, rating: 4, content: 'Notion AI keeps my video projects organized. Great for planning!' },
      
      // Michael Brown's reviews
      { userId: users[8].id, toolId: createdTools[13]!.id, rating: 5, content: 'Zapier AI is the backbone of my business automation. Incredible!' },
      { userId: users[8].id, toolId: createdTools[12]!.id, rating: 5, content: 'Notion AI is my second brain. Manages everything perfectly!' },
      { userId: users[8].id, toolId: createdTools[0]!.id, rating: 5, content: 'ChatGPT handles customer support, emails, and more. Essential!' },
      { userId: users[8].id, toolId: createdTools[1]!.id, rating: 4, content: 'Jasper AI writes marketing content faster than my team. Impressive!' },
      { userId: users[8].id, toolId: createdTools[14]!.id, rating: 4, content: 'Canva AI creates professional designs without hiring a designer.' },
      { userId: users[8].id, toolId: createdTools[8]!.id, rating: 4, content: 'GitHub Copilot helps my dev team ship features faster.' },
      { userId: users[8].id, toolId: createdTools[16]!.id, rating: 5, content: 'Julius AI analyzes business metrics beautifully. Great insights!' },
      
      // Emily Davis's reviews
      { userId: users[9].id, toolId: createdTools[14]!.id, rating: 5, content: 'Canva AI is my daily design tool. Fast, easy, and beautiful results!' },
      { userId: users[9].id, toolId: createdTools[15]!.id, rating: 5, content: 'Figma AI features enhance my design workflow significantly.' },
      { userId: users[9].id, toolId: createdTools[3]!.id, rating: 5, content: 'Midjourney creates stunning art pieces. My clients love the results!' },
      { userId: users[9].id, toolId: createdTools[4]!.id, rating: 5, content: 'DALL-E 3 helps me iterate on design concepts super quickly.' },
      { userId: users[9].id, toolId: createdTools[5]!.id, rating: 4, content: 'Stable Diffusion is powerful and free. Great for experimentation!' },
      { userId: users[9].id, toolId: createdTools[0]!.id, rating: 4, content: 'ChatGPT helps me brainstorm design concepts and write proposals.' },
      { userId: users[9].id, toolId: createdTools[6]!.id, rating: 4, content: 'Runway ML adds motion to my designs. Animation made easy!' },
    ];

    for (const review of reviewsData) {
      await prisma.review.create({ data: review });
    }

    console.log(`✅ Created ${reviewsData.length} reviews`);
    console.log('🎉 Seed with labels completed successfully!');

    res.json({ 
      success: true, 
      message: 'Database seeded successfully with labels',
      stats: {
        users: users.length,
        labels: labels.length,
        categories: categories.length,
        tools: toolsData.length,
        reviews: reviewsData.length
      }
    });
  } catch (error) {
    console.error('❌ Seed failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Seed failed',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
