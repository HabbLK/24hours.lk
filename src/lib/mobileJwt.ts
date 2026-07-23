import jwt from "jsonwebtoken";
import { IUser } from "@/models/User";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";

function getSecret(): string {
  const secret = process.env.MOBILE_JWT_SECRET;
  if (!secret) {
    throw new Error("MOBILE_JWT_SECRET is not set");
  }
  return secret;
}

export interface MobileAccessTokenPayload {
  sub: string;
  role: string;
  email?: string;
  type: "access";
}

export interface MobileRefreshTokenPayload {
  sub: string;
  type: "refresh";
}

type MobileUser = Pick<IUser, "email" | "role"> & { _id: unknown };

export function signAccessToken(user: MobileUser): string {
  const payload: MobileAccessTokenPayload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
    type: "access",
  };
  return jwt.sign(payload, getSecret(), { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(user: MobileUser): string {
  const payload: MobileRefreshTokenPayload = {
    sub: String(user._id),
    type: "refresh",
  };
  return jwt.sign(payload, getSecret(), { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyMobileToken(
  token: string
): MobileAccessTokenPayload | MobileRefreshTokenPayload {
  return jwt.verify(token, getSecret()) as
    | MobileAccessTokenPayload
    | MobileRefreshTokenPayload;
}
