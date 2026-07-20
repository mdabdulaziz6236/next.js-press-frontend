import { getMe } from "@/service/getMe";
import React from "react";
import DynamicProfileTabs from "../../_components/DynamicProfileTabs";


type IUserResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    profile: {
      id: string;
      name: string;
      email: string;
      activeStatus: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      profile?: {
        id: string;
        profilePhoto: string | null;
        bio: string | null;
        userId: string;
      };
    };
  };
};

const UserProfilePage = async () => {
  const response: IUserResponse = await getMe();
  
  if (!response?.success || !response?.data?.profile) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-background">
        <p className="text-muted-foreground font-medium">Failed to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-background py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-3xl">
        {/* সমস্ত ডাইনামিক ইন্টারঅ্যাকশন হ্যান্ডেল করবে এই ক্লায়েন্ট কম্পোনেন্টটি */}
        <DynamicProfileTabs initialUser={response.data.profile} />
      </div>
    </div>
  );
};

export default UserProfilePage;