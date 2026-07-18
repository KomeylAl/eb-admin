import { Toaster } from "react-hot-toast";
import "../../app/globals.css";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "کلینیک ابراز - ورود",
  description: "کلینیک ابراز - ورود",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="bg-gray-200/40">
        <Toaster />
        {children}
      </div>
    </UserProvider>
  );
}
