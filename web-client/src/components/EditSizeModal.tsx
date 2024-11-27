import React from "react";
import { useForm } from "react-hook-form";
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

interface EditSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { size: string; quantity: number; price: number }) => void;
  defaultValues: { size: string; quantity: number; price: number };
}

export default function EditSizeModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: EditSizeModalProps) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Size Information</DialogTitle>
          <DialogDescription>Modify size details for this item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Size</label>
            <Input
              type="text"
              {...register("size", { required: "Size is required" })}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <Input
              type="number"
              {...register("quantity", { required: "Quantity is required", min: 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", min: 0.01 })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
