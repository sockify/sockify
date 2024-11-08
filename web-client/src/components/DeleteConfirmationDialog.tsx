import { Button } from "@/components/ui/button";  // Import a reusable button component from your UI library
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";  // Import ShadCN's dialog components

// Define the properties (props) that the DeleteConfirmationDialog component expects.
interface DeleteConfirmationDialogProps {
    isOpen: boolean;      // Controls whether the dialog is visible
    onClose: () => void;  // Function to close the dialog
    onConfirm: () => void; // Function to confirm the delete action
}

// Main component to render a delete confirmation dialog
// Displays a confirmation message with "Delete" and "Cancel" options.
export default function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
}: DeleteConfirmationDialogProps) {
    return (
        // Dialog component from ShadCN that controls the visibility of the dialog.
        // The `open` prop determines if the dialog is shown, and `onOpenChange`
        // allows the dialog to be closed when the state changes.
        <Dialog open={isOpen} onOpenChange={onClose}>

            {/* DialogContent wraps the main content of the dialog, including header, description, and footer. */}
            <DialogContent>

                {/* DialogHeader is used for displaying the title and description at the top of the dialog. */}
                <DialogHeader>

                    {/* DialogTitle renders the main title of the dialog in a bold or prominent style. */}
                    <DialogTitle>Confirm Delete</DialogTitle>

                    {/* DialogDescription provides additional context for the dialog.
              Here, it displays a message warning the user about the action. */}
                    <DialogDescription>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* DialogFooter is a container for the dialog’s action buttons. Typically placed at the bottom. */}
                <DialogFooter>

                    {/* Cancel button: Calls the onClose function to close the dialog without confirming. 
              The `variant="secondary"` styles the button with a non-destructive look (e.g., grey). */}
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>

                    {/* Delete button: Calls the onConfirm function to proceed with the deletion.
              The `variant="destructive"` applies a warning style (e.g., red) to signify danger. */}
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
