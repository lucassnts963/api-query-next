import { jwtVerify, SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
