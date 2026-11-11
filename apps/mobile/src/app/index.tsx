import { Stack } from "expo-router"
import { Text, View } from "react-native"

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
      <Stack.Screen options={{ title: "Zivartexx" }} />
      <Text className="text-center text-2xl font-semibold text-neutral-900 dark:text-white">
        Zivartexx
      </Text>
      <Text className="mt-2 text-center text-base text-neutral-500 dark:text-neutral-400">
        Mobile app is ready. Edit src/app/index.tsx to start building.
      </Text>
    </View>
  )
}
