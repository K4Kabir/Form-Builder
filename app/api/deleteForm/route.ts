import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new NextResponse("Please provide formId to delete", {
        status: 401,
      });
    }

    const forms = await prisma.form.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("[FORM_UPSERT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
