import { Metadata } from "next";
import AccountingLayoutShell from "./_components/AccountingLayoutShell";

export const metadata: Metadata = {
  title: "پنل حسابداری - کلینیک ابراز",
  description: "پنل حسابداری - کلینیک ابراز",
};

export default function AccountantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AccountingLayoutShell>{children}</AccountingLayoutShell>;
}
