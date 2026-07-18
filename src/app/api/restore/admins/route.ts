import { proxyRestore } from "@/lib/backupRestore";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return proxyRestore(req, "admins");
}
