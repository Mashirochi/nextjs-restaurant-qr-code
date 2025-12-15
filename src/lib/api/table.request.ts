import http from "../http";
import {
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
};

export default tableRequest;
