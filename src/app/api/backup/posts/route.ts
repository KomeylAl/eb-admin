import { proxyBackup } from "@/lib/backupRestore";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return proxyBackup(req, "posts");
}
