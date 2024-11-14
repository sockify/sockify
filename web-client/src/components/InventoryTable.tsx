import { useState } from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useDeleteSockMutation } from "@/api/inventory/queries"; // Import the mutation hook

// Define the properties each inventory item should have, including variants.
interface Variant {
    id: number;         // Unique identifier for each variant
    size: string;       // Size of the variant (e.g., 'S', 'M', 'L')
    price: number;      // Price of the variant
    quantity: number;   // Quantity available for this variant
}

interface Sock {
    id: number;         // Unique identifier for each sock item
    name: string;       // Name of the sock item
    variants: Variant[]; // Array of variants
    imageUrl: string;    // URL for the sock's image
}

// Define the properties (props) that the InventoryTable component expects.
interface InventoryTableProps {
    socks: Sock[]; // List of socks to display in the table
    onRowClick: (sockId: string) => void; // Function to handle row clicks
}

export default function InventoryTable({ socks, onRowClick }: InventoryTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSockId, setSelectedSockId] = useState<string | null>(null);

    // Use the mutation hook
    const deleteSockMutation = useDeleteSockMutation();

    const handleDeleteClick = (sockId: string) => {
        deleteSockMutation.mutate(sockId, {
            onSuccess: () => {
                console.log("Sock deleted successfully");
            },
            onError: (error: any) => {
                console.error("Error deleting sock:", error.message); // Log error message
                alert(`Error deleting sock: ${error.message}`);
            },
        });
    };


    // Function to handle opening the delete confirmation dialog
    const openDeleteDialog = (sockId: string) => {
        setSelectedSockId(sockId);
        setIsDialogOpen(true);
    };

    // Function to confirm deletion
    const handleDeleteConfirm = () => {
        if (selectedSockId) {
            handleDeleteClick(selectedSockId);
        }
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    // Function to cancel deletion
    const handleDeleteCancel = () => {
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    const calculateAveragePrice = (variants?: Variant[]) => {
        if (!variants || variants.length === 0) return 'N/A'; // Check if variants is undefined or empty
        const total = variants.reduce((acc, variant) => acc + variant.price, 0);
        return `$${(total / variants.length).toFixed(2)}`;
    };



    const calculateTotalQuantity = (variants?: Variant[]) => {
        if (!variants || variants.length === 0) return 0; // Return 0 if variants is undefined or empty
        return variants.reduce((total, variant) => total + variant.quantity, 0);
    };

    console.log(socks);


    return (
        <>
            <table className="w-full text-left border border-gray-200">
                <thead>
                    <tr>
                        <th className="p-3 border-b text-center">Image</th>
                        <th className="p-3 border-b text-center">Product ID</th>
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Price</th>
                        <th className="p-3 border-b">Stock</th>
                        <th className="p-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {socks.map((sock) => (
                        <tr
                            key={sock.id}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => onRowClick(sock.id)}
                        >
                            <td className="p-3 border-b text-center">
                                <img src={sock.imageUrl} className="w-16 h-16 object-cover mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">{sock.id}</td>
                            <td className="p-3 border-b">{sock.name}</td>
                            <td className="p-3 border-b">
                                {calculateAveragePrice(sock.variants)}
                            </td>
                            <td className="p-3 border-b">{calculateTotalQuantity(sock.variants)}</td>
                            <td className="p-3 border-b">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteDialog(sock.id);
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeleteConfirmationDialog
                isOpen={isDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
