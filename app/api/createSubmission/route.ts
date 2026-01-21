import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId, answers } = body;

    if (!formId) {
      return new NextResponse("Please provide id", {
        status: 401,
      });
    }

    const form = await prisma.formSubmission.create({
      data: {
        answers,
        formId,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_UPSERT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
