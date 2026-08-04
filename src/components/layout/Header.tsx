"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Settings,
  ShoppingCart,
  Search,
  ShoppingBag,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Heart,
  UserIcon,
  CreditCard,
  Users,
  ShieldCheck,
  LayoutDashboard,
  House,
} from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuth, useLogout } from "@/src/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useQuery } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/src/modules/system/opration";

interface StoreSettingsQuery {
  getStoreSettings: {
    logoUrl?: string;
    storeName: string;
  } | null;
}

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  // Memoized store values
  const totalItems = useCartStore(
    useCallback((state) => state.getTotalItems(), [])
  );
  const wishlistItems = useWishlistStore(
    useCallback((state) => state.getTotalItems(), [])
  );

  const { data: user, isLoading } = useAuth();
  const { data: categories } = useCategories(["id", "name", "description"]);
  const { data: storeSettings } = useQuery<StoreSettingsQuery>(GET_STORE_SETTINGS);

  // Memoized navigation with active state detection
  const navigation = useMemo(() => {
    const baseNav = [
      {
        name: "Home",
        href: "/",
        isActive: pathname === "/",
        dropdown: undefined,
      },
      {
        name: "Collections",
        href: "/products",
        isActive: pathname.startsWith("/products"),
        dropdown:
          categories?.map((cat) => ({
            name: cat.name,
            href: `/products?category=${cat.name}`,
            description: cat.description || "",
          })) ?? [],
      },
      {
        name: "About",
        href: "/about",
        isActive: pathname.startsWith("/about"),
        dropdown: undefined,
      },
      {
        name: "Track Order",
        href: "/track-order",
        isActive: pathname.startsWith("/track-order"),
        dropdown: undefined,
      },
      {
        name: "Contact",
        href: "/contact",
        isActive: pathname.startsWith("/contact"),
        dropdown: undefined,
      },
    ];
    return baseNav;
  }, [categories, pathname]);

  // Memoized search handler
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, router]
  );

  // Memoized dropdown handlers
  const handleDropdownToggle = useCallback(
    (itemName: string) => {
      setActiveDropdown(activeDropdown === itemName ? null : itemName);
    },
    [activeDropdown]
  );

  const handleDropdownEnter = useCallback((itemName: string) => {
    setActiveDropdown(itemName);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const logout = useLogout("/");

  const Logo = useMemo(
    () => (
      <Link
        href="/"
        className="relative w-40 h-14 lg:w-48 lg:h-24 md:w-40 md:h-20 text-xl font-cormorant font-bold text-secondary flex items-center justify-center"
      >
        {storeSettings?.getStoreSettings?.logoUrl ? (
          <Image
            src={storeSettings.getStoreSettings.logoUrl}
            alt={storeSettings.getStoreSettings.storeName || "Store Logo"}
            fill
            priority
            style={{ objectFit: "contain" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <span className="text-2xl font-bold">{storeSettings?.getStoreSettings?.storeName}</span>
        )}
      </Link>
    ),
    [storeSettings]
  );

  // Memoized mobile menu buttons
  const MobileMenuButtons = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden"
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>
    ),
    [isSearchOpen, isMenuOpen]
  );

  // Memoized cart icon with badge
  const CartIcon = useMemo(
    () => (
      <Link href="/cart">
        <Button
          size="icon"
          className="relative group  bg-background hover:bg-transparent shadow-none hover:shadow-none text-secondary transition-colors "
        >
          <ShoppingBag className="w-5 h-5 text-foreground hover:text-primary" />
          {totalItems > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-primary text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {totalItems}
            </motion.span>
          )}
        </Button>
      </Link>
    ),
    [totalItems]
  );

  // Memoized wishlist icon with badge
  const WishlistIcon = useMemo(
    () => (
      <Link href="/wishlist">
        <Button
          size="icon"
          className="relative group  bg-background hover:bg-transparent shadow-none hover:shadow-none text-secondary transition-colors "
        >
          <Heart className="w-5 h-5 text-foreground hover:text-primary" />
          {wishlistItems > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-primary text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {wishlistItems}
            </motion.span>
          )}
        </Button>
      </Link>
    ),
    [wishlistItems]
  );

  // Memoized user dropdown content
  const UserDropdownContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-border"></div>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="relative group  bg-background hover:bg-transparent shadow-none hover:shadow-none text-secondary transition-colors "
          >
            <UserIcon className="w-5 h-5 text-foreground hover:text-primary" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 bg-background border border-border shadow-lg rounded-xl p-2 mt-2"
          sideOffset={8}
        >
          {user ? (
            <>
              <div className="px-3 py-3 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10  h-10 bg-foreground rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === "ADMIN" ? (
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/account/settings"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>Manage Admin</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/users"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>Users</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/payments"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>Payments</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              ) : (
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/orders"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/settings"
                      className="flex group items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-foreground group-hover:text-primary" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              )}

              <DropdownMenuSeparator className="my-1 bg-border" />

              <div className="py-1">
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </div>
            </>
          ) : (
            <>
              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-3 py-2.5 text-sm font-medium text-primary bg-luxury-600-foreground hover:bg-luxury-600-foreground rounded-lg transition-colors duration-150 cursor-pointer"
                  >
                    Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center px-3 py-2.5 mt-2 text-sm font-medium text-primary border border-border-300 hover:bg-secondary rounded-lg transition-colors duration-150 cursor-pointer"
                  >
                    Create Account
                  </Link>
                </DropdownMenuItem>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [user, isLoading, logout]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background`}
    >
      {/* Main Header - EXACTLY YOUR ORIGINAL STRUCTURE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col sm:flex-row justify-between items-center py-2">
          {/* Logo Section - Same as yours */}
          <div className="flex bg-transparent items-center sm:w-auto w-full space-x-4 justify-between sm:justify-normal sm:border-none group">
            {Logo}
            {MobileMenuButtons}
          </div>

          {/* Search Bar - Desktop - Same as yours */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-2 pl-12 pr-4 border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all duration-300 bg-background/80 backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </form>
          </div>

          {/* Right Side - Same as yours */}
          <div className="flex px-4 py-2 sm:shadow-none sm:border-none border-t border-border shadow-[0_-2px_4px_rgba(0,0,0,0.1)] sm:py-0 sm:px-0 sm:relative bg-background fixed bottom-0 left-0 sm:w-auto w-full items-center md:space-x-4 lg:space-x-4 gap-4 sm:gap-0 sm:justify-end justify-between mt-4 sm:mt-0">
            {/* Delivery Location - Same as yours */}
            {/* Delivery Location */}
            {user?.address && (
              <div className="hidden lg:flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-1 text-primary " />
                <span className="">Deliver To</span>
                <Button
                  variant="ghost"
                  className="flex items-center -ml-2 luxury-text text-primary font-medium hover:text-primary transition-colors"
                >
                  {user.address} <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Mobile Bottom Navigation Bar */}
            <div className="sm:hidden flex items-center justify-around shadow-[0_-2px_6px_rgba(0,0,0,0.1)] w-full absolute bottom-0 left-0 right-0 bg-background border-t border-border  py-2">
              {/* Home */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${pathname === "/"
                  ? "text-primary bg-foreground"
                  : "text-foreground hover:text-primary "
                  }`}
              >
                <House className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">Home</span>
                {pathname === "/" && (
                  <motion.div
                    className="w-1 h-1 bg-primary rounded-full mt-1"
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Wishlist */}
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${pathname === "/wishlist"
                  ? "text-primary bg-foreground "
                  : "text-foreground hover:text-primary "
                  }`}
              >
                <Link
                  href="/wishlist"
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative">
                    <Heart className="w-5 h-5" />
                    {wishlistItems > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 bg-primary text-secondary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {wishlistItems}
                      </motion.span>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">Wishlist</span>
                  {pathname === "/wishlist" && (
                    <motion.div
                      className="w-1 h-1 bg-primary rounded-full mt-1"
                      layoutId="activeDot"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${pathname === "/cart"
                  ? "text-primary bg-foreground "
                  : "text-foreground hover:text-primary "
                  }`}
              >
                <Link
                  href="/cart"
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {totalItems > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 bg-primary text-secondary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">Cart</span>
                  {pathname === "/cart" && (
                    <motion.div
                      className="w-1 h-1 bg-primary rounded-full mt-1"
                      layoutId="activeDot"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Account - Fixed Alignment */}
              <div
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-transparent text-foreground hover:text-primary flex flex-col items-center"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="text-xs mt-1 font-medium">Account</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="center"
                    side="top"
                    className="w-56 bg-background border border-border shadow-lg rounded-xl p-2 mb-2"
                    sideOffset={8}
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-3 border-b border-foreground">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-secondary " />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-secondary truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {user?.role === "ADMIN" ? (
                          <div className="py-1">
                            <DropdownMenuItem asChild>
                              <Link
                                href="/dashboard"
                                className="flex items-center group gap-3 px-3 py-2 text-sm text-foreground hover:bg-foreground hover:text-primary rounded-lg transition-colors duration-150 cursor-pointer"
                              >
                                <LayoutDashboard className="w-4 group-hover:text-primary h-4 text-foreground" />
                                <span>Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                          </div>
                        ) : (
                          <div className="py-1">
                            <DropdownMenuItem asChild>
                              <Link
                                href="/account/orders"
                                className="flex group items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-150 cursor-pointer"
                              >
                                <ShoppingCart className="w-4 group-hover:text-primary h-4 text-foreground" />
                                <span>My Orders</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/account/settings"
                                className="flex group items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-150 cursor-pointer"
                              >
                                <Settings className="w-4 group-hover:text-primary h-4 text-foreground" />
                                <span>Settings</span>
                              </Link>
                            </DropdownMenuItem>
                          </div>
                        )}

                        <DropdownMenuSeparator className="my-1 bg-border" />

                        <div className="py-1">
                          <DropdownMenuItem
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </DropdownMenuItem>
                        </div>
                      </>
                    ) : (
                      <div className="py-1 space-y-1">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/auth/login"
                            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-foreground bg-primary hover:bg-primary rounded-lg transition-colors duration-150 cursor-pointer"
                          >
                            Sign In
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/auth/register"
                            className="flex items-center justify-center px-3 py-2 mt-1 text-sm font-medium text-foreground border border-border hover:bg-accent rounded-lg transition-colors duration-150 cursor-pointer"
                          >
                            Create Account
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Desktop Icons (hidden on mobile) */}
            <div className="hidden bg-transparent sm:flex items-center space-x-2">
              {WishlistIcon}
              {CartIcon}
              <div className="sm:flex">{UserDropdownContent}</div>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop  */}
        <nav className="hidden md:flex bg-transparent items-center justify-center space-x-8 pt-1 pb-4 relative">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() =>
                item.dropdown && handleDropdownEnter(item.name)
              }
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={item.href}
                className={`text-foreground hover:text-primary transition-colors font-medium relative group flex items-center ${item.isActive ? "text-primary font-semibold" : ""
                  }`}
              >
                {item.name}
                {item.dropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${item.isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>

              {/* Dropdown Menu - MOBILE */}
              {item.dropdown && activeDropdown === item.name && (
                <motion.div
                  className="absolute top-full left-0 mt-2 min-w-full bg-background rounded-xl shadow-xl border border-border  p-4 z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid gap-1 overflow-y-auto">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block w-60 p-3 rounded-lg hover:bg-accent hover:text-primary transition-colors group"
                      >
                        <div className="font-medium text-foreground group-hover:text-primary ">
                          {dropdownItem.name}
                        </div>
                        <div className="text-sm text-foreground group-hover:text-primary mt-1">
                          {dropdownItem.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Mobile Search - Same as yours */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="md:hidden pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 pr-4 border border-border  rounded-full focus:ring-2 focus:outline-none focus:ring-primary focus:border-transparent bg-background/80 backdrop-blur-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation - Enhanced with active states */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden pb-4 w-full border-t border-border  pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div>
                      <button
                        onClick={() =>
                          item.dropdown && handleDropdownToggle(item.name)
                        }
                        className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors font-medium"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={
                            item.isActive ? "text-primary font-semibold" : ""
                          }
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                          />
                        )}
                      </button>

                      {/* Mobile Dropdown - Same as yours */}
                      {item.dropdown && activeDropdown === item.name && (
                        <motion.div
                          className="mt-2 ml-4 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block py-2 text-sm text-foreground  hover:text-primary transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {user?.address && (
                  <div className="flex items-center pt-2">
                    <MapPin className="w-4 h-4 mr-1 text-primary " />
                    <span className="mr-1 text-sm">Deliver To</span>
                    <button className="flex items-center luxury-text font-medium text-sm">
                      {user.address} <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
