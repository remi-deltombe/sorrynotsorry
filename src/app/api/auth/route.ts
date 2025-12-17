import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/app.config";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === config.password) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

