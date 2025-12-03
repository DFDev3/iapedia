import { Router } from "express";
const router = Router();

// Navigation data based on current pages
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'categories', label: 'Categories' },
  { id: 'featured', label: 'Featured' },
];

// Static data for pages (since frontend now uses static data)
const tools = [
  { name: "ChatGPT", category: "Text", description: "OpenAI model for NLP tasks" },
  { name: "DALL-E", category: "Image", description: "OpenAI image generator" },
  { name: "Midjourney", category: "Image", description: "AI image generation tool" },
  { name: "Stable Diffusion", category: "Image", description: "Open-source image generation" },
];

const categories = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
];

const featured = [
  {
    title: "Editor's Choice",
    description: "Hand-picked by our AI experts",
    icon: "Award",
    tools: [
      {
        name: "Neural Canvas Pro",
        description: "Revolutionary image generation with artistic control that rivals human creativity",
        category: "Image AI",
        rating: 4.9,
        users: "2.3M",
        price: "Free",
        labels: [
          { type: "pricing", value: "Free" },
          { type: "category", value: "image" },
          { type: "capability", value: "assistant" },
          { type: "status", value: "featured" }
        ],
        gradient: "from-primary/20 to-blue-500/20"
      },
      {
        name: "LinguaForge Premium",
        description: "Advanced language model that understands context like never before",
        category: "Text AI",
        rating: 4.8,
        users: "1.8M",
        price: "$29/mo",
        labels: [
          { type: "pricing", value: "$29/mo" },
          { type: "category", value: "text" },
          { type: "capability", value: "gpt" },
          { type: "status", value: "featured" }
        ],
        gradient: "from-accent/20 to-green-500/20"
      },
      {
        name: "DataViz Master",
        description: "Transform complex data into stunning visualizations with AI-powered insights",
        category: "Analytics AI",
        rating: 4.7,
        users: "945K",
        price: "Freemium",
        labels: [
          { type: "pricing", value: "Freemium" },
          { type: "category", value: "analytics" },
          { type: "capability", value: "automation" },
          { type: "status", value: "featured" }
        ],
        gradient: "from-violet-500/20 to-purple-500/20"
      }
    ]
  },
  {
    title: "Trending Now",
    description: "The hottest AI tools this week",
    icon: "TrendingUp",
    tools: [
      {
        name: "VoiceClone AI",
        description: "Clone any voice with just 10 seconds of audio sample",
        category: "Sound AI",
        rating: 4.7,
        users: "456K",
        price: "$19/mo",
        labels: [
          { type: "pricing", value: "$19/mo" },
          { type: "category", value: "audio" },
          { type: "status", value: "trending" },
          { type: "status", value: "new" }
        ],
        gradient: "from-purple-500/20 to-pink-500/20"
      },
      {
        name: "CodeMentor AI",
        description: "AI pair programmer that writes production-ready code",
        category: "Code AI",
        rating: 4.6,
        users: "892K",
        price: "Free",
        labels: [
          { type: "pricing", value: "Free" },
          { type: "category", value: "code" },
          { type: "capability", value: "assistant" },
          { type: "status", value: "trending" }
        ],
        gradient: "from-blue-600/20 to-cyan-500/20"
      },
      {
        name: "VideoScript AI",
        description: "Generate engaging video scripts and storyboards automatically",
        category: "Video AI",
        rating: 4.5,
        users: "312K",
        price: "Free Trial",
        labels: [
          { type: "pricing", value: "Free Trial" },
          { type: "category", value: "video" },
          { type: "capability", value: "marketing" },
          { type: "status", value: "trending" }
        ],
        gradient: "from-red-500/20 to-orange-500/20"
      }
    ]
  },
  {
    title: "Most Innovative",
    description: "Breakthrough AI technologies",
    icon: "Zap",
    tools: [
      {
        name: "RealityForge",
        description: "Generate 3D scenes and environments from simple text descriptions",
        category: "3D AI",
        rating: 4.5,
        users: "234K",
        price: "$99/mo",
        labels: [
          { type: "pricing", value: "$99/mo" },
          { type: "category", value: "design" },
          { type: "capability", value: "assistant" },
          { type: "status", value: "new" }
        ],
        gradient: "from-indigo-500/20 to-purple-600/20"
      },
      {
        name: "TimeSync AI",
        description: "AI that predicts optimal scheduling across multiple time zones",
        category: "Productivity",
        rating: 4.4,
        users: "167K",
        price: "Freemium",
        labels: [
          { type: "pricing", value: "Freemium" },
          { type: "category", value: "productivity" },
          { type: "capability", value: "automation" },
          { type: "status", value: "new" }
        ],
        gradient: "from-orange-500/20 to-yellow-500/20"
      },
      {
        name: "EmotionRead",
        description: "Advanced facial recognition for real-time emotion analysis",
        category: "Recognition AI",
        rating: 4.3,
        users: "89K",
        price: "$35/mo",
        labels: [
          { type: "pricing", value: "$35/mo" },
          { type: "category", value: "image" },
          { type: "category", value: "analytics" },
          { type: "status", value: "new" }
        ],
        gradient: "from-teal-500/20 to-cyan-500/20"
      }
    ]
  }
];

const user = {
  name: "User",
  email: "user@example.com"
};

// Navigation routes
router.get("/navigation", (req, res) => {
  res.json(navItems);
});

// Page data routes
router.get("/pages/home", (req, res) => {
  res.json({ tools, categories });
});

router.get("/pages/categories", (req, res) => {
  res.json({ categories });
});

router.get("/pages/featured", (req, res) => {
  res.json({ tools: featured });
});

router.get("/pages/profile", (req, res) => {
  res.json({ user });
});

export default router;
