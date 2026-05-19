"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Input, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuSearch, LuPlus } from "react-icons/lu";
import AdminResourceCard from "@/components/AdminResourceCard";

type ResourceResponse = {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  link?: string;
  tags?: string[];
};

type AdminResource = {
  id: string;
  title: string;
  description: string;
  location: string;
  link: string;
  tags: string[];
};

export default function ManageResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/resource", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load resources");
        }

        const resourceData: ResourceResponse[] = await response.json();

        setResources(
          resourceData.map((resource) => ({
            id: resource._id,
            title: resource.title,
            description: resource.description?.trim() || "No description provided.",
            location: resource.location?.trim() || "No location provided.",
            link: resource.link?.trim() || "",
            tags: Array.isArray(resource.tags) ? resource.tags : [],
          })),
        );
      } catch (fetchError) {
        console.error("Failed to load admin resources:", fetchError);
        setResources([]);
        setError("Unable to load resources right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleDeleteResource = async (resourceId: string) => {
    const response = await fetch(`/api/resource/${resourceId}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error ?? "Failed to delete resource.");
    }

    setResources((prevResources) => prevResources.filter((resource) => resource.id !== resourceId));
  };

  const renderResourceContent = () => {
    if (isLoading) {
      return (
        <Text color="gray.500" fontSize="sm">
          Loading resources...
        </Text>
      );
    }

    if (error) {
      return (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      );
    }

    if (resources.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No resources available yet.
        </Text>
      );
    }

    if (filteredResources.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No resources match that title.
        </Text>
      );
    }

    return filteredResources.map((resource) => (
      <AdminResourceCard
        key={resource.id}
        id={resource.id}
        title={resource.title}
        description={resource.description}
        location={resource.location}
        link={resource.link}
        tags={resource.tags}
        onDelete={handleDeleteResource}
      />
    ));
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="160px" position="relative">
        <VStack align="stretch" gap={4}>
          <HStack gap={3}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
              <LuChevronLeft size={28} />
            </Link>

            <Text fontWeight="semibold" fontSize="4xl">
              Resources
            </Text>
          </HStack>

          <Box position="relative">
            <Input
              placeholder="Search for a resource..."
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              bg="gray.200"
              border="none"
              borderRadius="full"
              pr="45px"
            />

            <Box
              position="absolute"
              right="14px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              pointerEvents="none"
            >
              <LuSearch />
            </Box>
          </Box>

          <VStack align="stretch" gap={3}>
            {renderResourceContent()}
          </VStack>
        </VStack>

        <Link href="/admin/manage-resources/new-resource">
          <IconButton
            aria-label="Add resource"
            position="fixed"
            right="24px"
            bottom="96px"
            w="64px"
            h="64px"
            borderRadius="full"
            variant="outline"
            borderColor="blue.300"
            color="blue.300"
            bg="white"
            shadow="md"
            zIndex={30}
          >
            <LuPlus size={28} />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
}
