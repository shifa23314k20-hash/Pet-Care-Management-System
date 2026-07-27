import { TextInput, View } from "react-native";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  return (
    <View className="border border-border rounded-2xl px-4 h-14 justify-center bg-white">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className="text-base"
      />
    </View>
  );
}