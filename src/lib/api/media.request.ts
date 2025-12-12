import http from "../http";
import { UploadImageResType } from "@/type/schema/media.schema";

const MediaRequest = {
  uploadSingleImage: (formData: FormData) =>
    http.post<UploadImageResType>("/media/upload", formData),
};

export default MediaRequest;
