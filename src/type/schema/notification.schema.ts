import z from "zod";

export const NotificationSchema = z.object({
  id: z.number(),
  table: z.number().nullable(),
  message: z.string(),
  resolve: z.boolean(),
  createdAt: z.string().or(z.date()),
});

export type NotificationSchemaType = z.TypeOf<typeof NotificationSchema>;

export const GetNotificationsRes = z.object({
  message: z.string(),
  data: z.array(NotificationSchema),
});

export type GetNotificationsResType = z.TypeOf<typeof GetNotificationsRes>;

export const ResolveNotificationRes = z.object({
  message: z.string(),
  data: NotificationSchema,
});

export type ResolveNotificationResType = z.TypeOf<typeof ResolveNotificationRes>;
