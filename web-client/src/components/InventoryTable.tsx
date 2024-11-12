import { useState } from 'react';
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
interface InventoryTableProps {
    socks: Sock[]; // List of socks to display in the table
    setSocksData: (newData: Sock[]) => void; // Function to update the socks data
    onRowClick: (sockId: string) => void; // Function to handle row clicks
}

export default function InventoryTable({ socks, setSocksData, onRowClick }: InventoryTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSockId, setSelectedSockId] = useState<string | null>(null);

    // Handle delete action by updating the socksData state to remove the sock with the given ID
    const handleDeleteClick = (sockId: string) => {
        console.log(`Deleting sock with ID: ${sockId}`);
        setSocksData((prevData) => prevData.filter(sock => sock.id !== sockId));
    };

    // Function to handle opening the delete confirmation dialog
    const openDeleteDialog = (sockId: string) => {
        setSelectedSockId(sockId); // Store the ID of the sock to delete
        setIsDialogOpen(true);     // Open the dialog
    };

    // Function to confirm deletion
    const handleDeleteConfirm = () => {
        if (selectedSockId) {
            handleDeleteClick(selectedSockId); // Call the handleDeleteClick function
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
                            onClick={() => onRowClick(sock.id)} // Use the prop `onRowClick`
                        >
                            {/* Display each property of the sock in separate cells */}
                            {/* Each cell calls `handleRowClick` when clicked, passing the `sock.id` */}
                            <td className="p-3 border-b">{sock.id}</td>
                            <td className="p-3 border-b">{sock.name}</td>
                            <td className="p-3 border-b">{sock.category}</td>
                            <td className="p-3 border-b">${sock.price.toFixed(2)}</td>
                            <td className="p-3 border-b">{sock.quantity}</td>

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
