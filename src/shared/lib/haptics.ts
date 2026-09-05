import * as Haptics from "expo-haptics";

export function hapticSuccess(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticImpact(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
