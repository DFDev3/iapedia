import express from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

router.post("/", async (req, res) => {
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

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ error: "Tool with this name already exists" });
      }
      if (err.code === "P2003") {
        return res.status(400).json({ error: "Invalid categoryId" });
      }
    }

    res.status(500).json({ error: "Failed to create tool" });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
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
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.tool.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

export default router;
