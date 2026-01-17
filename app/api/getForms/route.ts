import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new NextResponse("User id is required to get the form data", {
        status: 401,
      });
    }

    const forms = await prisma.form.findMany({
      where: { userId: userId },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("[FORM_UPSERT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
