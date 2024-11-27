import { Sock } from "@/api/inventory/model";
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
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useForm } from "react-hook-form";

import { Label } from "./ui/label";

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
          <DialogTitle>Edit details</DialogTitle>
          <DialogDescription>
            Make changes to the item's basic information.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({
              ...data,
              id,
            }),
          )}
          className="space-y-4"
          id="edit-details-form"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
              id="name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Enter description"
              id="description"
            />
          </div>

          <div>
            <Label htmlFor="previewImageUrl">Preview Image URL</Label>
            <Input
              {...register("previewImageUrl", {
                required: "Preview image URL is required",
              })}
              placeholder="Enter image URL"
              id="previewImageUrl"
            />
            {errors.previewImageUrl && (
              <p className="text-sm text-red-500">
                {errors.previewImageUrl.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-details-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
