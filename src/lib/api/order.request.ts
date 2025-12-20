import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/type/schema/order.schema";
import http from "../http";

const orderRequest = {
  list: () => http.get<GetOrdersResType>("/orders"),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${id}`, body),
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>("/orders", body),
};

export default orderRequest;
