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

    await database.query({ text: "BEGIN" });

    const result = await database.query({
      text: sqlQuery,
      values: params,
    });

    await database.query({ text: "COMMIT" });

    return NextResponse.json({
      success: true,
      rowCount: result.rowCount,
      data: result.rows,
    });
  } catch (error: any) {
    await database.query({ text: "ROLLBACK" });
    return NextResponse.json(
      { error: "Erro ao executar mutation", details: error.message },
      { status: 400 }
    );
  }
}
