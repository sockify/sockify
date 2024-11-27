import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitHandler, useForm } from "react-hook-form";

import { Label } from "./ui/label";

interface AddSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SockVariantForm) => void;
  availableSizes: string[];
}

interface SockVariantForm {
  size: string;
  quantity: number;
  price: number;
}

export default function AddSizeModal({
  isOpen,
  onClose,
  onSubmit,
  availableSizes,
}: AddSizeModalProps) {
  const { register, handleSubmit, setValue, formState } =
    useForm<SockVariantForm>();
  const { errors } = formState;

  const handleFormSubmit: SubmitHandler<SockVariantForm> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new size</DialogTitle>
          <DialogDescription>
            Add a new size, quantity, and price.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
          id="add-size-form"
        >
          <div>
            <Label htmlFor="size">Size</Label>
            <Select
              onValueChange={(value: string) => setValue("size", value)}
              defaultValue=""
            >
              <SelectTrigger id="size">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Enter quantity"
              id="quantity"
              min={0}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
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
              placeholder="Enter price"
              id="price"
              min={0.01}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-size-form">
            Add size
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
