import z from 'zod'

export const BillStatus = {
  Open: 'OPEN',
  Closed: 'CLOSED',
  Cancelled: 'CANCELLED'
} as const

export const PaymentMethod = {
  Cash: 'CASH',
  BankTransfer: 'BANK_TRANSFER'
} as const

export const PaymentStatus = {
  Pending: 'PENDING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
  Cancelled: 'CANCELLED'
} as const

const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  virtualPrice: z.number(),
  basePrice: z.number(),
  image: z.string(),
  status: z.string(),
  dishId: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const BillOrderSchema = z.object({
  id: z.number(),
  guestId: z.number().nullable(),
  guest: z.object({
    id: z.number(),
    name: z.string(),
    tableNumber: z.number().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
  }).nullable(),
  billId: z.number().nullable(),
  tableNumber: z.number().nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const BillGuestSchema = z.object({
  id: z.number(),
  name: z.string(),
  tableNumber: z.number().nullable(),
  billId: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export const PaymentSchema = z.object({
  id: z.number(),
  billId: z.number(),
  amount: z.coerce.number(),
  method: z.enum([PaymentMethod.Cash, PaymentMethod.BankTransfer]),
  status: z.enum([PaymentStatus.Pending, PaymentStatus.Success, PaymentStatus.Failed, PaymentStatus.Cancelled]),
  transactionId: z.string().nullable(),
  paidAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date()
})

export const BillSchema = z.object({
  id: z.number(),
  tableNumber: z.number(),
  status: z.enum([BillStatus.Open, BillStatus.Closed, BillStatus.Cancelled]),
  guests: z.array(BillGuestSchema),
  orders: z.array(BillOrderSchema),
  payments: z.array(PaymentSchema),
  createdAt: z.coerce.date(),
  closedAt: z.coerce.date().nullable()
})

export type BillType = z.infer<typeof BillSchema>

export const CreateBillBody = z.object({
  tableNumber: z.number()
})
export type CreateBillBodyType = z.infer<typeof CreateBillBody>

export const CloseBillBody = z.object({
  method: z.enum([PaymentMethod.Cash, PaymentMethod.BankTransfer])
})
export type CloseBillBodyType = z.infer<typeof CloseBillBody>

export const GetBillsQueryParams = z.object({
  tableNumber: z.coerce.number().optional(),
  status: z.enum([BillStatus.Open, BillStatus.Closed, BillStatus.Cancelled]).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional()
})
export type GetBillsQueryParamsType = z.infer<typeof GetBillsQueryParams>

export const BillRes = z.object({
  message: z.string(),
  data: BillSchema
})
export type BillResType = z.infer<typeof BillRes>

export const BillListRes = z.object({
  message: z.string(),
  data: z.array(BillSchema)
})
export type BillListResType = z.infer<typeof BillListRes>

export const CloseBillRes = z.object({
  message: z.string(),
  data: z.object({
    bill: BillSchema,
    payment: PaymentSchema
  })
})
export type CloseBillResType = z.infer<typeof CloseBillRes>
