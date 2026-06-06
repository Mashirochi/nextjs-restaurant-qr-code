import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authApiRequest from "../api/auth.request";
import guestApiRequest from "../api/guest.request";
import { UpdateGuestTableBodyType } from "@/type/schema/guest.schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};

export const useLoginGuestMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useLogoutGuestMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.refreshToken,
  });
};

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.setTokenToCookie,
  });
};

export const useGetGuestTableStatus = (token: string) => {
  return useQuery({
    queryKey: ["guest-table-status", token],
    queryFn: () => guestApiRequest.getTableStatus(token),
    enabled: !!token,
  });
};

export const useUpdateGuestTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, body }: { token: string; body: UpdateGuestTableBodyType }) =>
      guestApiRequest.updateTableStatus(token, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guest-table-status", variables.token] });
    }
  });
};
