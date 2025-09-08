// src/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import {
  MdSpaceDashboard,
  MdOutlineRestaurantMenu,
  MdAdd,
  MdInfoOutline,
  MdPhone,
  MdAdminPanelSettings,
  MdLocationPin,
} from "react-icons/md";
import { useLocationStore } from "@/lib/store/locationStore";
import LocationModal from "./Modals/LocationModal";
import { Truck, Store } from "lucide-react";
import { addToast } from "@heroui/react";
import { useCartStore } from "@/lib/store/cartStore";
import CustomModal from "./Modals/Modal";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { MobileNavLinks } from "./MobileNavLinks";
import LoadingScreen from "./Loading";
import LoginModal from "./Modals/LoginModal";

// --- Type Definitions (Re-added as inline types) ---
// Icon mapping
const Icons: Record<string, React.ComponentType<{ size?: number }>> = {
  MdSpaceDashboard,
  MdOutlineRestaurantMenu,
  MdAdd,
  MdInfoOutline,
  MdPhone,
  MdAdminPanelSettings,
};

interface MenuLinkType {
  id: string;
  name: string;
  href: string;
  icon: string;
  order: number;
  roles: string[];
}

interface ProcessedMobileNavItem {
  href: string;
  title: string;
  icon: React.ReactNode;
}

