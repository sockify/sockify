import { CartItem } from "@/api/cart/model";
import { SockVariant } from "@/api/inventory/model";
import { useGetSockById } from "@/api/inventory/queries";
import GenericError from "@/components/GenericError";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Dummy related products
const relatedProducts = [
  {
    id: 1,
    name: "Classic Black Socks",
    price: 9.99,
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "Colorful Polka Dot Socks",
    price: 11.99,
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "Warm Wool Socks",
    price: 14.99,
    imageUrl: "https://via.placeholder.com/300",
  },
];

export default function SockDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const sockIdStr = params["sockId"];
  const sockId = parseInt(sockIdStr!);

  const { data: sock, isLoading, isError, error } = useGetSockById(sockId);

  const [selectedVariant, setSelectedVariant] = useState<
    SockVariant | undefined
  >(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleSizeChange = (variant: SockVariant) => {
    setSelectedVariant(variant || sock!.variants[0]);
    setSelectedQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    if (!sock) {
      toast.error("No sock has been selected");
      return;
    }

    const item: CartItem = {
      sockVariantId: selectedVariant.id!,
      name: sock.name,
      imageUrl: sock.previewImageUrl,
      quantity: selectedQuantity,
      price: selectedVariant.price,
      size: selectedVariant.size,
    };

    addItem(item);
  };

  const handleViewProduct = (id: number) => {
    navigate(`/socks/${id}`);
  };

  useEffect(() => {
    if (sock?.variants && sock.variants.length > 0) {
      setSelectedVariant(sock?.variants[0]);
    }
  }, [sock]);

  if (isLoading) {
    return <ItemLoadingSkeleton />;
  }

  if (isError) {
    return (
      <GenericError
        message={`Unable to load sock details for ID ${sockIdStr}`}
        stackTrace={error.stack}
      />
    );
  }

  return (
    <div className="mx-auto px-4 py-10 md:px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img
            src={sock!.previewImageUrl}
            alt={sock!.name}
            className="h-full w-full rounded object-cover"
          />
        </div>

        <div className="w-full space-y-4 md:w-1/2">
          <h1 className="text-3xl font-bold">{sock!.name}</h1>
          <p className="text-xl text-gray-500">${selectedVariant?.price}</p>
          <p>{sock!.description}</p>

          <div className="my-4">
            <label className="mb-1 block font-medium">Size</label>
            <div className="flex space-x-4">
              {sock!.variants.map((variant) => (
                <Button
                  variant={`${selectedVariant?.size === variant.size ? "default" : "outline"}`}
                  key={variant.id!}
                  onClick={() => handleSizeChange(variant)}
                  className="min-w-12"
                >
                  {variant.size}
                </Button>
              ))}
            </div>
          </div>

          <div className="my-4">
            <label className="mb-1 block font-medium">Quantity</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                }
              >
                <Minus size={16} />
              </Button>
              <div className="w-12 text-center">{selectedQuantity}</div>
              <Button
                variant="outline"
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="pt-8">
            <Button onClick={handleAddToCart} className="w-full">
              <ShoppingCart className="h-8 w-8 pr-3" /> Add to cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Related products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {relatedProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full rounded object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => handleViewProduct(product.id)}
              >
                View product
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemLoadingSkeleton() {
  return (
    <div className="mx-auto px-4 py-10 md:px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <Skeleton className="h-80 w-full rounded" />
        </div>

        <div className="w-full space-y-4 md:w-1/2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />

          <div className="my-4">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-12" />
              <Skeleton className="h-10 w-12" />
              <Skeleton className="h-10 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
