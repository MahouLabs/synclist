import type { Tables } from "@/utils/supabase.types";
import { useNavigate } from "@remix-run/react";
import { Card, CardContent, CardHeader } from "./ui/card";

type RecipeCardProps = {
  recipe: Pick<Tables<"recipes">, "id" | "title" | "description">;
  variant?: "compact" | "default";
};

export function RecipeCard({ recipe, variant = "default" }: RecipeCardProps) {
  const navigate = useNavigate();

  if (variant === "compact") {
    return (
      <Card>
        <CardHeader>a</CardHeader>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer select-none"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <CardHeader>
        <h3>{recipe.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="h-[52px] truncate text-muted-foreground">{recipe.description}</p>
      </CardContent>
    </Card>
  );
}
