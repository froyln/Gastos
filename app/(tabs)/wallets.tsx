import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-lg">
        <Text className="text-xl font-semibold text-text">Wallets</Text>
      </View>
    </SafeAreaView>
  );
}
