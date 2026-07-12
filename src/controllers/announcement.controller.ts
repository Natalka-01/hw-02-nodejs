import { Request, Response } from 'express';
import prisma from '../../prisma/client.js';

// Створення оголошення
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.sub; // Беремо id автора з токена
    const { title, description, price, category } = req.body;

    const announcement = await prisma.announcement.create({
      data: { title, description, price, category, userId },
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Отримання всіх оголошень
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { search, sort, page: pageQuery } = req.query;
    
    // Налаштування пагінації
    const page = Math.max(1, Number(pageQuery) || 1);
    const perPage = 10;
    const skip = (page - 1) * perPage;

    // Умова пошуку
    const where = search 
      ? { title: { contains: String(search), mode: 'insensitive' as const } } 
      : {};

    // Сортування
    const orderBy = sort === 'oldest' 
      ? { createdAt: 'asc' as const } 
      : { createdAt: 'desc' as const };

    // Запити до бази
    const total = await prisma.announcement.count({ where });
    const announcements = await prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      include: {
        user: { // Підтягуємо автора
          select: { id: true, username: true, email: true, name: true }
        }
      }
    });

    // Формування відповіді
    res.json({
      data: announcements,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / perPage),
        perPage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true, name: true } }
      }
    });

    if (!announcement) return res.status(404).json({ message: 'Not found' });

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.sub;

    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) return res.status(404).json({ message: 'Not found' });

    // Перевірка ownership
    if (announcement.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: req.body, // Тільки ті поля, які передали
      include: {
        user: { select: { id: true, username: true, email: true, name: true } }
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.sub;

    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) return res.status(404).json({ message: 'Not found' });

    // Перевірка ownership
    if (announcement.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.announcement.delete({ where: { id } });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};