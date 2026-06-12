import {
  BillListResType,
  BillResType,
  CloseBillBodyType,
  CloseBillResType,
  CreateBillBodyType,
  GetBillsQueryParamsType,
} from "@/type/schema/bill.schema";
import http from "../http";
import queryString from "query-string";

const billRequest = {
  create: (body: CreateBillBodyType) =>
    http.post<BillResType>("/bills", body),
  list: (queryParams: GetBillsQueryParamsType) =>
    http.get<BillListResType>(
      "/bills?" +
        queryString.stringify({
          tableNumber: queryParams.tableNumber,
          status: queryParams.status,
          fromDate: queryParams.fromDate,
          toDate: queryParams.toDate,
        })
    ),
  getBillById: (id: number) => http.get<BillResType>(`/bills/${id}`),
  getActiveBillByTable: (tableNumber: number) =>
    http.get<BillResType>(`/bills/table/${tableNumber}/active`),
  pay: (id: number, body: CloseBillBodyType) =>
    http.post<CloseBillResType>(`/bills/${id}/pay`, body),
  cancel: (id: number) => http.post<BillResType>(`/bills/${id}/cancel`),
};

export default billRequest;
