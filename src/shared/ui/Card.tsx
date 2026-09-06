import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

type Props = ViewProps & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: Props) {
  const classes = `rounded-2xl border border-border bg-surface p-md ${className ?? ""}`;
  return (
    <View className={classes} {...props}>
      {children}
    </View>
  );
}
