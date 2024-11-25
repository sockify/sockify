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
import { SockVariant, UpdateSock } from "@/api/inventory/model";

interface EditItemModalProps {
  isOpen: boolean;
  id: number; 
  sock: {
    name: string;
    description: string;
    previewImageUrl: string;
    variants: SockVariant[];
  };
  onClose: () => void;
  onSubmit: (data: UpdateSock & { id: number }) => void;
}

export default function EditItemModal({
  isOpen,
  id,
  sock,
  onClose,
  onSubmit,
}: EditItemModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSock>({
    defaultValues: {
      sock: {
        name: sock.name,
        description: sock.description || "",
        previewImageUrl: sock.previewImageUrl,
      },
      variants: sock.variants || [],
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item Details</DialogTitle>
          <DialogDescription>
            Make changes to the item's basic information.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({
              ...data,
              id, 
            })
          )}
        >
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                {...register("sock.name", { required: "Name is required" })}
                className="w-full border rounded p-2"
              />
              {errors.sock?.name && (
                <p className="text-red-500 text-sm">
                  {errors.sock.name.message}
                </p>
              )}
            </div>
            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register("sock.description")}
                className="w-full border rounded p-2"
              />
              {errors.sock?.description && (
                <p className="text-red-500 text-sm">
                  {errors.sock.description.message}
                </p>
              )}
            </div>
            {/* Preview Image URL Field */}
            <div>
              <label className="block text-sm font-medium">
                Preview Image URL
              </label>
              <input
                type="text"
                {...register("sock.previewImageUrl", {
                  required: "Image URL is required",
                })}
                className="w-full border rounded p-2"
              />
              {errors.sock?.previewImageUrl && (
                <p className="text-red-500 text-sm">
                  {errors.sock.previewImageUrl.message}
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
