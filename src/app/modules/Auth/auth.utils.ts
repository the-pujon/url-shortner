import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { deleteCachedData } from "../../utils/redis.utils";
import config from "../../config";
import { ITokenPayload, UserRole } from "./auth.interface";
import { AUTH_CONFIG } from "./auth.config";
import { cacheData, getCachedData } from "../../utils/redis.utils";
import { Response } from "express";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

interface TokenOptions {
  isRefresh?: boolean;
  expiresIn?: SignOptions['expiresIn'];
}

/**
 * Creates a JWT token with proper options
 */
export const createToken = (
  payload: ITokenPayload,
  options: TokenOptions = {}
): string => {
  const { isRefresh = false, expiresIn } = options;
  const secret = isRefresh ? config.jwt_refresh_secret : config.jwt_access_secret;
  const defaultExpiry = isRefresh ? "7d" : "1h";

  const signOptions: SignOptions = {
    expiresIn: expiresIn || defaultExpiry,
    algorithm: 'HS256',
  };

  if (!secret) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "JWT secret is not configured"
    );
  }

  return jwt.sign(payload, secret, signOptions);
};

/**
 * Verifies a JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = config.jwt_access_secret;
  if (!secret) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "JWT secret is not configured"
    );
  }
  return jwt.verify(token, secret) as JwtPayload;
};

/**
 * Removes user tokens from cache and cookies
 */
export const removeTokens = async (
  res: Response,
  prefix: string,
  email: string
): Promise<void> => {
  const accessTokenKey = `${prefix}:user:${email}:accessToken`;
  const refreshTokenKey = `${prefix}:user:${email}:refreshToken`;

  await Promise.all([
    deleteCachedData(accessTokenKey),
    deleteCachedData(refreshTokenKey),
  ]);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

/**
 * Checks rate limiting for operations
 */
export const checkRateLimit = async (
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<boolean> => {
  const cacheKey = `${config.redis_cache_key_prefix}:${AUTH_CONFIG.CACHE_PREFIXES.RATE_LIMIT}${key}`;
  const attempts = await getCachedData(cacheKey);

  // if no attempts, set 1 and return true
  if (!attempts) {
    await cacheData(cacheKey, 1, windowMs / 1000);
    return true;
  }

  const currentAttempts = Number(attempts);
  if (currentAttempts >= maxAttempts) {
    throw new AppError(
      httpStatus.TOO_MANY_REQUESTS,
      "Too many attempts. Please try again later."
    );
  }

  await cacheData(cacheKey, currentAttempts + 1, windowMs / 1000);
  return true;
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): boolean => {
  const { PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS } = AUTH_CONFIG;

  if (password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }

  if (PASSWORD_REQUIREMENTS.UPPERCASE && !/[A-Z]/.test(password)) {
    return false;
  }

  if (PASSWORD_REQUIREMENTS.LOWERCASE && !/[a-z]/.test(password)) {
    return false;
  }

  if (PASSWORD_REQUIREMENTS.NUMBERS && !/\d/.test(password)) {
    return false;
  }

  if (PASSWORD_REQUIREMENTS.SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  return true;
};

/**
 * Checks if a user can modify another user's role based on role hierarchy
 */
export const canModifyRole = (
  currentUserRole: UserRole,
  targetUserRole: UserRole,
  newRole: UserRole
): boolean => {
  const { ROLE_HIERARCHY } = AUTH_CONFIG;
  
  // Super admin can modify any role except other super admins
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return targetUserRole !== UserRole.SUPER_ADMIN && newRole !== UserRole.SUPER_ADMIN;
  }

  // Admin can only modify moderator and customer roles
  if (currentUserRole === UserRole.ADMIN) {
    const targetRoleLevel = ROLE_HIERARCHY[targetUserRole as keyof typeof ROLE_HIERARCHY] || 0;
    const newRoleLevel = ROLE_HIERARCHY[newRole as keyof typeof ROLE_HIERARCHY] || 0;
    const adminLevel = ROLE_HIERARCHY[UserRole.ADMIN];

    return targetRoleLevel < adminLevel && newRoleLevel < adminLevel;
  }

  // Moderator can only modify customer roles
  if (currentUserRole === UserRole.MODERATOR) {
    return (
      targetUserRole === UserRole.CUSTOMER &&
      newRole === UserRole.CUSTOMER
    );
  }

  return false;
};
