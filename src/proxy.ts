import { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./type/constant";
import createMiddleware from "next-intl/middleware";

const guestPath = ["/vi/guest", "/en/guest"];
const unAuthPath = ["/vi/auth/login", "/en/auth/login"];
const managePath = ["/vi/manage", "/en/manage"];
const onlyOwnerPath = ["/vi/manage/accounts", "/en/manage/accounts"];
const privatePath = [...managePath, ...guestPath];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const handleI18nRouting = createMiddleware({
    locales: ["en", "vi"],
    defaultLocale: "en",
  });

  const response = handleI18nRouting(request);

  // Chưa đăng nhập thì không cho vào private path
  if (privatePath.some((path) => pathname.startsWith(path) && !refreshToken)) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname ?? "");
    response.headers.set("x-middleware-rewrite", url.toString());
    return response;
  }

  // Đăng nhập rồi thì không vào login nữa
  if (refreshToken) {
    // Đang ở trang login mà đã đăng nhập rồi
    if (unAuthPath.some((path) => pathname.startsWith(path))) {
      const url = new URL("/", request.url);
      response.headers.set("x-middleware-rewrite", url.toString());
      return response;
    }

    // Đăng nhập rồi nhưng access token hết hạn
    else if (
      privatePath.some((path) => pathname.startsWith(path) && !accessToken)
    ) {
      const url = new URL("/api/auth/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken ?? "");
      url.searchParams.set("redirect", pathname ?? "");
      response.headers.set("x-middleware-rewrite", url.toString());
      return response;
    }

    // Không đúng role thì về trang chủ
    const role = decodeToken(refreshToken)?.role;
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePath.some((path) => pathname.startsWith(path));

    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPath.some((path) => pathname.startsWith(path));

    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPath.some((path) => pathname.startsWith(path));
    if (
      isNotGuestGoToGuestPath ||
      isGuestGoToManagePath ||
      isNotOwnerGoToOwnerPath
    ) {
      const url = new URL("/", request.url);
      response.headers.set("x-middleware-rewrite", url.toString());
      return response;
    }
    return response;
  }

  // Nếu không vào case nào thì cho middleware đi tiếp
  return response;
}

// path need proxy
export const config = {
  matcher: ["/", "/(vi|en)/:path*"],
};
