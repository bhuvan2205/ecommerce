"use server"

import prisma from "@/config/db";
import { notFound } from "next/navigation"

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: { id },
  })

  if (!user) return notFound()

  return user
}
