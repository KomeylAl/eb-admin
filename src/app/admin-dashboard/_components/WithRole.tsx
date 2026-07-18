"use client";

import { PuffLoader } from "react-spinners";
import { useUser } from "@/context/UserContext";
import Header from "@/components/layout/Header";

interface WithRoleProps {
  allowedRoles: Array<String>;
  children: React.ReactNode;
}

const WithRole = ({ allowedRoles, children }: WithRoleProps) => {
  const { user } = useUser();

  const userRole = user?.admin_role ?? user?.role ?? null;

  if (!userRole) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <PuffLoader
          className="text-center mt-20 flex items-center justify-center"
          color={"#3fb2f2"}
          size={80}
        />
      </div>
    );
  }

  if (!allowedRoles.includes(userRole!)) {
    return (
      <div className="w-full h-full flex flex-col">
        <Header searchFn={() => {}} isShowSearch />
        <div className="w-full h-full flex items-center justify-center p-10">
          شما به این قسمت دسترسی ندرید.
        </div>
      </div>
    );
  }

  return children;
};

export default WithRole;
