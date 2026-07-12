import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validateBody = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  next();
};

export const validateParams = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  next();
};

export const validateQuery = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  next();
};