export async function getMenuLinksForRole(
  role: string
): Promise<MenuLinkType[]> {
  try {
    const response = await fetch(`/api/menu-links?role=${role}`);
    if (!response.ok) {
      throw new Error("Failed to fetch menu links");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu links:", error);
    return [];
  }
}

// --- Main Nav Component ---
export function Nav() {
  const pathname = usePathname();
  const { selectedLocation, deliveryMode, setDeliveryMode } =
    useLocationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [menuLinks, setMenuLinks] = useState<MenuLinkType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    async function fetchMenuLinks() {
      setLoading(true); // start loading
      try {
        const role = session?.user?.role || "user";
        const links = await getMenuLinksForRole(role);
        setMenuLinks(links);
      } catch (error) {
        // handle error if needed
        setMenuLinks([]);
      } finally {
        setLoading(false); // stop loading
      }
    }

    fetchMenuLinks();
  }, [session?.user?.role]);

  const [showFixedNavbar, setShowFixedNavbar] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
    onclose: () => {},
  });

  const { items, clearCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setShowFixedNavbar(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Convert menu links to the format expected by components

  const processedMenuLinks = useMemo(() => {
    return menuLinks.map((link) => {
      const IconComponent = Icons[link.icon];
      return {
        ...link,
        icon: IconComponent ? <IconComponent size={20} /> : null,
      };
    });
  }, [menuLinks]);

  const processedMobileNavLinks = useMemo(() => {
    const links: ProcessedMobileNavItem[] = [];
    processedMenuLinks.forEach((link) => {
      links.push({
        href: link.href,
        title: link.name,
        icon: link.icon,
      });
    });
    return links;
  }, [processedMenuLinks]);

  const handleResetCart = (mode: "delivery" | "pickup") => {
    setDeliveryMode(mode);
    clearCart();
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
      onclose: () => {},
    });
    addToast({
      title: `Switched to ${mode === "delivery" ? "Delivery" : "Pickup"} Mode`,
      color: "success",
    });
  };

  const handleDeliveryToggle = (mode: "delivery" | "pickup") => {
    setShowModal({
      open: true,
      title: `Switch to ${mode === "delivery" ? "Delivery" : "Pickup"} Mode?`,
      description: `${
        items.length > 0 ? "Your Cart will be reset. " : ""
      }Are you sure you want to switch to ${
        mode === "delivery" ? "Delivery" : "Pickup"
      } Mode?`,
      button: "Switch Mode",
      onclose: () => {},
    });
  };

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

  return (
    <>
      {loading ? (
        <LoadingScreen showLoading={loading} />
      ) : (
        <>
          <LocationModal
            isOpen={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            title="Select Your Location"
            description="Please select your location"
          />
          <AnimatePresence>
            {showFixedNavbar && (
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed py-2 top-0 w-full z-50 px-5 bg-[var(--secondary-theme)]"
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
                      menuLinks={processedMenuLinks}
                      pathname={pathname}
                    />
                    {deliveryMode === "delivery" && (
                      <Button
                        className="border-1 border-white bg-transparent"
                        onPress={() => setShowLocationModal(true)}
                      >
                        <MdLocationPin size={20} color="white" />
                        <span className="text-sm lg:text-base 2xl:text-lg font-medium text-white">
                          {selectedLocation || "Select"}
                        </span>
                      </Button>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleDeliveryToggle("delivery")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                          deliveryMode === "delivery"
                            ? "bg-theme text-white border-theme"
                            : "bg-transparent text-white border-gray-300"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <div
                        onClick={() => handleDeliveryToggle("pickup")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                          deliveryMode === "pickup"
                            ? "bg-theme text-white border-theme"
                            : "bg-transparent text-white border-gray-300"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:hidden gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => {
                          if (deliveryMode === "pickup") {
                            // Switch to delivery mode
                            handleDeliveryToggle("delivery");
                          } else {
                            // Already in delivery mode, open location modal
                            setShowLocationModal(true);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 max-w-30 rounded-md cursor-pointer border transition-all ${
                          deliveryMode === "delivery"
                            ? " text-white border-theme"
                            : "bg-transparent text-white border-gray-300 hover:border-theme"
                        }`}
                      >
                        {deliveryMode === "pickup" && (
                          <Truck className="w-4 h-4" />
                        )}
                        {deliveryMode === "delivery" && (
                          <>
                            <MdLocationPin size={16} />
                            <span className="text-sm line-clamp-1 lg:text-base 2xl:text-lg font-medium">
                              {selectedLocation || "Select"}
                            </span>
                          </>
                        )}
                      </div>
                      <div
                        onClick={() => handleDeliveryToggle("pickup")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                          deliveryMode === "pickup"
                            ? "bg-theme text-white border-theme"
                            : "bg-transparent text-white border-gray-300"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Mobile Hamburger */}
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
            className={`absolute py-2 top-0 w-full z-50 px-5  ${
              isMobileMenuOpen ? "bg-(--secondary-theme)" : "backdrop-blur-xs"
            }`}
          >
            <div className="flex justify-between py-2 items-center ">
              <Link
                href="/"
                className="text-base md:text-xl text-[--color-foreground] px-2 sm:px-4 py-1 mr-2 border-2 border-white"
              >
                Tasty
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex gap-5 items-center">
                <DesktopNavLinks
                  fixedHeader={showFixedNavbar}
                  menuLinks={processedMenuLinks}
                  pathname={pathname}
                />
                {deliveryMode === "delivery" && (
                  <Button
                    className="border-1 border-white bg-transparent"
                    onPress={() => setShowLocationModal(true)}
                  >
                    <MdLocationPin size={20} color="white" />
                    <span className="lg:text-base 2xl:text-lg font-medium text-white">
                      {selectedLocation || "Select"}
                    </span>
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => handleDeliveryToggle("delivery")}
                    className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                      deliveryMode === "delivery"
                        ? "bg-theme text-white border-theme"
                        : "bg-transparent text-white border-gray-300"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div
                    onClick={() => handleDeliveryToggle("pickup")}
                    className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                      deliveryMode === "pickup"
                        ? "bg-theme text-white border-theme"
                        : "bg-transparent text-white border-gray-300"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Mobile Hamburger */}
              <div className="flex lg:hidden gap-2 items-center">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      if (deliveryMode === "pickup") {
                        // Switch to delivery mode
                        handleDeliveryToggle("delivery");
                      } else {
                        // Already in delivery mode, open location modal
                        setShowLocationModal(true);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 max-w-30 rounded-md cursor-pointer border transition-all ${
                      deliveryMode === "delivery"
                        ? " text-white border-theme"
                        : "bg-transparent text-white border-gray-300 hover:border-theme"
                    }`}
                  >
                    {deliveryMode === "pickup" && <Truck className="w-4 h-4" />}
                    {deliveryMode === "delivery" && (
                      <>
                        <MdLocationPin size={16} />
                        <span className="text-sm line-clamp-1 lg:text-base 2xl:text-lg font-medium">
                          {selectedLocation || "Select"}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    onClick={() => handleDeliveryToggle("pickup")}
                    className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border ${
                      deliveryMode === "pickup"
                        ? "bg-theme text-white border-theme"
                        : "bg-transparent text-white border-gray-300"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                </div>

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
          </nav>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden border-t border-border bg-(--secondary-theme) fixed top-16 left-0 right-0 z-20"
                ref={mobileMenuRef}
              >
                <MobileNavLinks
                  navLinks={processedMobileNavLinks}
                  user={{
                    id: session?.user?.id || "1",
                    name: session?.user?.name || "Guest",
                    email: session?.user?.email || "",
                    image: session?.user?.image || "",
                    role: session?.user?.role || "user",
                  }}
                  onCloseMenu={toggleMobileMenu}
                  setShowLogin={(val) => setShowLogin(val)}
                />
              </motion.div>
            )}

            {showModal.open && (
              <CustomModal
                onClose={() =>
                  setShowModal({
                    open: false,
                    title: "",
                    description: "",
                    button: "",
                    onclose: () => {},
                  })
                }
                isOpen={showModal.open}
                title={showModal.title}
                description={showModal.description}
              >
                <Button
                  color="warning"
                  variant="flat"
                  onPress={() =>
                    handleResetCart(
                      deliveryMode === "delivery" ? "pickup" : "delivery"
                    )
                  }
                >
                  {showModal.button}
                </Button>
                <Button
                  color="default"
                  onPress={() =>
                    setShowModal({
                      open: false,
                      title: "",
                      description: "",
                      button: "",
                      onclose: () => {},
                    })
                  }
                >
                  Close
                </Button>
              </CustomModal>
            )}
          </AnimatePresence>
          {showLogin && (
            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
          )}
        </>
      )}
    </>
  );
}

export default Nav;
