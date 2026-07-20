"use client";

import React, { useState } from "react";
import { User, Mail, Calendar, ShieldCheck, CircleCheck, Edit, Settings2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function DynamicProfileTabs({ initialUser }: { initialUser: any }) {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");

  const nameInitials = initialUser.name
    ? initialUser.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Card className="border border-border bg-card shadow-md overflow-hidden animate-in fade-in duration-300">
      {/* মডার্ন গ্রেডিয়েন্ট ব্যানার */}
      <div className="h-36 w-full bg-linear-to-r from-primary/30 via-accent to-background relative" />
      
      <CardContent className="relative px-6 pb-6 pt-0">

        <div className="absolute -top-14 left-6 flex items-end gap-4">
          <Avatar className="h-28 w-28 border-4 border-card shadow-lg flex justify-center items-center">
            {initialUser.profile?.profilePhoto && (
            //   <AvatarImage src={initialUser?.profile.profilePhoto} alt={initialUser.name} />
            <Image src={initialUser.profile.profilePhoto} 
  alt={initialUser.name} width={24}
height={24}  className=" rounded-full object-cover" ></Image>
            )}
            {/* <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold select-none">
              {nameInitials}
            </AvatarFallback> */}
          </Avatar>
        </div>

        {/* ইউজার প্রাইমারি টেক্সট */}
        <div className="pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              {initialUser.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {initialUser.profile?.bio || "💡 Full-stack developer passionate about building clean interfaces."}
            </p>
          </div>
          
          <Button size="sm" className="cursor-pointer gap-2 self-start sm:self-center">
            <Edit className="size-4" />
            Edit Profile
          </Button>
        </div>

        {/* ডাইনামিক কাস্টম ট্যাব বাটন সমূহ */}
        <div className="flex gap-2 border-b border-border mt-8 pb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer",
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="size-4" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer",
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings2 className="size-4" />
            Account Settings
          </button>
        </div>

        {/* ট্যাব কনটেন্ট এরিয়া */}
        <div className="mt-6 animate-in fade-in-50 duration-200">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* ইনফরমেশন গ্রিড */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                  <div className="p-2 rounded-md bg-muted text-muted-foreground"><Mail className="size-4" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-foreground">{initialUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                  <div className="p-2 rounded-md bg-muted text-muted-foreground"><ShieldCheck className="size-4" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Role</p>
                    <p className="text-sm font-medium text-foreground capitalize">{initialUser.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* লাইভ টাইমলাইন/হিস্ট্রি ট্র্যাকিং */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase flex items-center gap-2">
                  <Clock className="size-4 text-primary" /> Account Timeline
                </h3>
                
                <div className="relative border-l border-border pl-4 space-y-4 ml-2">
                  <div className="relative">
                    <span className="absolute left-[-5] mt-1 bg-green-500 rounded-full h-2.5 w-2.5 ring-4 ring-card" />
                    <p className="text-xs text-muted-foreground font-semibold">{formatDate(initialUser.createdAt)}</p>
                    <p className="text-sm text-foreground mt-0.5">Account was officially created and verified.</p>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -left-5.25 mt-1 bg-primary rounded-full h-2.5 w-2.5 ring-4 ring-card animate-pulse" />
                    <p className="text-xs text-muted-foreground font-semibold">{formatDate(initialUser.updatedAt)}</p>
                    <p className="text-sm text-foreground mt-0.5">Profile metadata synchronized successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // সেটিংস ট্যাব কনটেন্ট
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center p-4 border border-border rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Account Status</h4>
                  <p className="text-xs text-muted-foreground">Current state of your registration profile.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                  {initialUser.activeStatus}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 border  rounded-xl bg-destructive/5 border-destructive/20">
                <div>
                  <h4 className="text-sm font-medium text-destructive">Deactivate Profile</h4>
                  <p className="text-xs text-muted-foreground">Temporarily freeze or delete this data entry container.</p>
                </div>
                <Button variant="destructive" size="sm" className="cursor-pointer">Action</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}