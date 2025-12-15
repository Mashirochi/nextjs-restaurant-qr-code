import http from "../http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/type/schema/dish.schema";

const dishRequest = {
  list: () => http.get<DishListResType>("/dishes"),
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>("/dishes", body),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishRequest;
