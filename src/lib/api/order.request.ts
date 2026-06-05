import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetGuestBillQueryParamsType,
  GetGuestBillResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/type/schema/order.schema";
import http from "../http";
import queryString from "query-string";

const orderRequest = {
  list: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      "/orders?" +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    ),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${id}`, body),
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>("/orders", body),
  getOrderById: (id: number) =>
    http.get<GetOrderDetailResType>(`/orders/${id}`),
  payCash: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/orders/pay`, body),
  getBillList: (params: GetGuestBillQueryParamsType) =>
    http.get<GetGuestBillResType>(
      "/orders/bill" + (params.guestId ? `?guestId=${params.guestId}` : "")
    ),
};

export default orderRequest;
