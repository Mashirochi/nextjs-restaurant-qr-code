import http from "../http";
import {
  ChangeAllTokensResType,
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/type/schema/table.schema";

const tableRequest = {
  list: () => http.get<TableListResType>("/tables"),
  addTable: (body: CreateTableBodyType) =>
    http.post<TableResType>("/tables", body),
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`/tables/${id}`, body),
  getTable: (id: number) => http.get<TableResType>(`/tables/${id}`),
  deleteTable: (id: number) => http.delete<TableResType>(`/tables/${id}`),
  changeAllTokenTable: () =>
    http.post<ChangeAllTokensResType>("/tables/change-all-tokens", {}),
  updateTokenByTableNumber: (tableNumber: number) =>
    http.post<ChangeAllTokensResType>(
      `/tables/${tableNumber}/change-token`,
      {}
    ),
};

export default tableRequest;
