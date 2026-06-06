import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewRequest from "../api/review.request";
import {
  CreateReviewBodyType,
  GetReviewsQueryParamsType,
} from "@/type/schema/review.schema";

export const useGetReviewList = (query?: GetReviewsQueryParamsType) => {
  return useQuery({
    queryKey: ["review-list", query],
    queryFn: () => reviewRequest.list(query),
  });
};

export const useGetReviewReasons = (query?: GetReviewsQueryParamsType) => {
  return useQuery({
    queryKey: ["review-reasons", query],
    queryFn: () => reviewRequest.getReviewReasons(query),
  });
};
export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReviewBodyType) => reviewRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-list"] });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-list"] });
    },
  });
};
