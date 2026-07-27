import { PawPrint } from "lucide-react-native";
import { View } from "react-native";

export default function PawDecoration() {
  return (
    <View>

      <PawPrint
        size={28}
        color="#DCCEFF"
        style={{
          position: "absolute",
          top: 50,
          left: 25,
        }}
      />

      <PawPrint
        size={20}
        color="#E8DEFF"
        style={{
          position: "absolute",
          top: 100,
          right: 35,
        }}
      />

      <PawPrint
        size={18}
        color="#EFE8FF"
        style={{
          position: "absolute",
          bottom: 180,
          left: 35,
        }}
      />

    </View>
  );
}