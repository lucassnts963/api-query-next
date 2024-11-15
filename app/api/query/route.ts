import { NextResponse } from "next/server";
import database from "@/infra/database";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*", // Ajuste para o domínio da aplicação Flutter em produção
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const { query: sqlQuery, params } = await request.json();

    const result = await database.query({
      text: sqlQuery,
      values: params,
    });

    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao executar query", details: error.message },
      { status: 400 }
    );
  }
}
