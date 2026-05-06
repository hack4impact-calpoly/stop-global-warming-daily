"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";

const HIDE_NAVBAR_ROUTES = ["/login", "/sign-up"];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const hideByRoute = HIDE_NAVBAR_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const showNavbar = isLoaded && isSignedIn && !hideByRoute;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: showNavbar ? "120px" : "0" }}>
      {children}
      {showNavbar && <Navbar />}
    </div>
  );
}
