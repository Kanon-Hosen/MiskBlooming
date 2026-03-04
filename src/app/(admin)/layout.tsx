"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"; // Using primitives directly for stability
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  FileText,
  Truck,
  CreditCard,
  Tag,
  Calendar,
  Ticket,
  List,
  Store,
  GalleryHorizontal,
  ShoppingBagIcon,
  GalleryThumbnails,
  PackageOpen,
  Clock,
  Check,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";

import Loading from "@/src/components/layout/Loading";
import NotificationDropdown from "@/src/components/dashboard/NotificationDropdown";

// --- Navigation Data ---
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    name: "Hero Manage",
    href: "/dashboard/hero",
    icon: GalleryHorizontal,
    description: "Manage Hero Section",
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    description: "Manage Inventory",
  },
  {
    name: "Categories",
    href: "/dashboard/category",
    icon: List,
    description: "Manage Categories",
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    description: "Order Management",
  },
  {
    name: "Sales",
    href: "/dashboard/sales",
    icon: ShoppingBagIcon,
    description: "Local Order Management",
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    description: "Customer Relations",
  },
  {
    name: "Membership",
    href: "/dashboard/membership",
    icon: CreditCard,
    description: "Manage Cards",
  },
  {
    name: "Coupons",
    href: "/dashboard/coupons",
    icon: Ticket,
    description: "Coupon Management",
  },
  {
    name: "Themes",
    href: "/dashboard/themes",
    icon: GalleryThumbnails,
    description: "Manage Pages Content",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "System Configuration",
  },
];

import { useQuery } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/src/modules/system/opration";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data: user, isLoading: isAuthLoading } = useAuth();
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const storeSettings = settingsData?.getStoreSettings;

  const pathname = usePathname();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) return <Loading />;
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border bg-card">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex flex-col">
                {storeSettings?.logoUrl ? (
                  <img
                    src={storeSettings.logoUrl}
                    alt={storeSettings.storeName || "Logo"}
                    className="h-8 object-contain"
                  />
                ) : (
                  <span className="font-cormorant text-2xl font-bold text-primary">
                    {storeSettings?.storeName || "Demo"}
                  </span>
                )}
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 shrink-0 ${isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary"
                      }`}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-[10px] ${isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground/70"
                        }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile (Bottom Sidebar) */}
          <div className="p-4 border-t border-border bg-card">
            <DropdownMenuPrimitive.Root
              open={userMenuOpen}
              onOpenChange={setUserMenuOpen}
            >
              <DropdownMenuPrimitive.Trigger asChild>
                <button className="w-full flex items-center p-2 rounded-xl hover:bg-muted transition-colors outline-none">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="ml-3 flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </DropdownMenuPrimitive.Trigger>

              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  className="z-50 min-w-[14rem] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                  sideOffset={8}
                  align="start"
                >
                  <DropdownMenuPrimitive.Item className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted">
                    <Link href="/" className="flex items-center w-full">
                      <Store className="w-4 h-4 mr-2" /> Visit Store
                    </Link>
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
                  <DropdownMenuPrimitive.Item className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb (Desktop) */}
            <nav className="hidden md:flex items-center text-sm font-medium">
              <span className="text-muted-foreground">Dashboard</span>
              {pathname !== "/dashboard" && (
                <>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-primary capitalize">
                    {pathname.split("/").pop()?.replace("-", " ")}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 pl-9 pr-4 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Notifications Dropdown */}
            <NotificationDropdown />

            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/dashboard/products/add">
                <Button variant="outline" size="sm" className="hidden xl:flex">
                  <Package className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="luxury" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" /> New Order
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <Suspense fallback={<Loading />}>
            {/* <div className="max-w-7xl mx-auto"> */}
            {children}
            {/* </div> */}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
