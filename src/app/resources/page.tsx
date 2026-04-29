"use client";

import { useMemo, useState } from "react";
import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { LuBell, LuSearch } from "react-icons/lu";
import ResourceListCard from "@/components/ResourceListCard";

type ResourcesTab = "discover" | "saved";

interface ExampleResource {
  id: string;
  title: string;
  description: string;
  interestTags: string[];
}

const EXAMPLE_RESOURCES: ExampleResource[] = [
  {
    id: "energy-saving",
    title: "Resource Title",
    interestTags: ["Energy Saving"],
    description:
      "Resource Description. Learn simple ways to reduce electricity use at home, lower your utility bill, and make everyday choices that help limit your carbon footprint.",
  },
  {
    id: "shopping",
    title: "Resource Title",
    interestTags: ["Shopping"],
    description:
      "Resource Description. Find lower-waste shopping habits, reusable swaps, and sustainable purchasing tips for everyday items.",
  },
  {
    id: "waste-reduction",
    title: "Resource Title",
    interestTags: ["Waste Reduction"],
    description:
      "Resource Description. Explore practical ways to reduce household waste, reuse materials, and recycle more effectively.",
  },
  {
    id: "nature-preservation",
    title: "Resource Title",
    interestTags: ["Nature Preservation & Restoration"],
    description:
      "Resource Description. Discover local and everyday actions that support native plants, habitat restoration, and healthier outdoor spaces.",
  },
  {
    id: "transportation",
    title: "Resource Title",
    interestTags: ["Transportation"],
    description:
      "Resource Description. Compare transportation choices that can reduce emissions, including walking, biking, public transit, and carpooling.",
  },
];

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
  const [activeTab, setActiveTab] = useState<ResourcesTab>("discover");
  const [query, setQuery] = useState("");
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([
    "energy-saving",
    "shopping",
    "waste-reduction",
    "nature-preservation",
  ]);

  const visibleResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return EXAMPLE_RESOURCES;

    return EXAMPLE_RESOURCES.filter((resource) => {
      const searchableText = [resource.title, resource.description, ...resource.interestTags].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  const savedResources = visibleResources.filter((resource) => savedResourceIds.includes(resource.id));

  const handleSave = (resourceId: string) => {
    setSavedResourceIds((currentIds) => {
      if (currentIds.includes(resourceId)) return currentIds;
      return [...currentIds, resourceId];
    });
  };

  const handleDelete = (resourceId: string) => {
    setSavedResourceIds((currentIds) => currentIds.filter((id) => id !== resourceId));
  };

  const resourcesToShow = activeTab === "discover" ? visibleResources : savedResources;

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
        <Text fontSize="4xl" letterSpacing="-0.05em" whiteSpace="nowrap" fontWeight={"semibold"} pb={4}>
          Resources
        </Text>
        <Box maxW="560px" mx="auto">
          <HStack
            mb={5}
            flex={1}
            h="56px"
            bg="white"
            borderRadius="full"
            px={6}
            boxShadow="0px 1px 8px rgba(89, 91, 98, 0.08)"
            border="1px solid #EEF0F2"
          >
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              border="none"
              outline="none"
              fontSize="lg"
              _focusVisible={{ boxShadow: "none" }}
            />
            <LuSearch size={32} color="black" />
          </HStack>

          <HStack mb={6}>
            <ResourcesTabButton
              label="Discover"
              active={activeTab === "discover"}
              onClick={() => setActiveTab("discover")}
            />
            <ResourcesTabButton label="Saved" active={activeTab === "saved"} onClick={() => setActiveTab("saved")} />
          </HStack>

          {activeTab === "discover" && (
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
                Featured Resource
              </Text>
              <Text fontSize="md" color="black">
                Resource Description
              </Text>
            </Box>
          )}

          <VStack align="stretch" gap={5}>
            {resourcesToShow.map((resource) => (
              <ResourceListCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                interestTags={resource.interestTags}
                variant={activeTab}
                onSave={() => handleSave(resource.id)}
                onDelete={() => handleDelete(resource.id)}
              />
            ))}

            {resourcesToShow.length === 0 && (
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
