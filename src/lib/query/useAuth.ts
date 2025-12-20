import { useMutation } from "@tanstack/react-query";
import authApiRequest from "../api/auth.request";
import guestApiRequest from "../api/guest.request";

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
