"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import ResourceListCard from "@/components/ResourceListCard";
import SearchBar from "@/components/SearchBar";
import { IUsers } from "@/database/userSchema";

type ResourcesTab = "discover" | "saved";

type Resource = {
  _id: string;
  title: string;
  description: string;
  location: string;
  link: string;
  tags: string[];
  createdAt?: string;
};

interface ResourcesTabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function ResourcesTabButton({ label, active, onClick }: ResourcesTabButtonProps) {
  return (
    <Box as="button" flex={1} pb={2} cursor="pointer" onClick={onClick}>
      <VStack gap={2}>
        <Text fontSize="xl" fontWeight="bold" color="black">
          {label}
        </Text>
        <Box h="4px" w="132px" borderRadius="full" bg={active ? "#4AAAF7" : "transparent"} />
      </VStack>
    </Box>
  );
}

export default function Page() {
  const { user, isSignedIn, isLoaded } = useUser();

  const [activeTab, setActiveTab] = useState<ResourcesTab>("discover");
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState<IUsers | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setUserData(null);
        setIsLoadingSaved(false);
        return;
      }

      try {
        const email = encodeURIComponent(user.emailAddresses[0].emailAddress);
        const res = await fetch(`/api/user/email/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setUserData(null);
          setIsLoadingSaved(false);
          return;
        }

        const userObj: IUsers = await res.json();
        setUserData(userObj);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUserData(null);
        setIsLoadingSaved(false);
      }
    };

    getUser();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);

      try {
        const res = await fetch("/api/resource", {
          method: "GET",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data: Resource[] = await res.json();

        const sortedResources = [...data].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

        setResources(sortedResources);
      } catch (error) {
        console.error("Failed to load resources:", error);
        setResources([]);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const fetchSavedResources = async () => {
      if (!userData?._id) {
        setSavedResourceIds([]);
        setIsLoadingSaved(false);
        return;
      }

      setIsLoadingSaved(true);

      try {
        const res = await fetch(`/api/savedResource/${userData._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 404) {
          setSavedResourceIds([]);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch saved resources");
        }

        const data = await res.json();
        const ids = Array.isArray(data.resource_ids) ? data.resource_ids.map(String) : [];
        setSavedResourceIds(ids);
      } catch (error) {
        console.error("Failed to load saved resources:", error);
        setSavedResourceIds([]);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    fetchSavedResources();
  }, [userData]);

  const visibleResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return resources;

    return resources.filter((resource) => {
      const searchableText = [
        resource.title,
        resource.description,
        resource.location,
        resource.link,
        ...(resource.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, resources]);

  const savedResources = useMemo(
    () => visibleResources.filter((resource) => savedResourceIds.includes(resource._id)),
    [visibleResources, savedResourceIds],
  );

  const featuredResource = visibleResources[0] ?? null;
  const resourcesToShow = activeTab === "discover" ? visibleResources : savedResources;

  const handleSave = async (resourceId: string) => {
    if (!userData?._id) return;

    const previousIds = savedResourceIds;

    if (savedResourceIds.includes(resourceId)) return;

    setSavedResourceIds((currentIds) => [...currentIds, resourceId]);

    try {
      const patchRes = await fetch(`/api/savedResource/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          action: "add",
        }),
      });

      if (patchRes.status === 404) {
        const createRes = await fetch("/api/savedResource", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: String(userData._id),
            resource_ids: [resourceId],
          }),
        });

        if (!createRes.ok) {
          throw new Error("Failed to create saved resources");
        }

        return;
      }

      if (!patchRes.ok) {
        throw new Error("Failed to save resource");
      }
    } catch (error) {
      console.error("Failed to save resource:", error);
      setSavedResourceIds(previousIds);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!userData?._id) return;

    const previousIds = savedResourceIds;
    setSavedResourceIds((currentIds) => currentIds.filter((id) => id !== resourceId));

    try {
      const res = await fetch(`/api/savedResource/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          action: "remove",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete saved resource");
      }
    } catch (error) {
      console.error("Failed to delete saved resource:", error);
      setSavedResourceIds(previousIds);
    }
  };

  const showEmptyState = !isLoadingResources && !isLoadingSaved && resourcesToShow.length === 0;

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
        <Text fontSize="4xl" letterSpacing="-0.05em" whiteSpace="nowrap" fontWeight={"semibold"} pb={4}>
          Resources
        </Text>

        <Box w="full">
          <HStack gap={4} mb={8}>
            <SearchBar value={query} onChange={setQuery} />
          </HStack>

          <HStack mb={6}>
            <ResourcesTabButton
              label="Discover"
              active={activeTab === "discover"}
              onClick={() => setActiveTab("discover")}
            />
            <ResourcesTabButton label="Saved" active={activeTab === "saved"} onClick={() => setActiveTab("saved")} />
          </HStack>

          {activeTab === "discover" && featuredResource && (
            <Box
              bg="#EAF4FB"
              borderRadius="26px"
              minH="234px"
              px={8}
              pb={8}
              mb={8}
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Text fontSize="3xl" fontWeight="bold" color="black" lineHeight="1.1">
                {featuredResource.title}
              </Text>
              <Text fontSize="md" color="black">
                {featuredResource.description}
              </Text>
            </Box>
          )}

          <VStack align="stretch" gap={5}>
            {resourcesToShow.map((resource) => (
              <ResourceListCard
                key={resource._id}
                title={resource.title}
                description={resource.description}
                link={resource.link}
                interestTags={resource.tags ?? []}
                variant={activeTab}
                onSave={() => handleSave(resource._id)}
                onDelete={() => handleDelete(resource._id)}
              />
            ))}

            {(isLoadingResources || isLoadingSaved) && (
              <Box
                bg="white"
                borderRadius="20px"
                p={6}
                textAlign="center"
                boxShadow="0px 4px 18px rgba(89, 91, 98, 0.10)"
              >
                <Text fontWeight="semibold" color="black">
                  Loading resources...
                </Text>
              </Box>
            )}

            {showEmptyState && (
              <Box
                bg="white"
                borderRadius="20px"
                p={6}
                textAlign="center"
                boxShadow="0px 4px 18px rgba(89, 91, 98, 0.10)"
              >
                <Text fontWeight="semibold" color="black">
                  No resources found.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
