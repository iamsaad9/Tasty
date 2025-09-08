"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Avatar, Button } from "@heroui/react";
import { MdLogout } from "react-icons/md";
import AuthModal from "./Modals/LoginModal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { FaUserEdit } from "react-icons/fa";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

// Updated interfaces to work with flat menu structure
interface ProcessedMenuLink {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  order: number;
  roles: string[];
}

interface DesktopNavLinksProps {
  menuLinks: ProcessedMenuLink[];
  pathname: string;
  fixedHeader?: boolean;
}

export const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  menuLinks,
  fixedHeader,
  pathname,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Check if a menu item is active
  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="hidden md:flex items-center gap-3">
      {showLogin && (
        <AuthModal open={showLogin} onClose={() => setShowLogin(false)} />
      )}

      {menuLinks.map((link) => {
        const active = isLinkActive(link.href);

        return (
          <Link
            key={link.id}
            href={link.href}
            title={link.name}
            className={`flex items-center xl:px-3 py-2 rounded-lg transition-colors lg:text-base 2xl:text-lg
               ${
                 active && fixedHeader
                   ? "text-theme lg:text-base 2xl:text-lg"
                   : active
                   ? "text-gray-300 lg:text-base 2xl:text-lg"
                   : "text-white hover:text-gray-300"
               }`}
          >
            <span className="mr-1.5">{link.icon}</span>
            {link.name}
          </Link>
        );
      })}

      {!session ? (
        <Button
          className="bg-theme text-background text-base 2xl:text-lg"
          onPress={() => setShowLogin(true)}
        >
          Login
        </Button>
      ) : (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              color="warning"
              as="button"
              className="transition-transform cursor-pointer"
              src={session.user.image || ""}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            className="text-secondary"
            variant="flat"
          >
            <DropdownItem
              key="profile"
              className="py-2 px-4 pointer-events-none"
            >
              <div className="flex flex-col items-start gap-3">
                <div className="flex justify-start items-center gap-3">
                  <div>
                    <p className="font-medium text-base text-accent">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.user.email}
                    </p>
                    {session.user?.role === "admin" && (
                      <p className="text-sm text-gray-500 capitalize">
                        Administrator
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DropdownItem>

            <DropdownItem key="edit-profile">
              <div className="text-accent flex flex-row gap-2 justify-start items-center font-medium">
                <FaUserEdit size={20} />
                <span>Edit Profile</span>
              </div>
            </DropdownItem>

            <DropdownItem
              key="view-orders"
              onClick={() => router.push("/orders")}
            >
              <div className="text-accent flex flex-row gap-2 justify-start items-center font-medium">
                <ClipboardList size={20} />
                <span>My Orders</span>
              </div>
            </DropdownItem>

            <DropdownItem
              key="logout"
              onPress={() => signOut()}
              className="py-2 border-t-1"
            >
              <div className="text-accent flex flex-row gap-2 justify-start items-center font-medium ">
                <MdLogout size={20} />
                <span>Log Out</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};
