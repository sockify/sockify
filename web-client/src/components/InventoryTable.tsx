import { useState } from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

// Define the properties each inventory item should have, including variants.
interface Variant {
    id: string;         // Unique identifier for each variant
    size: string;       // Size of the variant (e.g., 'S', 'M', 'L')
    price: number;      // Price of the variant
    quantity: number;   // Quantity available for this variant
}

interface Sock {
    id: string;         // Unique identifier for each sock item
    name: string;       // Name of the sock item
    variants: Variant[]; // Array of variants
    imageUrl: string;    // URL for the sock's image
}

// Define the properties (props) that the InventoryTable component expects.
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

    // Helper function to calculate the average price of all variants
    const calculateAveragePrice = (variants: Variant[]) => {
        if (variants.length === 0) return 'N/A';
        const total = variants.reduce((acc, variant) => acc + variant.price, 0);
        return `$${(total / variants.length).toFixed(2)}`;
    };

    // Helper function to calculate the total quantity of all variants
    const calculateTotalQuantity = (variants: Variant[]) => {
        return variants.reduce((total, variant) => total + variant.quantity, 0);
    };

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
