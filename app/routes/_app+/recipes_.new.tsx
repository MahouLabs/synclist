import { createClient } from "@/utils/supabase.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData, useSubmit } from "@remix-run/react";

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
import type { Tables } from "@/utils/supabase.types";
import { Form } from "@remix-run/react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

type Item = Omit<Tables<"items">, "home_id">;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { data: items } = await supabase.from("items").select("id, name");
  return { items };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);

  const body = await request.formData();
  return null;
}

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
    // <div className="h-full flex-grow-0">
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
    // </div>
  );
}

function TitleAndIngredients({ items }: { items: Item[] }) {
  const submit = useSubmit();
  // const [items, setItems] = useState<{ name: string; amount: number }[]>([
  //   { name: "", amount: 0 },
  // ]);

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

export default function NewRecipePage() {
  const { items } = useLoaderData<typeof loader>();
  const width = useWindowWidth();
  const mobileLayout = width < breakpoints.xl;

  // TODO show toast or error message somwhere using data.error
  // by now, thats enough to stop redirecting

  return (
    <div className="flex h-full flex-col">
      <Form className="h-full grow" method="POST" navigate={false} action="/recipes">
        <ResizablePanelGroup
          direction={mobileLayout ? "vertical" : "horizontal"}
          className="hidden"
        >
          <ResizablePanel minSize={mobileLayout ? 0 : 30} className="p-4 lg:p-6">
            <TitleAndIngredients items={items} />
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
      </Form>
      <footer className="flex justify-center border-t p-2">
        <Button className="ml-auto" type="submit">
          Save Recipe
        </Button>
      </footer>
    </div>
  );
}
