"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { useThemeContext } from "@/context/theme-data-provider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableThemeColors = [
  { name: "Neutral", light: "bg-neutral-900", dark: "bg-neutral-700" },
  { name: "Rose", light: "bg-rose-900", dark: "bg-rose-700" },
  { name: "Orange", light: "bg-orange-900", dark: "bg-orange-700" },
  { name: "Blue", light: "bg-blue-900", dark: "bg-blue-700" },
  { name: "Green", light: "bg-green-900", dark: "bg-green-700" },
  { name: "Violet", light: "bg-violet-900", dark: "bg-violet-700" },
  { name: "Red", light: "bg-red-900", dark: "bg-red-700" },
  { name: "Yellow", light: "bg-yellow-900", dark: "bg-yellow-700" },
];

export function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();

  const createSelectItems = () => {
    return availableThemeColors.map(({ name, light, dark }) => (
      <SelectItem key={name} value={name}>
        <div className="flex items-center space-x-0 md:space-x-3">
          <div
            className={cn(
              "rounded-full",
              "w-5",
              "h-5",
              theme === "light" ? light : dark
            )}
          ></div>
          <div className="hidden md:block text-sm text-foreground">{name}</div>
        </div>
      </SelectItem>
    ));
  };

  return (
    <Select
      defaultValue={themeColor}
      onValueChange={(value) => setThemeColor(value as ThemeColors)}
    >
      <SelectTrigger className="w-20 md:w-[180px] ring-offset-transparent focus:ring-transparent">
        <SelectValue placeholder="Select Color" />
      </SelectTrigger>
      <SelectContent className="border-muted">
        {createSelectItems()}
      </SelectContent>
    </Select>
  );
}
