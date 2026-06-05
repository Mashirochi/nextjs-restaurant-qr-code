import http from "../http";
import {
  BranchListResType,
  BranchResType,
  CreateBranchBodyType,
  UpdateBranchBodyType,
} from "../../type/schema/branch.schema";

const branchRequest = {
  list: () => http.get<BranchListResType>("/branches"),
  addBranch: (body: CreateBranchBodyType) =>
    http.post<BranchResType>("/branches", body),
  updateBranch: (id: number, body: UpdateBranchBodyType) =>
    http.put<BranchResType>(`/branches/${id}`, body),
  getBranch: (id: number) => http.get<BranchResType>(`/branches/${id}`),
  deleteBranch: (id: number) => http.delete<BranchResType>(`/branches/${id}`),
};

export default branchRequest;
