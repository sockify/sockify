import { useState } from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useDeleteSockMutation } from "@/api/inventory/queries";
import { Sock } from "@/api/inventory/model";

interface InventoryTableProps {
    socks: Sock[];
    onRowClick: (sockId: number) => void;
}

export default function InventoryTable({ socks, onRowClick }: InventoryTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSockId, setSelectedSockId] = useState<number | null>(null);

    const deleteSockMutation = useDeleteSockMutation();

    const handleDeleteClick = (sockId: number) => {
        deleteSockMutation.mutate(sockId);
    };

    const openDeleteDialog = (sockId: number) => {
        setSelectedSockId(sockId);
        setIsDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedSockId !== null) {
            handleDeleteClick(selectedSockId);
        }
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    const handleDeleteCancel = () => {
        setIsDialogOpen(false);
        setSelectedSockId(null);
    };

    const calculateAveragePrice = (variants?: Sock["variants"]) => {
        if (!variants || variants.length === 0) return 'N/A';
        const total = variants.reduce((acc, variant) => acc + variant.price, 0);
        return `$${(total / variants.length).toFixed(2)}`;
    };

    const calculateTotalQuantity = (variants?: Sock["variants"]) => {
        if (!variants || variants.length === 0) return 0;
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
                                <img src={sock.previewImageUrl} className="w-16 h-16 object-cover mx-auto" />
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
