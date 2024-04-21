import { useNavigation } from "@remix-run/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { breakpoints, useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/utils/cn";
import { Form } from "@remix-run/react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

function CookingStep({
  step,
  handleStepChange,
  removeStep,
  index,
}: {
  step: { id: string; text: string };
  handleStepChange: (index: number, step: string) => void;
  removeStep: (index: number) => void;
  index: number;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      id={step.id}
      className="flex gap-4"
      value={step}
      dragListener={false}
      dragControls={dragControls}
    >
      <GripVertical
        className="cursor-grab self-center"
        onPointerDown={(e) => {
          dragControls.start(e);
          e.preventDefault();
        }}
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
  );
}

function Steps() {
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
    <ScrollArea className="lg:-mb-[84px] h-full w-full">
      <Reorder.Group
        axis="y"
        values={steps}
        onReorder={setSteps}
        className="relative mb-4 flex flex-col gap-4 px-1"
      >
        <h3 className="mb-2">Cooking Steps</h3>
        {steps.map((step, index) => (
          <CookingStep
            key={step.id}
            step={step}
            index={index}
            handleStepChange={handleStepChange}
            removeStep={removeStep}
          />
        ))}
      </Reorder.Group>
      <Button className="w-fit" variant="outline" onClick={addNewStep}>
        <Plus className="mr-1 h-4" /> Add step
      </Button>
    </ScrollArea>
  );
}

function TitleAndIngredients() {
  const [ingredients, setIngredients] = useState<
    { name: string; amount: number; weight: string }[]
  >([]);

  const addNewIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: 1, weight: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    name: string,
    amount: number,
    weight: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { name, amount, weight };
    setIngredients(newIngredients);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="mb-2 truncate">Recipe title and description</h3>
        <div>
          <Input name="title" placeholder="Title" />
        </div>
        <div>
          <Textarea name="description" placeholder="Description" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="mt-4 mb-2">Ingredients</h3>
        {ingredients.map((ingredient, index) => (
          <div key={`ingredient-${index + 1}`} className="flex gap-4">
            <Input
              className="basis-2/4"
              name={`ingredient-name-${index + 1}`}
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(
                  index,
                  e.target.value,
                  ingredient.amount,
                  ingredient.weight
                )
              }
            />
            <Input
              className="basis-1/4"
              type="number"
              min={1}
              name={`ingredient-amount-${index + 1}`}
              placeholder="Amount"
            />
            <Input
              className="basis-1/4"
              name={`ingredient-weight-${index + 1}`}
              placeholder="Weight (optional)"
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

export default function NewRecipePage() {
  const width = useWindowWidth();
  const mobileLayout = width < breakpoints.xl;
  const navigation = useNavigation();

  return (
    <div className="flex h-full flex-col">
      <Form
        className="flex grow flex-col"
        method="POST"
        navigate={false}
        action="/recipes"
      >
        <div className="h-full grow">
          <ResizablePanelGroup
            direction={mobileLayout ? "vertical" : "horizontal"}
            className="hidden"
          >
            <ResizablePanel minSize={mobileLayout ? 0 : 30} className="p-4 lg:p-6">
              <TitleAndIngredients />
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className={cn({
                "mx-4": !mobileLayout,
                "my-4": mobileLayout,
              })}
            />
            <ResizablePanel minSize={mobileLayout ? 0 : 30} className="p-4 lg:p-6">
              <Steps />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <footer className="flex justify-center border-t p-2">
          <Button className="ml-auto" type="submit" loading={navigation.state !== "idle"}>
            Save Recipe
          </Button>
        </footer>
      </Form>
    </div>
  );
}
