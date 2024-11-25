import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddSockForm from "./AddSockForm";
import { Sock } from "@/api/inventory/model";

interface AddSockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSock: (sock: Sock) => void;
}

export default function AddSockModal({ isOpen, onClose, onAddSock }: AddSockModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl" aria-describedby="add-sock-description">
                <DialogHeader>
                    <DialogTitle>Add new sock</DialogTitle>
                    <DialogDescription
                        id="add-sock-description"
                        className="text-sm text-muted-foreground"
                    >
                        Fill out the form below to add a new sock to the inventory.
                    </DialogDescription>
                </DialogHeader>
                <AddSockForm
                    onAddSock={onAddSock}
                    onClose={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
