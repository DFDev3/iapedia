import express from 'express';
import { PrismaClient } from '../generated/prisma/client.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET single user by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
          }
        },
        favorites: {
          include: {
            tool: {
              include: {
                category: true,
                labels: {
                  include: {
                    label: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          include: {
            tool: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password to client
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET user by email (for login)
router.get('/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password to client
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, bio } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || user.name,
        bio: bio || user.bio,
        avatarUrl: avatarUrl || user.avatarUrl,
      },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
          }
        },
        favorites: {
          include: {
            tool: {
              include: {
                category: true,
                labels: {
                  include: {
                    label: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          include: {
            tool: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    // Don't send password to client
    const { password, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
