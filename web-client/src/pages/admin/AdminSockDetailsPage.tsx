import {
  Sock,
  SockVariant,
  UpdateSockRequest,
  sockSizeEnumSchema,
} from "@/api/inventory/model";
import { useGetSockById, useUpdateSockMutation } from "@/api/inventory/queries";
import AddSizeModal from "@/components/AddSizeModal";
import EditItemModal from "@/components/EditItemModal";
import EditVariantModal from "@/components/EditVariantModal";
import GenericError from "@/components/GenericError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";
import dayjs from "dayjs";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UNKNOWN = "Unknown";
const availableSizes = sockSizeEnumSchema.options;

export default function AdminSockDetailsPage() {
  const { sockId } = useParams<{ sockId: string }>();
  const numericSockId = Number(sockId);

  const {
    data: sock,
    refetch,
    isLoading,
    isError,
  } = useGetSockById(numericSockId);

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

  const handleUpdateSock = async (updatedSock: Sock) => {
    try {
      const payload: UpdateSockRequest = {
        sock: {
          name: updatedSock.name,
          description: updatedSock.description,
          previewImageUrl: updatedSock.previewImageUrl,
        },
        variants: updatedSock.variants,
      };

      await updateSockMutation.mutateAsync({
        id: numericSockId,
        ...payload,
      });

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
        variant.id === updatedVariant.id ? updatedVariant : variant,
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError || !sock) {
    return <GenericError message="Unable to fetch sock details" />;
  }

  const nextSizesToSelect = availableSizes.filter(
    (size) => !currentVariants.some((variant) => variant.size === size),
  );
  const dateAdded =
    sock.variants.length > 0
      ? (sock.variants[0]?.createdAt ?? UNKNOWN)
      : UNKNOWN;

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <h1 className="text-2xl font-bold md:text-3xl">
          <span>Item details: </span>
          <code className="rounded bg-muted p-1">{sock.name}</code>
        </h1>
        <Button variant="default" onClick={() => setEditSockOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit item
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Preview image</h2>
          </CardHeader>
          <CardContent>
            <img
              src={sock.previewImageUrl}
              alt={sock.name}
              className="h-[450px] w-full rounded-lg object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Basic information</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong>Description:</strong> {sock.description}
              </li>
              <li>
                <strong>Date added:</strong>{" "}
                {dateAdded === UNKNOWN
                  ? "N/A"
                  : dayjs(dateAdded).format("MM/DD/YYYY")}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="mb-4 text-xl font-bold">Stock information</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVariants.map((variant) => (
                <tr key={variant.id} className="border-t">
                  <td className="px-4 py-2">{variant.size}</td>
                  <td className="px-4 py-2">{variant.quantity}</td>
                  <td className="px-4 py-2">${variant.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mx-auto flex items-center justify-center"
                      onClick={() => setEditVariant(variant)}
                    >
                      <Edit className="mr-1" size={16} /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>

        <CardFooter>
          <Button
            variant="default"
            size="sm"
            onClick={() => setAddVariantOpen(true)}
            disabled={nextSizesToSelect.length < 1}
          >
            <Plus className="mr-2 h-4 w-4" /> Add new size
          </Button>
        </CardFooter>
      </Card>

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
          availableSizes={nextSizesToSelect}
          onClose={() => setAddVariantOpen(false)}
          onSubmit={(data) => {
            const parsedPrice = parseFloat(data.price.toString());
            const parsedQuantity = parseInt(data.quantity.toString(), 10);

            if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
              toast.error(
                "Please enter valid numeric values for price and quantity.",
              );
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

function LoadingSkeleton() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[450px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/5" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-8 w-2/5" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-12 w-2/5" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-4/5" />
        </CardContent>
      </Card>
    </div>
  );
}
