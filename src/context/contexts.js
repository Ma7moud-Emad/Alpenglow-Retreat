import { createContext } from "react";

/**
 * Context objects live in a plain module so the provider files can export a
 * component and nothing else, which is what keeps react-refresh able to hot
 * reload them.
 */
export const AuthContext = createContext(null);
export const ThemeContext = createContext(null);
