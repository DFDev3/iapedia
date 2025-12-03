import express from "express";
import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();
const router = express.Router();

// CREATE review
router.post('/', async (req, res) => {
  try {
    const { userId, toolId, rating, content } = req.body;

    // Validate required fields
    if (!userId || !toolId || !rating) {
      return res.status(400).json({ error: 'userId, toolId, and rating are required' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this tool
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: parseInt(userId),
        toolId: parseInt(toolId)
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this tool' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        toolId: parseInt(toolId),
        rating: parseInt(rating),
        content: content || ''
      },
      include: {
        user: true,
        tool: true
      }
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// UPDATE review
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, content, userId } = req.body;

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(content !== undefined && { content })
      },
      include: {
        user: true,
        tool: true
      }
    });

    res.json(updatedReview);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.body;

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
