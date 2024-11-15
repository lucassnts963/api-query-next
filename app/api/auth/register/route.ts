// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import database from "@/infra/database";
import { signJWT } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Verifica se usuário já existe
    const userExists = await database.query({
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    });

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere novo usuário
    const result = await database.query({
      text: "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING uuid, email, name",
      values: [email, hashedPassword, name],
    });

    // Gera token JWT
    const token = await signJWT({
      id: result.rows[0].id,
      email: result.rows[0].email,
    });

    return NextResponse.json({
      user: result.rows[0],
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao registrar usuário", details: error.message },
      { status: 400 }
    );
  }
}
