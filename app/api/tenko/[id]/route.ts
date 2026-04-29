import { NextResponse } from "next/server";

import { tenkoService } from "@/features/tenko/server/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = await tenkoService.getById(id);
  if (!report) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(report);
}
