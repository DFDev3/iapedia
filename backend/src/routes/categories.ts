// routes/categories.ts
import express from 'express'
import { PrismaClient } from '../generated/prisma/client.js'
const prisma = new PrismaClient()
const router = express.Router()

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Create category
router.post("/", async (req, res) => {
  try {
    const { name, description, iconUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const newCategory = await prisma.category.create({
      data: { name, description, iconUrl: iconUrl || ''},
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
    const { name, description, iconUrl } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const updated = await prisma.category.update({
      where: { id },
      data: { name, description, iconUrl: iconUrl || '' }
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

