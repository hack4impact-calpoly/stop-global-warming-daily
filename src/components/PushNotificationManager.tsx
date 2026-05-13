"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "app/actions";
import { IUsers } from "@/database/userSchema";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type PushNotificationManagerProps = {
  userData: IUsers;
  setUserData: React.Dispatch<React.SetStateAction<IUsers | null>>;
};

export default function PushNotificationManager({ userData, setUserData }: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    setSubscription(sub);

    const json = sub.toJSON();

    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      throw new Error("Invalid push subscription");
    }

    const payload = {
      endpoint: json.endpoint,
      keys: {
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
    };

    await subscribeUser(payload);

    // PATCH/PUT call

    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationsAsked: true, notificationsEnabled: true }),
      });

      if (!res.ok) throw new Error("Failed to subscribe to notifications :(");
    } catch (error) {
      console.error("Caught error in subscribing: ", error);
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            notificationsAsked: true,
            notificationsEnabled: true,
          }
        : prev,
    );
  }

  async function noNotifications() {
    // PATCH the user to set askNotifications to true

    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationsAsked: true, notificationsEnabled: false }),
      });

      if (!res.ok) throw new Error("Failed to subscribe to notifications :(");
    } catch (error) {
      console.error("Caught error in subscribing: ", error);
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            notificationsAsked: true,
            notificationsEnabled: false,
          }
        : prev,
    );
  }

  async function unsubscribeFromPush() {
    if (!subscription) return;

    const endpoint = subscription.endpoint;

    await subscription.unsubscribe();
    setSubscription(null);

    await unsubscribeUser(endpoint);
  }

  async function sendTestNotification() {
    console.log(subscription);
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      <p>Would you like to subscribe to push notifications?</p>
      <button onClick={subscribeToPush}>Subscribe</button>
      <button onClick={noNotifications}>No Thanks</button>
    </div>
  );
}

/*
 {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
*/
