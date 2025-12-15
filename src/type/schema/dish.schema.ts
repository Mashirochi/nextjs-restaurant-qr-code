import z from "zod";
import { DishStatusValues } from "../constant";

export const DishType = {
  ThitBo: "Thịt bò",
  HaiSan: "Hải sản",
  RauNam: "Rau & nấm",
  ThitNoiTang: "Thịt nội tạng",
  DauHuDoVien: "Đậu hũ & đồ viên",
  Lau: "Lẩu",
  Thit: "Thịt",
  DauHuVaDoVien: "Đậu hũ và đồ viên",
  My: "Mỳ",
  HaCao: "Há cảo",
  ThitHeoCuu: "Thịt heo & cừu",
} as const;

export const DishTypeValues = [
  DishType.ThitBo,
  DishType.HaiSan,
  DishType.RauNam,
  DishType.ThitNoiTang,
  DishType.DauHuDoVien,
  DishType.Lau,
  DishType.Thit,
  DishType.DauHuVaDoVien,
  DishType.My,
  DishType.HaCao,
  DishType.ThitHeoCuu,
] as const;

export const CreateDishBody = z.object({
  name: z.string().min(1).max(256),
  virtualPrice: z.string(),
  basePrice: z.string().optional(),
  image: z.string(),
  status: z.enum(DishStatusValues).optional(),
  type: z.enum(DishTypeValues).optional(),
});

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  virtualPrice: z.string(),
  basePrice: z.string().nullable(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  type: z.enum(DishTypeValues),
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
  id: z.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
