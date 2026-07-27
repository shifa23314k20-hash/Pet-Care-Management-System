import { Heart, PawPrint } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Logo() {
  return (
    <View className="items-center">

      <View className="h-16 w-16 rounded-full bg-primary items-center justify-center mb-4">

        <View className="flex-row">

          <PawPrint
            color="white"
            size={22}
          />

          <Heart
            color="#37C978"
            fill="#37C978"
            size={14}
            style={{
              position: "absolute",
              right: -8,
              bottom: -2,
            }}
          />

        </View>

      </View>

      <Text className="text-4xl font-extrabold">

        <Text className="text-blue-500">
          Pet
        </Text>

        <Text className="text-green-500">
          Care
        </Text>

      </Text>

    </View>
  );
}