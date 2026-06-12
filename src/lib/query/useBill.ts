import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import billRequest from "../api/bill.request";
import {
  CloseBillBodyType,
  CreateBillBodyType,
  GetBillsQueryParamsType,
} from "@/type/schema/bill.schema";

export const useGetBillList = (query: GetBillsQueryParamsType) => {
  return useQuery({
    queryKey: ["bill-list", query],
    queryFn: () => billRequest.list(query),
  });
};

export const useGetBillById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["bill-detail", id],
    queryFn: () => billRequest.getBillById(id),
    enabled,
  });
};

export const useGetActiveBillByTable = ({
  tableNumber,
  enabled,
}: {
  tableNumber: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["active-bill", tableNumber],
    queryFn: () => billRequest.getActiveBillByTable(tableNumber),
    enabled,
  });
};

export const useCreateBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBillBodyType) => billRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-list"] });
      queryClient.invalidateQueries({ queryKey: ["active-bill"] });
    },
  });
};

export const usePayBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CloseBillBodyType }) =>
      billRequest.pay(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bill-list"] });
      queryClient.invalidateQueries({ queryKey: ["bill-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["active-bill"] });
    },
  });
};

export const useCancelBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => billRequest.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["bill-list"] });
      queryClient.invalidateQueries({ queryKey: ["bill-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["active-bill"] });
    },
  });
};
