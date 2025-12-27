import z from "zod";

export const TicketSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  content: z.string(),
  images: z.array(z.string()).max(10).optional(),
  date: z.union([z.date(), z.string()]),
  performedBy: z.string(),
  notes: z.string().optional(),
});

export type TicketType = z.TypeOf<typeof TicketSchema>;

export const TicketTreeSchema = z.object({
  id: z.number(),
  date: z.union([z.date(), z.string()]),
  performedBy: z.string(),
  notes: z.string().optional(),
});

export type TicketTreeType = z.TypeOf<typeof TicketTreeSchema>;

export const LetterSchema = z.object({
  id: z.number(),
  title: z.string(),
  link: z.string().url(),
});

export type LetterType = z.TypeOf<typeof LetterSchema>;

export const CreateTicketBody = z.object({
  email: z.string().email(),
  content: z.string(),
  images: z.array(z.any()).max(10).optional(),
});

export type CreateTicketBodyType = z.TypeOf<typeof CreateTicketBody>;
