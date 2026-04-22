"use server";

type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

webpush.setVapidDetails(
  "<mailto:your-email@example.com>",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: PushSubscriptionPayload) {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      subscription as any, // safe now because we validated shape
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon.png",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
