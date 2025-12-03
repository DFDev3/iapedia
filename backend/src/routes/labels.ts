import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';

const router = Router();
const prisma = new PrismaClient();

// Get all labels
router.get('/', async (req, res) => {
  try {
    const labels = await prisma.label.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Get labels by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const labels = await prisma.label.findMany({
      where: {
        category: category as any,
      },
      orderBy: { name: 'asc' },
    });
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Create a new label
router.post('/', async (req, res) => {
  try {
    const { name, slug, category, color, description } = req.body;
    const label = await prisma.label.create({
      data: { name, slug, category, color, description },
    });
    res.status(201).json(label);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// Update a label
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, category, color, description } = req.body;
    const label = await prisma.label.update({
      where: { id: parseInt(id) },
      data: { name, slug, category, color, description },
    });
    res.json(label);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update label' });
  }
});

// Delete a label
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.label.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

// Get labels for a specific tool
router.get('/tool/:toolId', async (req, res) => {
  try {
    const { toolId } = req.params;
    const toolLabels = await prisma.toolLabel.findMany({
      where: { toolId: parseInt(toolId) },
      include: { label: true },
    });
    res.json(toolLabels.map(tl => tl.label));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tool labels' });
  }
});

// Add labels to a tool
router.post('/tool/:toolId', async (req, res) => {
  try {
    const { toolId } = req.params;
    const { labelIds } = req.body; // array of label IDs

    // Remove existing labels
    await prisma.toolLabel.deleteMany({
      where: { toolId: parseInt(toolId) },
    });

    // Add new labels
    await prisma.toolLabel.createMany({
      data: labelIds.map((labelId: number) => ({
        toolId: parseInt(toolId),
        labelId,
      })),
    });

    const updatedLabels = await prisma.toolLabel.findMany({
      where: { toolId: parseInt(toolId) },
      include: { label: true },
    });

    res.json(updatedLabels.map(tl => tl.label));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tool labels' });
  }
});

export default router;
