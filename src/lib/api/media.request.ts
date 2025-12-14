import http from "../http";
import { UploadImageResType } from "@/type/schema/media.schema";

const MediaRequest = {
  uploadSingleImage: (formData: FormData, folder?: string) => {
    // Add folder parameter to form data if provided
    if (folder) {
      formData.append("folder", folder);
    } else {
      // Default to avatars folder if not specified
      formData.append("folder", "avatars");
    }
    return http.post<UploadImageResType>("/media/upload", formData);
  },
};

export default MediaRequest;
