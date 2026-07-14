import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';


const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, name },
    });

    const tokens = generateTokens(user.id);
    
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, ...tokens });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user.id);
    
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, ...tokens });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    
    const tokenInDb = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!tokenInDb) return res.status(401).json({ message: 'Invalid token' });

    const tokens = generateTokens(decoded.sub);
    
    await prisma.refreshToken.delete({ where: { id: tokenInDb.id } });
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: decoded.sub },
    });

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (userId) {
      await prisma.refreshToken.deleteMany({ where: { userId } });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};