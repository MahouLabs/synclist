import { customAlphabet } from "nanoid";
export const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

const prefixes = {
  home: "home",
  recipe: "recp",
} as const;

export const createId = (prefix: keyof typeof prefixes) =>
  [prefixes[prefix], nanoid(20)].join("_");
