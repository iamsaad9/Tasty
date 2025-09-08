// src/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User as UserIconLucide, LogOut } from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import type { User as NextAuthUser } from "next-auth";
import { User, ShoppingCart, ClipboardList } from "lucide-react";

// --- Sub-component: MobileNavMenu ---
interface MobileNavMenuProps {
  navLinks: ProcessedMobileNavItem[];
  user: NextAuthUser & { role: string };
  onCloseMenu: () => void;
  setShowLogin: (val: boolean) => void;
}

interface ProcessedMobileNavItem {
  href: string;
  title: string;
  icon: React.ReactNode;
}

const profileLinks = [
  {
    title: "Edit Profile",
    href: "/profile/edit",
    icon: <User className="w-4 h-4" />,
  },
  {
    title: "My Orders",
    href: "/orders",
    icon: <ClipboardList className="w-4 h-4" />,
  },
];

export const MobileNavLinks: React.FC<MobileNavMenuProps> = ({
  navLinks,
  onCloseMenu,
  setShowLogin,
}) => {
  const pathname = usePathname();
  // const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();
  return (
    <div className="px-2 pt-2 pb-4 space-y-1 bg-transparent">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center px-3 gap-2 py-3 rounded-lg mx-2 text-white
            ${
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
                ? "bg-background/50 text-primary dark:bg-primary/20  text-md"
                : "text-muted-foreground hover:bg-background/30 hover:text-foreground text-sm"
            }`}
          onClick={onCloseMenu}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
      <div className="border-t border-border mt-3 pt-3 ">
        {!session ? (
          <div className="flex items-center justify-center">
            <Button
              className="bg-theme text-background text-base 2xl:text-lg w-full sm:w-[50%]"
              onPress={() => {
                setShowLogin(true);
              }}
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {profileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 gap-2 py-3 rounded-lg mx-2 text-white
            ${
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
                ? "bg-background/50 text-primary dark:bg-primary/20  text-md"
                : "text-muted-foreground hover:bg-background/30 hover:text-foreground text-sm"
            }`}
                onClick={onCloseMenu}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
            <div className="flex items-center px-3 py-2 mb-2">
              <Avatar
                src={session.user.image || undefined}
                fallback={
                  session.user?.name?.charAt(0).toUpperCase() || (
                    <UserIconLucide className="h-5 w-5" />
                  )
                }
                size="md"
                className="mr-3"
              />
              <div>
                <div className="text-base font-semibold text-foreground">
                  {session.user.name}
                </div>
                <div className="text-sm text-foreground/70">
                  {session.user.email}
                </div>
                <div className="text-sm text-foreground/70">
                  {session.user.role}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onCloseMenu();
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center w-full px-3 py-2 mt-1 text-sm  bg-destructive/30 hover:bg-destructive/50 rounded-lg cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2 " /> Sign Out
            </button>
          </div>
        )}

        {/* <ThemeSwitcher /> */}
      </div>
    </div>
  );
};
