import { breakpoints, useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/utils/cn";
import type { Tables } from "@/utils/supabase.types";
import { Form } from "@remix-run/react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { Textarea } from "./ui/textarea";
// import { ScrollArea } from "./ui/scr

type Ingredient = Omit<Tables<"items">, "home_id">;

type RecipeFormProps = {
  ingredients: Ingredient[];
};

function TitleAndIngredients({ ingredients }: { ingredients: Ingredient[] }) {
  const [items, setItems] = useState<{ name: string; amount: number }[]>([
    { name: "", amount: 0 },
  ]);

  const addNewIngredient = () => {
    setItems((prev) => [...prev, { name: "", amount: 0 }]);
  };

  const removeIngredient = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, name: string, amount: number) => {
    const newIngredients = [...items];
    newIngredients[index] = { name, amount };
    setItems(newIngredients);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="mb-2">Recipe title and description</h3>
        <div>
          <Input name="title" placeholder="Title" />
        </div>
        <div>
          <Textarea name="description" placeholder="Description" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="mt-4 mb-2">Ingredients</h3>
        {items.map((ingredient, index) => (
          <div key={`ingredient-${index + 1}`} className="flex gap-4">
            <Input
              className="basis-2/3"
              name={`ingredient-name-${index + 1}`}
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, e.target.value, ingredient.amount)
              }
            />
            <Input
              className="basis-1/3"
              type="number"
              name={`ingredient-amount-${index + 1}`}
              placeholder="Amount"
            />
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => removeIngredient(index)}
            >
              <Trash className="h-4" />
            </Button>
          </div>
        ))}
        <Button className="w-fit" variant="outline" onClick={addNewIngredient}>
          <Plus className="mr-1 h-4" /> Add ingredient
        </Button>
      </div>
    </>
  );
}

function Steps() {
  const dragControls = useDragControls();
  const [steps, setSteps] = useState([{ id: nanoid(5), text: "" }]);

  const addNewStep = () => {
    setSteps((prev) => [...prev, { id: nanoid(5), text: "" }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, step: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...steps[index], text: step };
    setSteps(newSteps);
  };

  return (
    <>
      {/* <ScrollArea> */}
      <Reorder.Group
        axis="y"
        values={steps}
        onReorder={setSteps}
        className="relative mb-4 flex flex-col gap-4 px-1"
      >
        <h3 className="mb-2">Cooking Steps</h3>
        {steps.map((step, index) => (
          <Reorder.Item
            key={step.id}
            id={step.id}
            className="flex gap-4"
            value={step.id}
            dragListener={false}
            dragControls={dragControls}
          >
            <GripVertical
              className="cursor-grab self-center"
              onPointerDown={(e) => dragControls.start(e)}
            />
            <Textarea
              className="flex-1"
              name={`step-${index + 1}`}
              placeholder={`Step ${index + 1}`}
              value={step.text}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
            <Button variant="outline" className="w-fit" onClick={() => removeStep(index)}>
              <Trash className="h-4" />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button className="w-fit" variant="outline" onClick={addNewStep}>
        <Plus className="mr-1 h-4" /> Add step
      </Button>
    </>
  );
}

export function RecipeForm({ ingredients }: RecipeFormProps) {
  const width = useWindowWidth();

  // TODO show toast or error message somwhere using data.error
  // by now, thats enough to stop redirecting

  return (
    <>
      <Form className="h-full" method="POST" navigate={false} action="/recipes">
        <ResizablePanelGroup
          direction={width >= breakpoints.xl ? "horizontal" : "vertical"}
          className="hidden"
        >
          <ResizablePanel minSize={30} className="px-1">
            <TitleAndIngredients ingredients={ingredients} />
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className={cn({
              "mx-4": width >= breakpoints.xl,
              "my-4": width < breakpoints.xl,
            })}
          />
          <ResizablePanel minSize={30} className="">
            <Steps />
            <Button className="absolute right-4 bottom-4" type="submit">
              Save Recipe
            </Button>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Form>
    </>
  );
}
