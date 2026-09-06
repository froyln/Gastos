import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { currentPeriod } from "@/shared/lib/date";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import type { RecurringPayment } from "@/shared/types";

const CHANNEL_ID = "recurring-payments";

function startId(paymentId: string): string {
  return `recurring-${paymentId}-start`;
}

function endId(paymentId: string): string {
  return `recurring-${paymentId}-end`;
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Recurring payments",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestPermissions(): Promise<boolean> {
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function cancelRecurring(paymentId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(startId(paymentId)).catch(() => undefined);
  await Notifications.cancelScheduledNotificationAsync(endId(paymentId)).catch(() => undefined);
}

export async function scheduleRecurring(payment: RecurringPayment): Promise<void> {
  await cancelRecurring(payment.id);
  if (!payment.active) return;

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;

  await ensureChannel();

  await Notifications.scheduleNotificationAsync({
    identifier: startId(payment.id),
    content: { title: payment.name, body: `Payment window for ${payment.name} is open.` },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      channelId: CHANNEL_ID,
      day: payment.dayStart,
      hour: payment.notificationHour,
      minute: 0,
    },
  });

  const monthStartDay = useSettingsStore.getState().monthStartDay;
  const isPaidThisPeriod = payment.lastPaidPeriod === currentPeriod(monthStartDay);
  if (!isPaidThisPeriod) {
    await Notifications.scheduleNotificationAsync({
      identifier: endId(payment.id),
      content: { title: payment.name, body: `Today is the last day to pay ${payment.name}.` },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        channelId: CHANNEL_ID,
        day: payment.dayEnd,
        hour: payment.notificationHour,
        minute: 0,
      },
    });
  }
}
