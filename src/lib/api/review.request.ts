import {
  CreateReviewBodyType,
  CreateReviewResType,
  GetReviewReasonsQueryParamsType,
  GetReviewReasonsResType,
  GetReviewsQueryParamsType,
  GetReviewsResType,
} from "@/type/schema/review.schema";
import http from "../http";
import queryString from "query-string";

const reviewRequest = {
  create: (body: CreateReviewBodyType) =>
    http.post<CreateReviewResType>("/reviews", body),
  list: (queryParams?: GetReviewsQueryParamsType) =>
    http.get<GetReviewsResType>(
      "/reviews" + (queryParams ? "?" + queryString.stringify(queryParams) : "")
    ),
  delete: (id: number) =>
    http.delete<CreateReviewResType>(`/reviews/${id}`),
  getReviewReasons: (queryParams?: GetReviewReasonsQueryParamsType) =>
    http.get<GetReviewReasonsResType>(
      "/reviews/reasons" + (queryParams ? "?" + queryString.stringify(queryParams) : "")
    ),
};

export default reviewRequest;
