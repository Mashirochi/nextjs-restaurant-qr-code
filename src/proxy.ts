import { NextResponse, NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./type/constant";

const guestPath = ["/guest"];
const unAuthPath = ["/auth/login"];
const managePath = ["/manage"];
const privatePath = [...managePath, ...guestPath];
const onlyOwnerPath = ["/manage/accounts"];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // Chưa đăng nhập thì không cho vào private path
  if (privatePath.some((path) => pathname.startsWith(path) && !refreshToken)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Đăng nhập rồi thì không vào login nữa
  if (refreshToken) {
    // Đang ở trang login mà đã đăng nhập rồi
    if (unAuthPath.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Đăng nhập rồi nhưng access token hết hạn
    else if (
      privatePath.some((path) => pathname.startsWith(path) && !accessToken)
    ) {
      const url = new URL("/api/auth/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken ?? "");
      url.searchParams.set("redirect", pathname ?? "");
      return NextResponse.redirect(url);
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
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Nếu không vào case nào thì cho middleware đi tiếp
  return NextResponse.next();
}

// path need proxy
export const config = {
  matcher: ["/manage/:path*", "/auth/login"],
};
