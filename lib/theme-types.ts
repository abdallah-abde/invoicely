type ThemeColors = "Rose" | "Blue" | "Green" | "Orange" | "Violet" | "Neutral";
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
