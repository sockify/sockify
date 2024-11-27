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
import { Textarea } from "@/components/ui/textarea"; 
import { Sock } from "@/api/inventory/model";

interface EditItemModalProps {
  isOpen: boolean;
  id: number;
  sock: Sock;
  onClose: () => void;
  onSubmit: (updatedSock: Sock) => void;
}

export default function EditItemModal({
  isOpen,
  id,
  sock,
  onClose,
  onSubmit,
}: EditItemModalProps) {
  const { register, handleSubmit, formState } = useForm<Sock>({
    defaultValues: {
      name: sock.name,
      description: sock.description || "",
      previewImageUrl: sock.previewImageUrl,
      variants: sock.variants || [],
    },
  });
  const { errors } = formState;

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
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Preview Image URL
            </label>
            <Input
              {...register("previewImageUrl", {
                required: "Preview image URL is required",
              })}
              placeholder="Enter image URL"
            />
            {errors.previewImageUrl && (
              <p className="text-red-500 text-sm">
                {errors.previewImageUrl.message}
              </p>
            )}
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
