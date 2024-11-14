import { useState } from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useDeleteSockMutation } from "@/api/inventory/queries";

interface Variant {
    id: number;
    size: string;
    price: number;
    quantity: number;
}

interface Sock {
    id: number;
    name: string;
    variants: Variant[];
    imageUrl: string;
}

interface InventoryTableProps {
    socks: Sock[];
    onRowClick: (sockId: string) => void;
}

export default function InventoryTable({ socks, onRowClick }: InventoryTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSockId, setSelectedSockId] = useState<string | null>(null);

    const deleteSockMutation = useDeleteSockMutation();

    const handleDeleteClick = (sockId: string) => {
        deleteSockMutation.mutate(sockId, {
            onSuccess: () => {
                console.log("Sock deleted successfully");
            },
            onError: (error: any) => {
                console.error("Error deleting sock:", error.message);
                alert(`Error deleting sock: ${error.message}`);
            },
        });
    };

    const openDeleteDialog = (sockId: string) => {
        setSelectedSockId(sockId);
        setIsDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedSockId) {
            handleDeleteClick(selectedSockId);
        }
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    const handleDeleteCancel = () => {
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    const calculateAveragePrice = (variants?: Variant[]) => {
        if (!variants || variants.length === 0) return 'N/A';
        const total = variants.reduce((acc, variant) => acc + variant.price, 0);
        return `$${(total / variants.length).toFixed(2)}`;
    };

    const calculateTotalQuantity = (variants?: Variant[]) => {
        if (!variants || variants.length === 0) return 0;
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
