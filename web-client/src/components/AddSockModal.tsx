import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddSockForm from "./AddSockForm";
import { Sock } from "@/api/inventory/model";

interface AddSockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSock: (sock: Sock) => void;
}

const AddSockModal: React.FC<AddSockModalProps> = ({ isOpen, onClose, onAddSock }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl" aria-describedby="add-sock-description">
                <DialogHeader>
                    <DialogTitle>Add New Sock</DialogTitle>
                </DialogHeader>
                {/* Accessible description for the dialog */}
                <p id="add-sock-description" className="text-sm text-gray-500">
                    Fill out the form below to add a new sock to the inventory.
                </p>
                <AddSockForm
                    onAddSock={onAddSock}
                    onClose={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddSockModal;
