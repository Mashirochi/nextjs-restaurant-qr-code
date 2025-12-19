import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType,
} from "@/type/schema/indicator.schema";
import http from "../http";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";

const dashboardApiRequest = {
  getDashboardData: async (params: { fromDate?: Date; toDate?: Date }) => {
    const query = queryString.stringify(
      {
        fromDate: params.fromDate?.toISOString(),
        toDate: params.toDate?.toISOString(),
      },
      { skipNull: true }
    );

    return http.get<DashboardIndicatorResType>(
      `/indicators/dashboard?${query}`
    );
  },
};

export const useDashboardQuery = (
  queryParams: DashboardIndicatorQueryParamsType
) => {
  return useQuery({
    queryKey: ["dashboard-data", queryParams],
    queryFn: () => dashboardApiRequest.getDashboardData(queryParams),
  });
};
