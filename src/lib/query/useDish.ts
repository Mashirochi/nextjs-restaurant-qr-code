import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dishRequest from "../api/dish.request";
import { UpdateDishBodyType } from "@/type/schema/dish.schema";

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dish-list"],
    queryFn: dishRequest.list,
  });
};

export const useGetDishDetail = (id: number) => {
  return useQuery({
    queryKey: ["detail-dish", id],
    queryFn: () => dishRequest.getDish(id),
    enabled: !!id,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishRequest.addDish,
    onSuccess: () => {
      // add successfully, invalidate the dish list query to refetch
      queryClient.invalidateQueries({ queryKey: ["dish-list"] });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDishBodyType }) =>
      dishRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dish-list"] });
    },
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dishRequest.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dish-list"] });
    },
  });
};
