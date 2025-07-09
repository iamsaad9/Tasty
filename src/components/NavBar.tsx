// src/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIconLucide,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button } from "@heroui/react";
import type { User as NextAuthUser } from "next-auth";
import { MdLocationPin } from "react-icons/md";
import AuthModal from "./LoginModal";


// --- Type Definitions (Re-added as inline types) ---
interface MenuItemType {
  id: string;
  name: string;
  href: string;
  order: number;
}

interface MenuTabType {
  id: string;
  name: string;
  order: number;
}

// Helper Types
interface ProcessedMobileNavItem {
  href: string;
  title: string;
}

type VisibleTabType = MenuTabType & { items: MenuItemType[] };

// --- Mock Data for Static Links ---
const staticMenuTabsData: VisibleTabType[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    // icon: "Settings",
    order: 1,
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/",
        // icon: "User",
        order: 1,
      },
    ],
  },
  {
    id: "menu",
    name: "Menu",
    // icon: "Settings",
    order: 2,
    items: [
      {
        id: "menu",
        name: "Menu",
        href: "/menu",
        // icon: "User",
        order: 1,
      },
    ],
  },
  {
    id: "reservations",
    name: "Reservations",
    // icon: "HelpCircle",
    order: 4,
    items: [
      {
        id: "reservations",
        name: "Reservations",
        href: "/reservations",
        // icon: "HelpCircle",
        order: 1,
      },
    ],
  },
  {
    id: "about",
    name: "About",
    // icon: "HelpCircle",
    order: 5,
    items: [
      {
        id: "about",
        name: "About",
        href: "/about",
        // icon: "HelpCircle",
        order: 1,
      },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    // icon: "HelpCircle",
    order: 5,
    items: [
      {
        id: "contact",
        name: "Contact",
        href: "/contact",
        // icon: "HelpCircle",
        order: 1,
      },
    ],
  },
];

