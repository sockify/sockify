import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetSockById,
  useUpdateSockMutation,
} from "@/api/inventory/queries";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import EditItemModal from "@/components/EditItemModal";
import EditVariantModal from "@/components/EditVariantModal";
import AddSizeModal from "@/components/AddSizeModal";
import { Edit, Plus } from "lucide-react";
import { SockVariant, UpdateSock } from "@/api/inventory/model";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";

export default function AdminSockDetailsPage() {
  const { sockId } = useParams<{ sockId: string }>();
  const numericSockId = Number(sockId);

  const { data: sock, refetch, isLoading, isError } = useGetSockById(numericSockId);

  const [isEditSockOpen, setEditSockOpen] = useState(false);
  const [editVariant, setEditVariant] = useState<null | SockVariant>(null);
  const [isAddVariantOpen, setAddVariantOpen] = useState(false);
  const [currentVariants, setCurrentVariants] = useState<SockVariant[]>([]);

  const updateSockMutation = useUpdateSockMutation();

  useEffect(() => {
    if (sock?.variants) {
      setCurrentVariants(sock.variants);
    }
  }, [sock]);

  const handleUpdateSock = async (updatedSock: UpdateSock) => {
    try {
      const payload = {
        id: numericSockId,
        ...updatedSock,
      };
      await updateSockMutation.mutateAsync(payload);
      refetch();
      setEditSockOpen(false);
      toast.success("Sock updated successfully!");
    } catch (error) {
      console.error("Error updating sock:", error);
      toast.error("Failed to update sock details.");
    }
  };

  const handleAddVariant = async (newVariant: SockVariant) => {
    try {
      const updatedVariants: SockVariant[] = [
        ...currentVariants,
        {
          ...newVariant,
          size: newVariant.size as SockVariant["size"],
        },
      ];
      setCurrentVariants(updatedVariants);

      await updateSockMutation.mutateAsync({
        id: numericSockId,
        sock: {
          name: sock!.name,
          description: sock!.description,
          previewImageUrl: sock!.previewImageUrl,
        },
        variants: updatedVariants,
      });

      refetch();
      setAddVariantOpen(false);
      toast.success("Variant added successfully!");
    } catch (error) {
      console.error("Error adding variant:", error);
      toast.error("Failed to add variant.");
    }
  };

  const handleEditVariant = async (updatedVariant: SockVariant) => {
    try {
      const updatedVariants: SockVariant[] = currentVariants.map((variant) =>
        variant.id === updatedVariant.id ? updatedVariant : variant
      );
      setCurrentVariants(updatedVariants);

      await updateSockMutation.mutateAsync({
        id: numericSockId,
        sock: {
          name: sock!.name,
          description: sock!.description,
          previewImageUrl: sock!.previewImageUrl,
        },
        variants: updatedVariants,
      });

      refetch();
      setEditVariant(null);
      toast.success("Variant updated successfully!");
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !sock) return <div>Error fetching sock details.</div>;

  const availableSizes = ["S", "M", "LG", "XL"].filter(
    (size) => !currentVariants.some((variant) => variant.size === size)
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Item Details: {sock.name}</h1>
        <Button variant="default" onClick={() => setEditSockOpen(true)}>
          <Edit className="mr-2" size={16} /> Edit Item
        </Button>
      </div>

      {/* Image and Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Item Image */}
        <div className="flex justify-center items-center">
          <img
            src={sock.previewImageUrl || NO_IMAGE_PLACEHOLDER}
            alt={sock.name}
            className="w-full max-w-[500px] h-auto object-contain border rounded-lg shadow-md md:max-w-[700px]"
          />
        </div>

        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Description:</strong> {sock.description}
            </li>
          </ul>
        </div>
      </div>

      {/* Variants Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Size, Quantity, and Price Information</h2>
        <Table>
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 px-4">Size</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVariants.map((variant) => (
              <tr key={variant.id} className="border-t">
                <td className="py-2 px-4">{variant.size}</td>
                <td className="py-2 px-4">{variant.quantity}</td>
                <td className="py-2 px-4">${variant.price.toFixed(2)}</td>
                <td className="py-2 px-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center mx-auto"
                    onClick={() => setEditVariant(variant)}
                  >
                    <Edit className="mr-1" size={16} /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="mt-4 flex justify-end">
          <Button variant="default" size="sm" onClick={() => setAddVariantOpen(true)}>
            <Plus className="mr-2" size={16} /> Add New Size
          </Button>
        </div>
      </div>

      {/* Modals */}
      {isEditSockOpen && (
        <EditItemModal
          isOpen={isEditSockOpen}
          id={numericSockId}
          sock={{
            name: sock.name,
            description: sock.description,
            previewImageUrl: sock.previewImageUrl,
            variants: currentVariants,
          }}
          onClose={() => setEditSockOpen(false)}
          onSubmit={handleUpdateSock}
        />
      )}

      {editVariant && (
        <EditVariantModal
          variant={editVariant}
          onClose={() => setEditVariant(null)}
          onSave={(data) => {
            handleEditVariant({
              ...data,
              id: editVariant.id,
              size: data.size as SockVariant["size"],
              price: parseFloat(data.price.toString()),
              quantity: parseInt(data.quantity.toString(), 10),
            });
          }}
        />
      )}

      {isAddVariantOpen && (
        <AddSizeModal
          isOpen={isAddVariantOpen}
          availableSizes={availableSizes}
          onClose={() => setAddVariantOpen(false)}
          onSubmit={(data) => {
            const parsedPrice = parseFloat(data.price.toString());
            const parsedQuantity = parseInt(data.quantity.toString(), 10);

            if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
              toast.error("Please enter valid numeric values for price and quantity.");
              return;
            }

            handleAddVariant({
              size: data.size as SockVariant["size"],
              price: parsedPrice,
              quantity: parsedQuantity,
            });
          }}
        />
      )}
    </div>
  );
}

