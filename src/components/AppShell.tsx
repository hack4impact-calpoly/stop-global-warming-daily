"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const HIDE_NAVBAR_ROUTES = new Set(["/login", "/sign-up"]);

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !HIDE_NAVBAR_ROUTES.has(pathname);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: showNavbar ? "120px" : "0" }}>
      {children}
      {showNavbar && <Navbar />}
    </div>
  );
}
