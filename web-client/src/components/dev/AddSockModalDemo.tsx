import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddSockForm from "@/components/AddSockForm";
import { Sock } from "@/api/inventory/model";
import { useState } from "react";

export default function AddSockModalDemo() {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddSock = (newSock: Sock) => {
        console.log("New sock added:", newSock);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Button onClick={() => setIsOpen(true)}>Add New Sock</Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent aria-describedby="add-sock-form-description">
                    <DialogHeader>
                        <DialogTitle>Add New Sock</DialogTitle>
                    </DialogHeader>
                    <p id="add-sock-form-description" className="text-sm text-gray-500">
                        Fill out the details to add a new sock to the inventory.
                    </p>
                    <AddSockForm onAddSock={handleAddSock} onClose={() => setIsOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}