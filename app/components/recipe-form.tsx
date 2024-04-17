import { Form } from "@remix-run/react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
// import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

type Ingredient = { name: string; amount: number };

export function RecipeForm() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: 0 }]);
  const [steps, setSteps] = useState([{ id: nanoid(5), text: "" }]);

  const addNewIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: 0 }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, name: string, amount: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { name, amount };
    setIngredients(newIngredients);
  };

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
    <Form className="h-full" method="POST" navigate={false}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={30} className="px-1">
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
            {ingredients.map((ingredient, index) => (
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
        </ResizablePanel>
        <ResizableHandle withHandle className="mx-4" />
        <ResizablePanel minSize={30} className="">
          {/* <ScrollArea> */}
          <Reorder.Group
            axis="y"
            values={steps}
            onReorder={setSteps}
            className="relative flex flex-col gap-4 px-1 mb-4"
          >
            <h3 className="mb-2">Cooking Steps</h3>
            {steps.map((step, index) => (
              <Reorder.Item key={step.id} className="flex gap-4" value={step}>
                <GripVertical className="cursor-grab self-center" />
                <Textarea
                  className="flex-1"
                  name={`step-${index + 1}`}
                  placeholder={`Step ${index + 1}`}
                  value={step.text}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={() => removeStep(index)}
                >
                  <Trash className="h-4" />
                </Button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <Button className="w-fit" variant="outline" onClick={addNewStep}>
            <Plus className="mr-1 h-4" /> Add step
          </Button>
          <Button className="absolute right-4 bottom-4">Save Recipe</Button>
          {/* </ScrollArea> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </Form>
  );
}
