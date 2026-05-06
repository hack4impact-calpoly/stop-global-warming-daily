"use server";
import Subscription from "@/database/subscriptionSchema";
import connectDB from "@/database/db";

type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:stopglobalwarming@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: PushSubscriptionPayload) {
  await connectDB();

  const newSubscription = {
    endpoint: sub.endpoint,
    keys: sub.keys,
    // TODO: set this to be actual id
    userId: "0",
  };
  const subCreate = await Subscription.create(newSubscription);

  // subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })

  return { success: true };
}

export async function unsubscribeUser(endpoint: string) {
  await connectDB();

  await Subscription.deleteOne({ endpoint });
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message: string) {
  await connectDB();

  const subscriptions = await Subscription.find({});

  const payload = JSON.stringify({
    title: "Test Notification",
    body: message,
    icon: "/icon.png",
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const pushSub: WebPushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };
      return webpush.sendNotification(pushSub, payload);
    }),
  );

  return { success: true };
}
