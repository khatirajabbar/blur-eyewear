import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Stripe Checkout is intentionally scheduled for Milestone 2." }, { status: 501 });
}
