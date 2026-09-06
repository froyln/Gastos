import type { ReactNode } from "react";
import { Text as RNText, type TextProps } from "react-native";

type Variant = "title" | "subtitle" | "body" | "caption" | "amount" | "amountLarge";

const variantClasses: Record<Variant, string> = {
  title: "text-2xl font-semibold text-text",
  subtitle: "text-base font-medium text-text",
  body: "text-base text-text",
  caption: "text-sm text-muted",
  amount: "text-lg font-bold text-text",
  amountLarge: "text-4xl font-bold text-text",
};

type Props = TextProps & {
  variant?: Variant;
  children: ReactNode;
};

export function Text({ variant = "body", className, children, ...props }: Props) {
  const classes = `${variantClasses[variant]} ${className ?? ""}`;
  return (
    <RNText className={classes} {...props}>
      {children}
    </RNText>
  );
}
