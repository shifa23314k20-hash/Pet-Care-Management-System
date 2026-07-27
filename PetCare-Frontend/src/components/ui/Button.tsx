import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export default function Button({
  title,
  onPress,
  className = "",
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`w-full ${className}`}
    >
      <LinearGradient
        colors={["#8B6BFF", "#7353F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl h-14 items-center justify-center"
      >
        <Text className="text-white font-bold text-lg">
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}