// --- Sub-component: UserProfile ---
interface UserProfileProps {
  user: NextAuthUser & { role: string };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(!isOpen)}
        className="h-full flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-accent cursor-pointer"
        aria-label="User menu"
      >
        <Avatar
          src={user?.image || undefined}
          fallback={
            user?.name?.charAt(0).toUpperCase() || (
              <UserIconLucide className="h-5 w-5" />
            )
          }
          size="sm"
        />
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="card absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-border py-1 z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            {user?.name && (
              <div className="px-3 py-2 text-sm border-b border-border">
                <div className="font-semibold truncate text-card-foreground">
                  {user.name}
                </div>
                {user.email && (
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                )}
                {user.role && (
                  <div className="text-xs text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </div>
                )}
              </div>
            )}
            <div className="p-1 ">
              {/* <ThemeSwitcher /> */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className=" flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer "
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-component: DesktopNavLinks ---
interface DesktopNavLinksProps {
  visibleMenuTabs: VisibleTabType[];
  pathname: string;
  fixedHeader?: boolean;
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  visibleMenuTabs,
  fixedHeader,
  pathname,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showLogin, setShowLogin] = useState(false);
  const isTabActive = (tab: VisibleTabType) =>
    tab.items.some(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href))
    );


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId]?.contains(event.target as Node)
      ) {
        const clickedOnTrigger = Object.values(dropdownRefs.current).some(
          (ref) =>
            ref?.parentElement
              ?.querySelector("button")
              ?.contains(event.target as Node)
        );
        if (
          !clickedOnTrigger ||
          !dropdownRefs.current[openDropdownId]?.parentElement
            ?.querySelector("button")
            ?.contains(event.target as Node)
        ) {
          setOpenDropdownId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className="hidden md:flex items-center gap-5">
      {showLogin && (
        <AuthModal open={showLogin} onClose={() => setShowLogin(false)} />
      )}
      {visibleMenuTabs.map((tab) => {
        const active = isTabActive(tab);
        const hasMultipleItems = tab.items.length > 1;
        const singleItemHref = tab.items.length === 1 ? tab.items[0].href : "#";

        return (
          <div
            key={tab.id}
            className="relative"
            ref={(el) => {
              dropdownRefs.current[tab.id] = el;
            }}
          >
            <Link
              href={singleItemHref}
              title={tab.name}
              className={`flex items-center xl:px-3 py-2 rounded-lg transition-colors lg:text-base 2xl:text-lg
                 ${
                   active && fixedHeader
                     ? "text-theme  lg:text-base 2xl:text-lg"
                     : active
                     ? "text-gray-300 lg:text-base 2xl:text-lg"
                     : "text-white hover:text-gray-300"
                 }`}
            >
              {/* {getIcon(tab.icon, "h-4 w-4 mr-1.5")} */}
              {tab.name}
            </Link>

            {hasMultipleItems && (
              <AnimatePresence>
                {openDropdownId === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setOpenDropdownId(null)}
                    className=" card absolute left-0 mt-2 origin-top-left rounded-md shadow-lg bg-card ring-1 ring-border py-1 z-50"
                  >
                    {tab.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        title={item.name}
                        className={`flex items-center  w-full px-3 py-2 text-sm 
                          ${
                            pathname === item.href ||
                            (item.href !== "/" &&
                              pathname.startsWith(item.href))
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-card-foreground hover:bg-accent/50"
                          }`}
                        onClick={() => setOpenDropdownId(null)}
                      >
                        {/* {getIcon(item.icon)} */}
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
      <Button
        className="bg-theme text-background text-base 2xl:text-lg"
        onPress={() => setShowLogin(true)}
      >
        Login
      </Button>
    </div>
  );
};

// --- Sub-component: MobileNavMenu ---
interface MobileNavMenuProps {
  navLinks: ProcessedMobileNavItem[];
  user: NextAuthUser & { role: string };
  onCloseMenu: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  navLinks,
  user,
  onCloseMenu,
}) => {
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="px-2 pt-2 pb-4 space-y-1 bg-transparent">
      {showLogin && (
        <AuthModal open={showLogin} onClose={() => setShowLogin(false)} />
      )}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center px-3 py-3 rounded-lg mx-2 text-white
            ${
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
                ? "bg-background/50 text-primary dark:bg-primary/20  text-md"
                : "text-muted-foreground hover:bg-background/30 hover:text-foreground text-sm"
            }`}
          onClick={onCloseMenu}
        >
          {/* {link.icon} */}
          {link.title}
        </Link>
      ))}
      <div className="border-t border-border mt-3 pt-3 ">
        {/* <div className="flex items-center px-3 py-2 mb-2">
          <Avatar
            src={user?.image || undefined}
            fallback={
              user?.name?.charAt(0).toUpperCase() || (
                <UserIconLucide className="h-5 w-5" />
              )
            }
            size="md"
            className="mr-3"
          />
          <div>
            {user?.name && (
              <div className="text-base font-semibold text-foreground">
                {user.name}
              </div>
            )}
            {user?.email && (
              <div className="text-sm text-foreground/70">{user.email}</div>
            )}
            {user.role && (
              <div className="text-xs text-foreground/70 capitalize">
                {user.role.toLowerCase()}
              </div>
            )}
          </div>
        </div> */}

        {/* <ThemeSwitcher /> */}
        {/* <button
          onClick={() => {
            onCloseMenu();
            signOut({ callbackUrl: "/login" });
          }}
          className="flex items-center w-full px-3 py-2 mt-1 text-sm  bg-destructive/30 hover:bg-destructive/50 rounded-lg cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2 " /> Sign Out
        </button> */}
        <div className="flex items-center justify-center">
          <Button
            className="bg-theme text-background text-base 2xl:text-lg w-full sm:w-[50%]"
            onPress={() => setShowLogin(true)}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Nav Component ---
export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  // const { data: session, status } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const visibleMenuTabs = useMemo(
    () => staticMenuTabsData.filter((tab) => tab.items && tab.items.length > 0),
    []
  );
  const [showFixedNavbar, setShowFixedNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFixedNavbar(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const processedMobileNavLinks = useMemo(() => {
    const links: ProcessedMobileNavItem[] = [];
    visibleMenuTabs.forEach((tab) => {
      tab.items.forEach((item) => {
        links.push({
          href: item.href,
          title: item.name,
          // icon: getIcon(item.icon),
        });
      });
    });
    return links;
  }, [visibleMenuTabs]);

  // useEffect(() => {
  //   if (
  //     status === "unauthenticated" &&
  //     pathname !== "/login" &&
  //     !pathname.startsWith("/api/auth")
  //   ) {
  //     router.push("/login");
  //   }
  // }, [status, router, pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // if (status === "loading") {
  //   return (
  //     <nav className=" top-0 border-b shadow-sm bg-background/80 backdrop-blur-md z-50 absolute">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="flex justify-between h-16 items-center">
  //           <div className="flex items-center">
  //             <span className="text-xl font-bold">TYSN</span>
  //           </div>
  //           <div className="h-8 w-36 bg-muted rounded animate-pulse"></div>
  //         </div>
  //       </div>
  //     </nav>
  //   );
  // }

  return (
    <>
      <AnimatePresence>
        {showFixedNavbar && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }} // slightly slower, smoother
            className="fixed py-2 top-0 w-full z-50 lg:px-10 px-5 bg-[var(--secondary-theme)]"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex justify-between py-2 items-center ">
              <Link
                href="/"
                className="text-base md:text-xl text-[--color-foreground] px-4 py-1 mr-2 border-2 border-white"
              >
                Tasty
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex gap-5 items-center">
                <DesktopNavLinks
                  fixedHeader={showFixedNavbar}
                  visibleMenuTabs={visibleMenuTabs}
                  pathname={pathname}
                />
                <Button className="border-1 border-white bg-transparent">
                  <MdLocationPin size={20} color="white" />

                  <span className="lg:text-base 2xl:text-lg font-medium text-white">
                    Shah Faisal Colony
                  </span>
                </Button>
              </div>

              {/* Mobile Hamburger */}
              <div className="flex lg:hidden gap-5 items-center">
                <Button className="border-1 border-white bg-transparent">
                  <MdLocationPin size={15} color="white" />

                  <span className="text-xs md:text-base lg:text-base 2xl:text-lg font-medium text-white">
                    Shah Faisal Colony
                  </span>
                </Button>

                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground cursor-pointer"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Open main menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6 text-white" />
                  ) : (
                    <Menu className="block h-6 w-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={` absolute py-2 top-0 w-full z-50 px-5  ${
          isMobileMenuOpen ? "bg-(--secondary-theme)" : "backdrop-blur-xs"
        }`}
      >
        <div className="w-full">
          <div className="flex justify-between py-2 items-center">
            <div className="flex items-center ">
              <Link
                // href={session ? "/dashboard" : "/login"}
                href={"/"}
                className="text-base md:text-xl text-[--color-foreground] px-4 py-1 mr-2 border-2 border-white"
              >
                Tasty
              </Link>
            </div>

            {/* {session?.user && ( */}
            <div className="flex items-center justify-end">
              <div className="hidden lg:flex gap-5 items-center">
                <DesktopNavLinks
                  visibleMenuTabs={visibleMenuTabs}
                  pathname={pathname}
                />
                <div className="flex gap-2 items-center">
                  <Button className="border-1 border-white bg-transparent">
                    <MdLocationPin size={20} color="white" />

                    <span className="lg:text-base 2xl:text-lg font-medium text-white">
                      Shah Faisal Colony
                    </span>
                  </Button>
                </div>
              </div>
              <div className={`${visibleMenuTabs.length > 0 ? "ml-6" : ""}`}>
                {/* <UserProfile
                  user={session.user as NextAuthUser & { role: string }}
                /> */}
              </div>
              <div className="flex items-center lg:hidden gap-2">
                <Button className="border-1 border-white bg-transparent">
                  <MdLocationPin size={15} color="white" />

                  <span className="text-xs md:text-base lg:text-base 2xl:text-lg font-medium text-white">
                    Shah Faisal Colony
                  </span>
                </Button>

                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground  cursor-pointer"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Open main menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6 text-white " />
                  ) : (
                    <Menu className="block h-6 w-6 text-white" />
                  )}
                </button>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </nav>
      {/* {session?.user && ( */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden border-t border-border ${"bg-(--secondary-theme)"} fixed top-16 left-0 right-0 z-40`}
            ref={mobileMenuRef}
          >
            <MobileNavMenu
              navLinks={processedMobileNavLinks}
              user={{
                id: "1",
                name: "Saad",
                email: "saad@example.com",
                image: "",
                role: "admin",
              }}
              onCloseMenu={toggleMobileMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* )}  */}
    </>
  );
}

export default Nav;
