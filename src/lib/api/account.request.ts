import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/type/schema/account.schema";
import http from "../http";

const AccountRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", body),
};

export default AccountRequest;
