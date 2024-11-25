import AddSockForm from "@/components/AddSockForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddSockModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSock = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Button onClick={() => setIsOpen(true)}>Add New Sock</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-describedby="add-sock-form-description">
          <DialogHeader>
            <DialogTitle>Add New Sock</DialogTitle>
          </DialogHeader>
          <p id="add-sock-form-description" className="text-sm text-gray-500">
            Fill out the details to add a new sock to the inventory.
          </p>
          <AddSockForm
            onAddSock={handleAddSock}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
