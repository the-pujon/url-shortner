import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { deleteCachedData } from "../../utils/redis.utils";

export const createToken = (
  payload: { email: string; role: string },
  options?: { isRefresh?: boolean }
): string => {
  const isRefresh = options?.isRefresh || false;

  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_ACCESS_SECRET;

  const expiresInRaw = isRefresh
    ? process.env.JWT_REFRESH_EXPIRES_IN
    : process.env.JWT_ACCESS_EXPIRES_IN;

  if (!secret) {
    throw new Error("❌ JWT secret is undefined");
  }

  if (!expiresInRaw) {
    throw new Error("❌ JWT expiry time is undefined");
  }

  // ✅ TypeScript-friendly cast
  const expiresIn = (
    /^\d+$/.test(expiresInRaw) ? parseInt(expiresInRaw) : expiresInRaw
  ) as string | number;

  return jwt.sign(payload, secret as Secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("❌ JWT secret is undefined");
  return jwt.verify(token, secret) as JwtPayload;
};

export const removeTokens = async (res: any, prefix: any, email: any) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "strict", // Or 'Lax' or 'None' depending on your setup
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "strict", // Or 'Lax' or 'None' depending on your setup
  });

  await deleteCachedData(`${prefix}:user:${email}:refreshToken`);
  await deleteCachedData(`${prefix}:user:${email}:accessToken`);
};
