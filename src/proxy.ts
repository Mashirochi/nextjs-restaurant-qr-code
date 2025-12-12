import { NextResponse, NextRequest } from "next/server";

const privatePath = ["/admin"];
const unAuthPath = ["/auth/login"];
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  // Chưa đăng nhập thì không cho vào private path
  if (privatePath.some((path) => pathname.startsWith(path) && !refreshToken)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // Đăng nhập rồi thi không vào login nữa
  else if (
    unAuthPath.some((path) => pathname.startsWith(path) && refreshToken)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Đăng nhập rồi nhưng access token hết hạn
  else if (
    privatePath.some(
      (path) => pathname.startsWith(path) && !accessToken && refreshToken
    )
  ) {
    const url = new URL("logout", request.url);
    url.searchParams.set("refreshToken", refreshToken ?? "");
    return NextResponse.redirect(url);
  }

  // Nếu không vào case nào thì cho middleware đi tiếp
  return NextResponse.next();
}

// path need proxy
export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
