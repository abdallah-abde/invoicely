import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // console.log("params.id: ", params.id);
  const resolvedParams = await params;
  await prisma.invoice.delete({
    where: { id: resolvedParams.id },
  });

  return NextResponse.json({ message: "Invoice deleted" });
}
