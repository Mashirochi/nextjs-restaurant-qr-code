import z from "zod";

export const ReviewSchema = z.object({
  id: z.number(),
  customerId: z.number().nullable(),
  ratingStars: z.number().min(1).max(5),
  arrayReasons: z.array(z.string()),
  comment: z.string(),
  phoneNumber: z.string().nullable(),
  createdAt: z.string(),
});

export type ReviewSchemaType = z.TypeOf<typeof ReviewSchema>;

export const CreateReviewBody = z.object({
  customerId: z.number().optional(),
  ratingStars: z.number().min(1).max(5),
  arrayReasons: z.array(z.string()),
  comment: z.string(),
  phoneNumber: z.string().optional(),
});

export type CreateReviewBodyType = z.TypeOf<typeof CreateReviewBody>;

export const CreateReviewRes = z.object({
  message: z.string(),
  data: ReviewSchema,
});

export type CreateReviewResType = z.TypeOf<typeof CreateReviewRes>;

export const GetReviewsQueryParams = z.object({
  ratingStars: z.coerce.number().min(1).max(5).optional(),
  reasons: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  take: z.coerce.number().min(1).optional()
});

export type GetReviewsQueryParamsType = z.TypeOf<typeof GetReviewsQueryParams>;

export const GetReviewsRes = z.object({
  message: z.string(),
  data: z.array(ReviewSchema),
  pagination: z.object({
    page: z.number(),
    take: z.number(),
    total: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }).optional()
});

export type GetReviewsResType = z.TypeOf<typeof GetReviewsRes>;

export const GetReviewReasonsRes = z.object({
  message: z.string(),
  data: z.record(z.string(), z.number()),
});

export type GetReviewReasonsResType = z.TypeOf<typeof GetReviewReasonsRes>;

export const GetReviewReasonsQueryParams = z.object({
  ratingStars: z.coerce.number().min(1).max(5).optional(),
});

export type GetReviewReasonsQueryParamsType = z.TypeOf<
  typeof GetReviewReasonsQueryParams
>;
