import z from "zod";
import { DishStatusValues } from "../constant";

export const CreateDishBody = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  image: z.url(),
  status: z.enum(DishStatusValues).optional(),
  type: z.string().optional(), // Added type field
});

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  type: z.string(), // Added type field
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DishRes = z.object({
  data: DishSchema,
  message: z.string(),
});

export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string(),
});

export type DishListResType = z.TypeOf<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;
export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
