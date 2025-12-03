// routes/categories.ts
import express from 'express'
import { PrismaClient } from '../generated/prisma/client.js'
const prisma = new PrismaClient()
const router = express.Router()

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { tools: true }
        },
        tools: {
          take: 4,
          orderBy: [
            { isTrending: 'desc' },
            { isNew: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
            labels: {
              include: {
                label: true
              }
            }
          }
        }
      }
    })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET single category with all tools
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tools: true }
        },
        tools: {
          orderBy: [
            { isTrending: 'desc' },
            { isNew: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
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
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const { name, description, fullDescription, iconUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const newCategory = await prisma.category.create({
      data: { name, description, fullDescription, iconUrl: iconUrl || ''},
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, fullDescription, iconUrl } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const updated = await prisma.category.update({
      where: { id },
      data: { name, description, fullDescription, iconUrl: iconUrl || '' }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;

