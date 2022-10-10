import * as React from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark" | Appearance.AppearancePreferences;

interface ITheme {
  mode: Theme;
}

export const initialThemeState: ITheme = {
  mode: Appearance.getColorScheme() || "light",
};

export const ThemeContext = React.createContext<{
  theme: ITheme;
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
}>({
  theme: {
    ...initialThemeState,
  },
  setTheme: () => {},
});

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = React.useState<ITheme>({
    ...initialThemeState,
  });

  React.useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(() => ({
        mode: colorScheme || "light",
      }));
    });
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
