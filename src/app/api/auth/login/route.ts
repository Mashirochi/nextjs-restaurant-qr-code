import { cookies } from "next/headers";
import http, { HttpError } from "@/lib/http";
import { jwtDecode } from "jwt-decode";
import { LoginBodyType, LoginResType } from "@/type/schema/auth.schema";
import envConfig from "@/lib/validateEnv";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const res = await http.post<LoginResType>("auth/login", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    });

    if (!res) {
      console.error("No response received from login API");
      return Response.json({
        status: 500,
        message: "No response received from login API",
      });
    }

    const { accessToken, refreshToken } = res?.payload?.data ?? "";
    const decodedAccessToken = jwtDecode(accessToken) as { exp: number };
    const decodedRefreshToken = jwtDecode(refreshToken) as { exp: number };

    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });

    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(res.payload);
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof HttpError) {
      console.error("HTTP error details:", {
        status: error.status,
        payload: error.payload,
      });
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      console.error("Unexpected error:", error);
      return Response.json({
        status: 500,
        message:
          "Có lỗi xảy ra: " +
          (error instanceof Error ? error.message : String(error)),
      });
    }
  }
}
