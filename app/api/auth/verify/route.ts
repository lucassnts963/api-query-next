// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  return NextResponse.json({
    user: payload,
    valid: true,
  });
}
