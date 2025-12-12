import z from 'zod'

export const MessageRes = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    statusCode: z.number(),
    timestamp: z.string()
  })
  .strict()

export type MessageResType = z.TypeOf<typeof MessageRes>
