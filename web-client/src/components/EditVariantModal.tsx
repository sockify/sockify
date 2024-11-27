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
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Size</label>
              <input
                type="text"
                {...register("size", { required: "Size is required" })}
                className="w-full rounded border p-2"
              />
              {errors.size && (
                <p className="text-sm text-red-500">{errors.size.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: 0,
                })}
                className="w-full rounded border p-2"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: 0,
                })}
                className="w-full rounded border p-2"
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>
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
