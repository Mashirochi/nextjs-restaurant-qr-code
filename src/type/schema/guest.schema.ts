import z from "zod";
import { Role } from "../constant";
import { OrderSchema } from "./order.schema";

export const GuestLoginBody = z
  .object({
    name: z.string().min(2).max(50),
    phone: z.string().optional(),
    tableNumber: z.number(),
    token: z.string(),
  })
  .strict();

export type GuestLoginBodyType = z.TypeOf<typeof GuestLoginBody>;

export const GuestLoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    guest: z.object({
      id: z.number(),
      name: z.string(),
      role: z.enum([Role.Guest]),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
  message: z.string(),
});

export type GuestLoginResType = z.TypeOf<typeof GuestLoginRes>;

export const GuestCreateOrdersBody = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number(),
  })
);

export type GuestCreateOrdersBodyType = z.TypeOf<typeof GuestCreateOrdersBody>;

export const GuestCreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
});

export type GuestCreateOrdersResType = z.TypeOf<typeof GuestCreateOrdersRes>;

export const GuestGetOrdersRes = GuestCreateOrdersRes;

export type GuestGetOrdersResType = z.TypeOf<typeof GuestGetOrdersRes>;

export const GuestTableParams = z.object({
  token: z.string()
})

export type GuestTableParamsType = z.TypeOf<typeof GuestTableParams>

export const GetGuestTableRes = z.object({
  data: z.object({
    number: z.number(),
    status: z.string(),
    phoneNumber: z.string().nullable()
  }),
  message: z.string()
})

export type GetGuestTableResType = z.TypeOf<typeof GetGuestTableRes>

export const UpdateGuestTableBody = z.object({
  phoneNumber: z.string().min(10).max(11)
}).strict()

export type UpdateGuestTableBodyType = z.TypeOf<typeof UpdateGuestTableBody>

export const UpdateGuestTableRes = GetGuestTableRes

export type UpdateGuestTableResType = z.TypeOf<typeof UpdateGuestTableRes>
