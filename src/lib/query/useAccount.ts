import { useMutation, useQuery } from "@tanstack/react-query";
import AccountRequest from "../api/account.request";
import MediaRequest from "../api/media.request";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: AccountRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: AccountRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: AccountRequest.changePassword,
  });
};

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: MediaRequest.uploadSingleImage,
  });
};
