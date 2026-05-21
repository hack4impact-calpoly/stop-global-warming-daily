import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { ClerkProvider } from "@clerk/nextjs";
import AppShell from "@/components/AppShell";

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "Stop Global Warming Daily",
  description: "A Progressive Web App built with Next.js",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/images/sgwd_app_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Provider>
            <AppShell>{children}</AppShell>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
