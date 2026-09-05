import { Redirect } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BalanceHeader } from "@/features/dashboard/BalanceHeader";
import { CategoryBreakdown } from "@/features/dashboard/CategoryBreakdown";
import { RecentExpenses } from "@/features/dashboard/RecentExpenses";
import { UpcomingPayments } from "@/features/recurring/UpcomingPayments";
import { useSettingsStore } from "@/features/settings/useSettingsStore";

export default function HomeScreen() {
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-xl">
        <BalanceHeader />
        <View className="gap-md px-lg pt-lg">
          <UpcomingPayments />
          <CategoryBreakdown />
          <RecentExpenses />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
