import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters"),
  price: z.number()
    .gt(0, "Price must be greater than zero"), 
  category: z.enum(['sale', 'service', 'job', 'other']) 
});

export const updateAnnouncementSchema = announcementSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);