import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  );
};

export default DashboardLayout;

{
  /* <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
          </div> */
}
