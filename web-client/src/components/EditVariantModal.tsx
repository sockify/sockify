import { SockVariant } from "@/api/inventory/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EditVariantModalProps {
  variant: SockVariant;
  onClose: () => void;
  onSave: (data: SockVariant) => void;
}

export default function EditVariantModal({
  variant,
  onClose,
  onSave,
}: EditVariantModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: variant,
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit sock variant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} id="edit-variant-form">
          <div className="space-y-4">
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                type="text"
                {...register("size", { required: "Size is required" })}
                id="size"
                disabled
              />
              {errors.size && (
                <p className="text-sm text-red-500">{errors.size.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: 0,
                })}
                id="quantity"
                min={0}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: 0.01,
                })}
                id="price"
                min={0.01}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-variant-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
