import { NextResponse } from "next/server";
import database from "@/infra/database";

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
