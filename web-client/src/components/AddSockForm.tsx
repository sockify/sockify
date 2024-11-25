import { CreateSockRequest, sockSizeEnumSchema } from "@/api/inventory/model";
import { useCreateSockMutation } from "@/api/inventory/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Textarea } from "./ui/textarea";

const availableSizes = sockSizeEnumSchema.options;

export default function AddSockForm({
  onAddSock,
  onClose,
}: {
  onAddSock: () => void;
  onClose?: () => void;
}) {
  const createSockMutation = useCreateSockMutation();
  const [step, setStep] = useState(1);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateSockRequest>({
    defaultValues: {
      sock: {
        name: "",
        description: "",
        previewImageUrl: "",
      },
      variants: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const selectedSizes = watch("variants").map((item) => item.size);
  const nextSizesToSelect = availableSizes.filter(
    (size) => !selectedSizes.includes(size),
  );

  const onSubmit = (data: CreateSockRequest) => {
    createSockMutation.mutate(data, {
      onSuccess: () => {
        onAddSock();
        onClose?.();
      },
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-right text-sm text-muted-foreground">
        Step {step} of 3
      </h2>

      {step === 1 && (
        <div className="space-y-3">
          <Input
            {...register("sock.name", { required: "Name is required" })}
            placeholder="Name"
          />
          {errors.sock?.name && (
            <p className="text-sm text-red-500">{errors.sock.name.message}</p>
          )}

          <Textarea
            {...register("sock.description", {
              required: "Description is required",
            })}
            placeholder="Description"
          />
          {errors.sock?.description && (
            <p className="text-sm text-red-500">
              {errors.sock.description.message}
            </p>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
            <span>Size</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-2">
              <select
                {...register(`variants.${index}.size`, {
                  required: "Size is required",
                  validate: (value) => {
                    const occurrences = selectedSizes.filter(
                      (s) => s === value,
                    ).length;
                    return occurrences <= 1 || "Size must be unique";
                  },
                })}
                defaultValue={field.size || ""}
                className="rounded-md border p-2.5 text-sm dark:bg-inherit"
              >
                <option value="" disabled>
                  Select size
                </option>
                {availableSizes.map((size) => (
                  <option
                    key={size}
                    value={size}
                    disabled={
                      selectedSizes.includes(size) && field.size !== size
                    }
                  >
                    {size}
                  </option>
                ))}
              </select>

              <Input
                {...register(`variants.${index}.quantity`, {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder="Quantity"
                type="number"
                min={0}
                step={1}
              />

              <Input
                {...register(`variants.${index}.price`, {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: 0.01,
                })}
                placeholder="Price"
                type="number"
                min={0.01}
                step={0.01}
              />

              <Button
                size="icon"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              if (nextSizesToSelect.length > 0) {
                append({ size: nextSizesToSelect[0], quantity: 0, price: 0 });
              } else {
                console.error(
                  "Unable to add another size, no sizes available.",
                );
              }
            }}
            disabled={nextSizesToSelect.length < 1}
          >
            <Plus className="mr-2 h-4 w-4" /> Add size
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Preview Image URL
          </label>
          <Input
            {...register("sock.previewImageUrl", {
              required: "Image URL is required",
              pattern: {
                value: /^https?:\/\//,
                message: "Invalid URL format",
              },
            })}
            placeholder="https://example.com/image.jpg"
          />
          {errors.sock?.previewImageUrl && (
            <p className="text-sm text-red-500">
              {errors.sock.previewImageUrl.message}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <Button type="button" onClick={prevStep}>
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" onClick={nextStep} disabled={!isValid}>
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!isValid || createSockMutation.isPending}
          >
            {createSockMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}
