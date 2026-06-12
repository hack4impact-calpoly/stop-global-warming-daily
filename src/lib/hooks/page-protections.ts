import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function useRequireAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/");
      return;
    }

    const check = async () => {
      const email = encodeURIComponent(user.emailAddresses[0].emailAddress);
      const res = await fetch(`/api/user/email/${email}`);
      if (!res.ok) {
        router.replace("/");
        return;
      }

      const userObj = await res.json();
      const mongoUser = Array.isArray(userObj) ? userObj[0] : userObj;
      if (!mongoUser?.role || mongoUser.role === "user") {
        router.replace("/");
      } else {
        setIsAuthorized(true);
      }
    };

    check();
  }, [isLoaded, isSignedIn, user, router]);

  return isAuthorized;
}
