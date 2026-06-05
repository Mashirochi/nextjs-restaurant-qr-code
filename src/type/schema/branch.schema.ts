import z from "zod";

export const CreateBranchBody = z.object({
  name: z.string().min(1).max(256),
  image: z.string(),
  address: z.string().min(1).max(500),
  link: z.string().url(),
  hotline: z.string().min(1).max(20),
  rating: z.coerce.number().min(0).max(5).optional(),
  open: z.string(),
  close: z.string(),
});

export type CreateBranchBodyType = z.TypeOf<typeof CreateBranchBody>;

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  address: z.string(),
  link: z.string(),
  hotline: z.string(),
  rating: z.number(),
  open: z.string(),
  close: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BranchSchemaType = z.TypeOf<typeof BranchSchema>;

export const BranchRes = z.object({
  data: BranchSchema,
  message: z.string(),
});

export type BranchResType = z.TypeOf<typeof BranchRes>;

export const BranchListRes = z.object({
  data: z.array(BranchSchema),
  message: z.string(),
});

export type BranchListResType = z.TypeOf<typeof BranchListRes>;

export const PaginatedBranchListRes = z.object({
  data: z.array(BranchSchema),
  pagination: z.object({
    page: z.number(),
    take: z.number(),
    total: z.number(),
  }),
  message: z.string(),
});

export type PaginatedBranchListResType = z.TypeOf<
  typeof PaginatedBranchListRes
>;

export const UpdateBranchBody = CreateBranchBody.partial();
export type UpdateBranchBodyType = z.TypeOf<typeof UpdateBranchBody>;

export const BranchParams = z.object({
  id: z.coerce.number(),
});
export type BranchParamsType = z.TypeOf<typeof BranchParams>;

export const BranchQueryParams = z.object({
  page: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});
export type BranchQueryParamsType = z.TypeOf<typeof BranchQueryParams>;
