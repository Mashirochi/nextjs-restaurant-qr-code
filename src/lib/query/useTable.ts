import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tableRequest from "../api/table.request";
import { UpdateTableBodyType } from "@/type/schema/table.schema";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["table-list"],
    queryFn: tableRequest.list,
  });
};

export const useGetTableDetail = (id: number) => {
  return useQuery({
    queryKey: ["detail-table", id],
    queryFn: () => tableRequest.getTable(id),
    enabled: !!id,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableRequest.addTable,
    onSuccess: () => {
      // add successfully, invalidate the table list query to refetch
      queryClient.invalidateQueries({ queryKey: ["table-list"] });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTableBodyType }) =>
      tableRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-list"] });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tableRequest.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-list"] });
    },
  });
};

export const useChangeAllTokenTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableRequest.changeAllTokenTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-list"] });
    },
  });
};

export const useUpdateTokenByTableNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tableNumber: number) =>
      tableRequest.updateTokenByTableNumber(tableNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-list"] });
    },
  });
};
