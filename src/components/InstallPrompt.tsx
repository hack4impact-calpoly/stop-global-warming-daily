"use client";

import { IUsers } from "@/database/userSchema";
import { useState, useEffect } from "react";
import { HStack, VStack, Text, Heading, Button } from "@chakra-ui/react";

type InstallPromptProps = {
  userData: IUsers;
  setUserData: React.Dispatch<React.SetStateAction<IUsers | null>>;
};

export default function InstallPrompt({ userData, setUserData }: InstallPromptProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  async function handleInstall() {
    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationAsked: true, installed: true }),
      });

      if (!res.ok) throw new Error("Failed to update install :(");
    } catch (error) {
      console.error("Caught error in subscribing: ", error);
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            installationAsked: true,
            installed: false,
          }
        : prev,
    );
  }

  async function noInstallation() {
    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationAsked: true, installed: false }),
      });

      if (!res.ok) throw new Error("Failed to subscribe to notifications :(");
    } catch (error) {
      console.error("Caught error in subscribing: ", error);
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            installationAsked: true,
            installed: false,
          }
        : prev,
    );
  }

  return (
    <VStack
      align="left"
      marginTop={5}
      padding={3}
      background="white"
      borderWidth={1}
      borderRadius={"md"}
      borderColor="black"
    >
      {" "}
      <Heading>Install App</Heading>
      <Text>Add to Home Screen</Text>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
      <Button background="#2e86f2" onClick={handleInstall}>
        Yep, I Installed!
      </Button>
      <Button background="#2e86f2" onClick={noInstallation}>
        No Thanks
      </Button>
    </VStack>
  );
}
