import { cx, type CxOptions } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export function cn(...classNames: CxOptions) {
  return twMerge(cx(classNames));
}
