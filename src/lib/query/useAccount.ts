import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AccountRequest from "../api/account.request";
import MediaRequest from "../api/media.request";
import {
  CreateGuestBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/type/schema/account.schema";

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
    mutationFn: (
      params: FormData | { formData: FormData; folder?: string }
    ) => {
      if (params instanceof FormData) {
        return MediaRequest.uploadSingleImage(params);
      } else {
        return MediaRequest.uploadSingleImage(params.formData, params.folder);
      }
    },
  });
};

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ["account-list"],
    queryFn: AccountRequest.list,
  });
};

export const useGetEmployeeAccount = (id: number) => {
  return useQuery({
    queryKey: ["employee-account", id],
    queryFn: () => AccountRequest.getEmployee(id),
    enabled: !!id,
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AccountRequest.addEmployee,
    onSuccess: () => {
      // add successfully, invalidate the account list query to refetch
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateEmployeeAccountBodyType;
    }) => AccountRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AccountRequest.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
    },
  });
};

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: (body: CreateGuestBodyType) => AccountRequest.createGuest(body),
  });
};

export const useGetListGuests = (params: {
  fromDate?: Date;
  toDate?: Date;
}) => {
  return useQuery({
    queryKey: ["guest-list", params],
    queryFn: () => AccountRequest.guestList(params),
  });
};
