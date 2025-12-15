import express from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
const prisma = new PrismaClient();
const router = express.Router();

// READ all tools
router.get("/", async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      include: { 
        category: true,
        labels: {
          include: {
            label: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        },
        favorites: {
          select: {
            userId: true
          }
        }
      },
    });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

// SEARCH tools with query, filters, and sorting
router.get('/search/query', async (req, res) => {
  try {
    const { q, labels, sortBy, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for search
    const where: any = {
      OR: [
        { name: { contains: (q as string) || '', mode: 'insensitive' } },
        { description: { contains: (q as string) || '', mode: 'insensitive' } },
        { category: { name: { contains: (q as string) || '', mode: 'insensitive' } } },
      ]
    };

    // Filter by labels if provided
    if (labels) {
      const labelIds = Array.isArray(labels) 
        ? labels.map(l => parseInt(l as string))
        : [parseInt(labels as string)];
      
      where.labels = {
        some: {
          labelId: { in: labelIds }
        }
      };
    }

    // Get sort option
    const orderByOption = getSortOption(sortBy as string);

    // Calculate average rating per tool
    const tools = await prisma.tool.findMany({
      where,
      include: {
        category: true,
        labels: {
          include: { label: true }
        },
        reviews: {
          select: { rating: true, createdAt: true }
        },
        favorites: {
          select: { userId: true }
        }
      },
      skip,
      take: limitNum,
      orderBy: orderByOption
    });

    // Add computed fields (average rating, review count)
    const enrichedTools = tools.map(tool => {
      const averageRating = tool.reviews.length > 0 
        ? (tool.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / tool.reviews.length).toFixed(1)
        : 0;
      
      return {
        ...tool,
        averageRating,
        reviewCount: tool.reviews.length
      };
    });

    // Get total count for pagination
    const total = await prisma.tool.count({ where });

    res.json({
      tools: enrichedTools,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Error searching tools:', err);
    res.status(500).json({ error: 'Failed to search tools' });
  }
});

// Helper function to get sort option
function getSortOption(sortBy: string): any {
  switch(sortBy) {
    case 'rating':
      return { viewCount: 'desc' }; // Sort by rating proxy (views tend to correlate)
    case 'views':
      return { viewCount: 'desc' };
    case 'trending':
      return { isTrending: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    default:
      return { viewCount: 'desc' };
  }
}

// POST to track a view (increment view count)
router.post('/:id/view', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        viewCount: true
      }
    });
    res.json(tool);
  } catch (err) {
    console.error('Error tracking view:', err);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// GET single tool by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tool = await prisma.tool.findUnique({
      where: { id },
      include: {
        category: true,
        labels: {
          include: {
            label: true
          }
        },
        reviews: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        favorites: {
          include: {
            user: true
          }
        }
      }
    });

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.json(tool);
  } catch (err) {
    console.error('Error fetching tool:', err);
    res.status(500).json({ error: 'Failed to fetch tool' });
  }
});

// CREATE a new tool
router.post("/", adminMiddleware, async (req: AuthRequest, res) => {
  console.log("Received body:", req.body);

  try {
    const {
      name,
      description,
      url,
      imageUrl,
      bannerUrl,
      categoryId,
      planType,
      isTrending,
      isNew,
      labelIds,
    } = req.body;

    if (!name || !description || !url || !categoryId || !planType) {
      return res.status(400).json({
        error:
          "Missing required fields: name, description, url, categoryId, planType",
      });
    }

    const validPlanTypes = ["FREE", "PAID", "FREEMIUM"];
    if (!validPlanTypes.includes(planType)) {
      return res.status(400).json({
        error: "Invalid planType. Must be one of: FREE, PAID, FREEMIUM",
      });
    }

    const toolData: any = {
      name,
      description,
      url,
      imageUrl,
      bannerUrl,
      categoryId: Number(categoryId),
      planType,
      isTrending,
      isNew,
    };

    if (labelIds && labelIds.length > 0) {
      toolData.labels = {
        create: labelIds.map((labelId: number) => ({
          label: {
            connect: { id: labelId }
          }
        }))
      };
    }

    const newTool = await prisma.tool.create({
      data: toolData,
      include: { 
        category: true,
        labels: {
          include: {
            label: true
          }
        }
      },
    });

    res.status(201).json(newTool);
  } catch (err) {
    console.error("Error creating tool:", err);

    const code = (err as any)?.code as string | undefined;
    if (code === "P2002") {
      return res.status(400).json({ error: "Tool with this name already exists" });
    }
    if (code === "P2003") {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    res.status(500).json({ error: "Failed to create tool" });
  }
});


router.put('/:id', adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id!);
    const {
      name,
      description,
      url,
      imageUrl,
      bannerUrl,
      categoryId,
      planType,
      isTrending,
      isNew,
      labelIds,
    } = req.body;

    // validate existence
    const tool = await prisma.tool.findUnique({ where: { id } });
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    // validate plan type
    const validPlanTypes = ['FREE', 'PAID', 'FREEMIUM'];
    if (!validPlanTypes.includes(planType)) {
      return res.status(400).json({ error: 'Invalid planType' });
    }

    // Build update data
    const updateData: any = {
      name,
      description,
      url,
      imageUrl,
      bannerUrl,
      categoryId: Number(categoryId),
      planType,
      isTrending,
      isNew,
    };

    if (labelIds) {
      updateData.labels = {
        deleteMany: {},
        create: labelIds.map((labelId: number) => ({
          label: {
            connect: { id: labelId }
          }
        }))
      };
    }

    // Update tool and handle labels
    const updatedTool = await prisma.tool.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        labels: {
          include: {
            label: true
          }
        }
      }
    });

    res.json(updatedTool);
  } catch (err) {
    console.error('Error updating tool:', err);
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

// DELETE tool
router.delete('/:id', adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id!);
    await prisma.tool.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// ADD to favorites
router.post('/:id/favorite', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const toolId = parseInt(req.params.id!);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.userId;

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_toolId: {
          userId,
          toolId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Tool already favorited by this user' });
    }

    // Create favorite and increment favoriteCount
    await prisma.favorite.create({
      data: {
        userId,
        toolId
      }
    });

    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: { favoriteCount: { increment: 1 } },
      include: {
        category: true,
        labels: {
          include: { label: true }
        },
        reviews: true,
        favorites: {
          select: { userId: true }
        }
      }
    });

    res.json(updatedTool);
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// REMOVE from favorites
router.delete('/:id/favorite', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const toolId = parseInt(req.params.id!);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.userId;

    // Delete favorite and decrement favoriteCount
    await prisma.favorite.delete({
      where: {
        userId_toolId: {
          userId,
          toolId
        }
      }
    });

    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: { favoriteCount: { decrement: 1 } },
      include: {
        category: true,
        labels: {
          include: { label: true }
        },
        reviews: true,
        favorites: {
          select: { userId: true }
        }
      }
    });

    res.json(updatedTool);
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
