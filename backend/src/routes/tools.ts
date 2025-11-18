import express from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const prisma = new PrismaClient();
const router = express.Router();

// READ all tools
router.get("/", async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      include: { category: true },
    });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tools" });
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

    const newTool = await prisma.tool.create({
      data: {
        name,
        description,
        url,
        imageUrl,
        bannerUrl,
        categoryId: Number(categoryId),
        planType,
        isTrending,
        isNew,
      },
      include: { category: true },
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
    } = req.body;

    // validate existence
    const tool = await prisma.tool.findUnique({ where: { id } });
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    // validate plan type
    const validPlanTypes = ['FREE', 'PAID', 'FREEMIUM'];
    if (!validPlanTypes.includes(planType)) {
      return res.status(400).json({ error: 'Invalid planType' });
    }

    const updatedTool = await prisma.tool.update({
      where: { id },
      data: {
        name,
        description,
        url,
        imageUrl,
        bannerUrl,
        categoryId: Number(categoryId),
        planType,
        isTrending,
        isNew,
      },
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
