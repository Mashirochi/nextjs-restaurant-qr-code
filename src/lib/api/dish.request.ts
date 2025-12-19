import { ChangeAllTokensResType } from "@/type/schema/table.schema";
import http from "../http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/type/schema/dish.schema";

const dishRequest = {
  list: (params?: { page?: number; take?: number; filter?: any }) => {
    const { page = 1, take = 10, filter = {} } = params || {};

    let queryString = `/dishes?page=${page}&take=${take}`;
    if (filter.type) {
      queryString += `&type=${encodeURIComponent(filter.type)}`;
    }

    if (filter.search) {
      queryString += `&search=${encodeURIComponent(filter.search)}`;
    }

    if (filter.status) {
      queryString += `&status=${encodeURIComponent(filter.status)}`;
    }

    return http.get<DishListResType>(queryString, {
      next: { tags: ["dishList"] },
    });
  },
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>("/dishes", body),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishRequest;
