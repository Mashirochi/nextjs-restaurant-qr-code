import http from "../http";

const revalidateApiRequest = async (path: string) => {
  http.get(`/api/revalidate?tag=${path}`, {
    baseUrl: "",
  });
};

export default revalidateApiRequest;
