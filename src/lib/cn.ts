import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge<"type-style">({
  extend: {
    theme: {
      spacing: ["control", "control-px", "control-gap", "row", "group", "section"],
      radius: ["control", "panel"],
      shadow: ["raised", "overlay"],
    },
    classGroups: {
      "type-style": [
        { type: ["display", "title", "heading", "body", "label", "caption", "eyebrow"] },
      ],
    },
  },
});

export function cn(...values: ClassValue[]) {
  return merge(clsx(values));
}
