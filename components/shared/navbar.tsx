"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  CreditCard,
  LifeBuoy,
  LogInIcon,
  User2Icon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/logout";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Settings", href: "/settings", icon: Settings },
];

const userMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: LifeBuoy, separatorBefore: true },
  { label: "Log out", href: "#", icon: LogOut, separatorBefore: true }, // href পরিবর্তন করা হয়েছে
];

type IUser = {
  success: string;
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
      profile: {
        id: string;
        profilePhoto: string | null;
        bio: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
};

type NavbarProps = {
  user: IUser;
};

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isLogout, setIsLogout] = useState(false);

  const handleUserMenuAction = async (action: string, e: React.MouseEvent) => {
    if (action === "Log out") {
      e.preventDefault();

      try {
        await logout();
        setIsLogout(true);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  useEffect(() => {
    if (isLogout) {
      toast.success("User Logged Out Successfully");
      router.push("/login");
      router.refresh();
    }
  }, [isLogout]);
  return (
    <header className="border-b">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Boxes className="size-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            Next js Press
          </span>
        </Link>

        {/* Nav links */}
        <ul className="items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                <link.icon className="mr-2 size-4" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User dropdown */}
        {user.success ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                aria-label="Open user menu"
              >
                <Avatar className="size-8 flex justify-center items-center">
                  <AvatarFallback className="bg-amber-100">
                    <User2Icon className="text-green-600 size-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {user?.data?.profile.name || "User Name"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.data?.profile.email || "user@example.com"}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {userMenuItems.map((item) => (
                  <Fragment key={item.label}>
                    {item.separatorBefore && <DropdownMenuSeparator />}
                    {item.label !== "Log out" ? (
                      <DropdownMenuItem asChild>
                        <Link href={item.href} className="cursor-pointer">
                          <item.icon className="mr-2 size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={(e) => handleUserMenuAction(item.label, e)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <item.icon className="mr-2 size-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    )}
                  </Fragment>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // <Link
          //   href="/login"
          //   className={buttonVariants({
          //     variant: "default",
          //     className: "flex justify-between items-center gap-2",
          //   })}
          // >
          //   <LogInIcon className="size-4" />
          //   Login
          // </Link>
          <Link href="/login">
            <Button className="cursor-pointer">
              <LogInIcon className="size-4" />
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
