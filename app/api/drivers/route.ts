import { NextResponse } from "next/server";

import { driverService } from "@/features/driver/server/service";
import type { DriverRegistrationInput } from "@/features/driver/types";

export async function POST(req: Request) {
  const input = (await req.json()) as DriverRegistrationInput;
  const driver = await driverService.register(input);
  return NextResponse.json(driver, { status: 201 });
}
