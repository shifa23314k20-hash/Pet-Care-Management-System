import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Screen({ children }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      {children}
    </SafeAreaView>
  );
}