// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import database from "@/infra/database";
import { signJWT } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Busca usuário
    const result = await database.query({
      text: "SELECT uuid AS id, email, name, password FROM users WHERE email = $1",
      values: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verifica senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gera token JWT
    const token = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao fazer login", details: error.message },
      { status: 400 }
    );
  }
}
