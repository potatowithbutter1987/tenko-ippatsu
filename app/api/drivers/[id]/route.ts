import { NextResponse } from "next/server";

import { driverService } from "@/features/driver/server/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const driver = await driverService.getById(id);
  if (!driver) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(driver);
}
