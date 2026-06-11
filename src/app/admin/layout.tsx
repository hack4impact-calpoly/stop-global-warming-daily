"use client";
import { useRequireAdmin } from "@/lib/hooks/page-protections";
import { Box, Spinner } from "@chakra-ui/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = useRequireAdmin();

  if (!isAuthorized) {
    return (
      <Box display="flex" justifyContent="center" pt={20}>
        <Spinner />
      </Box>
    );
  }

  return <>{children}</>;
}
