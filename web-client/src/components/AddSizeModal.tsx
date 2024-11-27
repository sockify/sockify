import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; 

interface AddSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  availableSizes: string[];
}

interface FormData {
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
  const { register, handleSubmit, setValue, formState } = useForm<FormData>();
  const { errors } = formState;

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Size</DialogTitle>
          <DialogDescription>Add a new size, quantity, and price.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Size</label>
            <Select
              onValueChange={(value: string) => setValue("size", value)} 
              defaultValue=""
            >
              <SelectTrigger>
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
              <p className="text-red-500 text-sm">{errors.size.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <Input
              type="number"
              {...register("quantity", { required: "Quantity is required", min: 0 })}
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", min: 0.01 })}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Size</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
