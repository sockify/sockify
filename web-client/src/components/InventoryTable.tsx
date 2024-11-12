import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

// Define the properties each inventory item should have, such as `id`, `name`, `category`, `price`, and `quantity`.
interface Sock {
    id: string;         // Unique identifier for each sock item
    name: string;       // Name of the sock item
    category: string;   // Category of the sock item, e.g., "Sports", "Casual"
    price: number;      // Price of the sock item
    quantity: number;   // Quantity available in stock
}

// Define the properties (props) that the InventoryTable component expects.
// - `socks` is an array of Sock items.
// - `onRowClick` is a function that triggers when a row is clicked, passing the sock's `id`.
// - `onDeleteClick` is a function that triggers when the delete button is clicked, passing the sock's `id`.
interface InventoryTableProps {
    socks: Sock[];                           // List of socks to display in the table
    onRowClick: (sockId: string) => void;    // Function called when a row is clicked
    onDeleteClick: (sockId: string) => void; // Function called when delete button is confirmed
}

// Main component that displays a table of inventory items (socks).
export default function InventoryTable({ socks, onRowClick, onDeleteClick }: InventoryTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSockId, setSelectedSockId] = useState<string | null>(null);

    // Function to handle opening the delete confirmation dialog
    const openDeleteDialog = (sockId: string) => {
        setSelectedSockId(sockId); // Store the ID of the sock to delete
        setIsDialogOpen(true);     // Open the dialog
    };

    // Function to confirm deletion
    const handleDeleteConfirm = () => {
        if (selectedSockId) {
            onDeleteClick(selectedSockId); // Call the onDeleteClick prop with the selected sock's ID
        }
        setIsDialogOpen(false); // Close the dialog
        setSelectedSockId(null); // Clear the selected sock ID
    };

    // Function to cancel deletion
    const handleDeleteCancel = () => {
        setIsDialogOpen(false); // Close the dialog
        setSelectedSockId(null); // Clear the selected sock ID
    };

    return (
        <>
            {/* Table container with full width and basic border styling */}
            <table className="w-full text-left border border-gray-200">
                <thead>
                    <tr>
                        {/* Table header row with column names */}
                        <th className="p-3 border-b">ID</th>
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Category</th>
                        <th className="p-3 border-b">Price</th>
                        <th className="p-3 border-b">Quantity</th>
                        <th className="p-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Loop over each sock in the `socks` array to create a table row for each item */}
                    {socks.map((sock) => (
                        <tr
                            key={sock.id}                      // Unique key for each row
                            className="hover:bg-gray-100 cursor-pointer" // Highlight row on hover
                        >
                            {/* Display each property of the sock in separate cells */}
                            {/* Each cell calls `onRowClick` when clicked, passing the `sock.id` */}
                            <td className="p-3 border-b" onClick={() => onRowClick(sock.id)}>{sock.id}</td>
                            <td className="p-3 border-b" onClick={() => onRowClick(sock.id)}>{sock.name}</td>
                            <td className="p-3 border-b" onClick={() => onRowClick(sock.id)}>{sock.category}</td>
                            <td className="p-3 border-b" onClick={() => onRowClick(sock.id)}>${sock.price.toFixed(2)}</td>
                            <td className="p-3 border-b" onClick={() => onRowClick(sock.id)}>{sock.quantity}</td>

                            {/* Actions cell with a delete button */}
                            <td className="p-3 border-b">
                                {/* Delete button that prevents the row click from firing when clicked */}
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stops the row click event from triggering
                                        openDeleteDialog(sock.id); // Open delete confirmation dialog
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete confirmation dialog */}
            <DeleteConfirmationDialog
                isOpen={isDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
