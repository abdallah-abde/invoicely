type ThemeColors =
  | "Rose"
  | "Blue"
  | "Green"
  | "Orange"
  | "Violet"
  | "Neutral"
  | "Red"
  | "Yellow";
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
