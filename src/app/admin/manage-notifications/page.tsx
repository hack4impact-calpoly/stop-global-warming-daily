"use client";

import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Text, VStack, HStack, Input, Textarea, Button } from "@chakra-ui/react";
import { LuChevronLeft, LuCheck } from "react-icons/lu";
import { sendNotification } from "@/app/actions";

type NotifFormResponse = {
  _id?: string;
  title?: string;
  description?: string;
};

function NewNotification() {
  const router = useRouter();

  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!header.trim()) {
      setError("Resource name is required.");
      return;
    }

    if (!description.trim()) {
      setError("Resource description is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = sendNotification(header, description);

      router.push("/admin");
      router.refresh();
    } catch (saveError) {
      console.error(`Failed to create notification:`, saveError);
      setError(saveError instanceof Error ? saveError.message : `Failed to create notification.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
        <form onSubmit={handleSend}>
          <VStack align="stretch" gap={6}>
            <HStack gap={3}>
              <Link href="/admin/manage-resources" style={{ display: "flex", alignItems: "center" }}>
                <LuChevronLeft size={28} />
              </Link>
              <Text fontWeight="semibold" fontSize="4xl">
                Send Notification
              </Text>
            </HStack>

            <Box bg="white" borderRadius="xl" p={4} shadow="sm">
              <VStack align="stretch" gap={5}>
                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Header
                  </Text>
                  <Input
                    placeholder="Header for Notification"
                    value={header}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setHeader(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                  />
                </VStack>

                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Notification Description
                  </Text>
                  <Textarea
                    placeholder="Describe your resource..."
                    value={description}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setDescription(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                    resize="none"
                    rows={4}
                  />
                </VStack>

                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
              </VStack>
            </Box>

            <Button
              type="submit"
              maxW="400px"
              w="full"
              variant="outline"
              borderColor="blue.300"
              color="blue.300"
              borderRadius="lg"
              h="52px"
              disabled={isSaving}
            >
              {isSaving ? "Sending..." : "Send"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default function NewResourcePage() {
  return (
    <Suspense fallback={null}>
      <NewNotification />
    </Suspense>
  );
}
