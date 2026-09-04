import { Pressable, type PressableProps } from "react-native";

import { Text } from "@/components/ui/Text";

type Variant = "primary" | "secondary";

type Props = Omit<PressableProps, "children"> & {
  label: string;
  variant?: Variant;
};

const containerClasses: Record<Variant, string> = {
  primary: "bg-accent",
  secondary: "border border-border bg-surface",
};

const labelClasses: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-text",
};

export function Button({ label, variant = "primary", disabled, className, ...props }: Props) {
  const base = `min-h-11 items-center justify-center rounded-xl px-md ${containerClasses[variant]}`;
  const classes = [base, disabled ? "opacity-50" : "", className].filter(Boolean).join(" ");

  return (
    <Pressable className={classes} disabled={disabled} {...props}>
      <Text variant="subtitle" className={labelClasses[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
