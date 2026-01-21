import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, description, content, id, status, published } = body;
    console.log(id);

    if (!userId) {
      return new NextResponse("User is required to save the form data", {
        status: 401,
      });
    }

    // Upsert logic:
    // 'where' looks for the unique ID.
    // If not found (or if id is undefined), it jumps to 'create'.
    const form = await prisma.form.upsert({
      where: {
        // If id is null/undefined, we use a string that won't exist
        // to force the 'create' block.
        id: id || "",
      },
      update: {
        title,
        description,
        content: content || "[]",
        // Keeping status as DRAFT during updates if desired
        status: status,
        published: published,
      },
      create: {
        userId,
        title,
        description: description || "",
        content: content || "[]",
        status: status,
        published: published,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_UPSERT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
