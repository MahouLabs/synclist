import { Card } from "./ui/card";

type RecipeCardProps = {
  variant: "default" | "compact";
};

export function RecipeCard({ variant = "default" }: RecipeCardProps) {
  return <Card></Card>;
}
