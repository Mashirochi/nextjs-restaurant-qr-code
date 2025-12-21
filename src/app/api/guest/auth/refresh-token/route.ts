import { cookies } from "next/headers";
import guestApiRequest from "@/lib/api/guest.request";
import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    // Clear any existing tokens if refresh token is missing
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { payload } = await guestApiRequest.sRefreshToken({
      refreshToken,
    });

    // Decode tokens and handle potential decoding errors
    let decodedAccessToken, decodedRefreshToken;
    try {
      decodedAccessToken = jwtDecode(payload.data.accessToken) as {
        exp: number;
      };
      decodedRefreshToken = jwtDecode(payload.data.refreshToken) as {
        exp: number;
      };
    } catch (decodeError) {
      // If we can't decode the tokens, clear them and return error
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return Response.json(
        {
          message: "Không thể giải mã token",
        },
        {
          status: 401,
        }
      );
    }

    // Set new tokens in cookies
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });

    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error: any) {
    // Clear tokens when refresh fails
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    console.error("Refresh token error:", error);

    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra khi làm mới token",
      },
      {
        status: 401,
      }
    );
  }
}
