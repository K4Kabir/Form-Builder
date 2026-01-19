import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new NextResponse(
        "Please provide the form Id to fetch the details",
        {
          status: 401,
        }
      );
    }

    const forms = await prisma.form.findFirst({
      where: { id: id },
    });

    if (forms) {
      return NextResponse.json(forms);
    }

    return new NextResponse("Internal Error", { status: 404 });
  } catch (error) {
    console.error("[FORM_UPSERT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
