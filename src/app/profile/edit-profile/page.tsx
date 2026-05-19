"use client";

import { Box, Button, HStack, Image, Switch, Text, VStack } from "@chakra-ui/react";
import { LuChevronLeft } from "react-icons/lu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IUsers } from "@/database/userSchema";
import { useRouter } from "next/navigation";
import ProfileDetailsForm, { ProfileDetailsValue } from "@/components/ProfileDetailsForm";
import ProfileInterestsForm from "@/components/ProfileInterestsForm";
import { findLocation } from "@/lib/findLocation";

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);

  const [profileDetails, setProfileDetails] = useState<ProfileDetailsValue>({
    birthday: undefined,
    locationName: "",
    locationCoordinates: [],
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(false);

  const [errors, setErrors] = useState({
    birthday: "",
    location: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const getUser = async () => {
      if (!user || !isSignedIn) return;

      const email = encodeURIComponent(user.emailAddresses[0].emailAddress);

      const res = await fetch(`/api/user/email/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setUserData(null);
        return;
      }

      const userObj: IUsers = await res.json();
      setUserData(userObj);

      setProfileDetails({
        birthday: userObj.birthday ? new Date(userObj.birthday) : undefined,
        locationName: userObj.locationName || "",
        locationCoordinates: userObj.locationCoordinates || [],
      });

      setInterests(userObj.interests || []);
    };

    if (!isLoaded) return;
    getUser();
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async () => {
    setErrors({
      birthday: "",
      location: "",
    });

    if (!profileDetails.birthday) {
      setErrors((prev) => ({
        ...prev,
        birthday: "Please select your full birthday.",
      }));
      return;
    }

    if (!profileDetails.locationName.trim()) {
      setErrors((prev) => ({
        ...prev,
        location: "Please enter a location.",
      }));
      return;
    }

    try {
      setIsSaving(true);

      let finalLocationName = profileDetails.locationName;
      let finalLocationCoordinates = profileDetails.locationCoordinates;

      // If the user typed a location but did not click the pin,
      // find the coordinates before saving.
      if (finalLocationCoordinates.length === 0) {
        const result = await findLocation(profileDetails.locationName);

        if (!result) {
          setErrors((prev) => ({
            ...prev,
            location: "Please choose a valid location.",
          }));
          return;
        }

        finalLocationName = result.locationName;
        finalLocationCoordinates = result.locationCoordinates;

        setProfileDetails((prev) => ({
          ...prev,
          locationName: result.locationName,
          locationCoordinates: result.locationCoordinates,
        }));
      }

      const email = encodeURIComponent(user?.emailAddresses[0].emailAddress || "");

      const res = await fetch(`/api/user/${userData?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthday: profileDetails.birthday,
          locationName: finalLocationName,
          locationCoordinates: finalLocationCoordinates,
          interests,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile.");
      }

      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="center" h={"100%"} w={"100%"}>
      <VStack align="stretch" w="full" gap={2} p={5}>
        {/* Header */}
        <HStack position={"sticky"} gap={3}>
          <Link href="/profile" style={{ display: "flex", alignItems: "center" }}>
            <LuChevronLeft size={28} />
          </Link>
          <Text fontWeight="semibold" fontSize="4xl">
            Edit Profile
          </Text>
        </HStack>

        <VStack align="stretch" w="full" gap={6} px={5} pt={8} pb={8}>
          {/* Profile Info */}
          <VStack align="center" gap={3}>
            <Box w="88px" h="88px" borderRadius="full" overflow="hidden" bg="#E8F1F8">
              <Image
                src={
                  userData?.picture ? `${userData.picture}` : "/images/profile-pictures/profile-picture-8.svg" // default to blue
                }
                alt="Profile picture"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>

            <VStack gap={0}>
              <Text fontSize="20px" fontWeight="semibold">
                {userData?.name || user?.fullName}
              </Text>

              <Text fontSize="14px" color="#A9AEB1">
                {user?.emailAddresses[0].emailAddress}
              </Text>
            </VStack>
          </VStack>

          <ProfileDetailsForm
            value={profileDetails}
            onChange={setProfileDetails}
            errors={errors}
            onClearError={(field) => {
              setErrors((prev) => ({
                ...prev,
                [field]: "",
              }));
            }}
          />

          <ProfileInterestsForm selectedInterests={interests} onInterestsChange={setInterests} />

          {/* Notifications */}
          <HStack w="100%" justify="space-between" py={2}>
            <VStack align="start" gap={0}>
              <Text fontSize="16px" fontWeight="semibold">
                Notifications
              </Text>

              <Text color="#A9AEB1" fontSize="12px"></Text>
            </VStack>

            <Switch.Root checked={notifications} onCheckedChange={(e) => setNotifications(e.checked)}>
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </HStack>

          <Button
            p={"15px 40px"}
            h={"45px"}
            borderRadius={8}
            bg="#64B9FF"
            color="white"
            border={"1px solid #64B9FF"}
            loading={isSaving}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
