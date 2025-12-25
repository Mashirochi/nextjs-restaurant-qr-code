import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderRequest from "../api/order.request";
import {
  CreateOrdersBodyType,
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/type/schema/order.schema";
import guestApiRequest from "../api/guest.request";

export const useGetOrderList = (query: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["order-list", query],
    queryFn: () => orderRequest.list(query),
  });
};

export const useGetOrderById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryFn: () => orderRequest.getOrderById(id),
    queryKey: ["order-detail", id],
    enabled,
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateOrderBodyType }) =>
      orderRequest.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-list"] });
    },
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrdersBodyType) => orderRequest.createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-list"] });
    },
  });
};

export const useGuestCreateOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

export const useGuestGetOrderList = () => {
  return useQuery({
    queryKey: ["guest-order-list"],
    queryFn: guestApiRequest.getOrderList,
  });
};

export const usePayGuestOrderMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderRequest.payCash(body),
  });
};
