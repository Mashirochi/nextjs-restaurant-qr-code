import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/type/schema/account.schema";
import http from "../http";
import queryString from "query-string";
import { toDate } from "date-fns";

const AccountRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", body),
  list: () => http.get<AccountListResType>("/accounts"),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>("/accounts", body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`/accounts/${id}`, body),
  getEmployee: (id: number) => http.get<AccountResType>(`/accounts/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`/accounts/${id}`),
  guestList: async (params: GetGuestListQueryParamsType) => {
    const query = queryString.stringify(
      {
        fromDate: params.fromDate?.toISOString(),
        toDate: params.toDate?.toISOString(),
      },
      { skipNull: true }
    );

    return http.get<GetListGuestsResType>(`/accounts/guests?${query}`);
  },
  createGuest: (body: CreateGuestBodyType) =>
    http.post<AccountResType>("/accounts/guests", body),
};

export default AccountRequest;
