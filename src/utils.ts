import { unsafeCSS, useStyle } from "fuco";

export function useStyleString(style: CSSToString) {
  useStyle(() => unsafeCSS(style.toString()));
}
