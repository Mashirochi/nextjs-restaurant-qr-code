import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import branchRequest from "../api/branch.request";
import { UpdateBranchBodyType } from "../../type/schema/branch.schema";

export const useGetBranchList = () => {
  return useQuery({
    queryKey: ["branch-list"],
    queryFn: branchRequest.list,
  });
};

export const useGetBranchDetail = (id: number) => {
  return useQuery({
    queryKey: ["detail-branch", id],
    queryFn: () => branchRequest.getBranch(id),
    enabled: !!id,
  });
};

export const useAddBranchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: branchRequest.addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-list"] });
    },
  });
};

export const useUpdateBranchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateBranchBodyType }) =>
      branchRequest.updateBranch(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-list"] });
    },
  });
};

export const useDeleteBranchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => branchRequest.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-list"] });
    },
  });
};
