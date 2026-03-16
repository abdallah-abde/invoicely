import { badRequest, serverError } from "@/lib/api/api-response";
import prisma from "@/lib/db/prisma";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ value: string }> },
) {
  try {
    const { value } = await params;
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(
      products.map((pro) => ({ label: pro.name, value: pro.id })),
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-products");
  }
}
