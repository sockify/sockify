import { Sock } from "@/api/inventory/model";
import { useDeleteSockMutation } from "@/api/inventory/queries";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import TableEmpty from "./TableEmpty";

interface InventoryTableProps {
  socks: Sock[];
  onRowClick: (sockId: number) => void;
}

export default function InventoryTable({
  socks,
  onRowClick,
}: InventoryTableProps) {
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
    if (!variants || variants.length === 0) return "N/A";
    const total = variants.reduce((acc, variant) => acc + variant.price, 0);
    return `$${(total / variants.length).toFixed(2)}`;
  };

  const calculateTotalQuantity = (variants?: Sock["variants"]) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((total, variant) => total + variant.quantity, 0);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[96px] text-center">Image</TableHead>
            <TableHead className="w-[64px] text-center">ID</TableHead>
            <TableHead className="min-w-[500px]">Name</TableHead>
            <TableHead>Avg. Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {socks.length > 0 ? (
            socks.map((sock) => (
              <TableRow
                key={sock.id}
                onClick={() => onRowClick(sock.id!)}
                className="hover:cursor-pointer"
              >
                <TableCell className="text-center">
                  <img
                    src={sock.previewImageUrl}
                    className="mx-auto h-12 w-12 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">{sock.id}</TableCell>
                <TableCell>{sock.name}</TableCell>
                <TableCell>{calculateAveragePrice(sock.variants)}</TableCell>
                <TableCell>{calculateTotalQuantity(sock.variants)}</TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(sock.id!);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-[30rem]">
                <TableEmpty message="No products found." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
