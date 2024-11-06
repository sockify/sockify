import { CartItem } from "@/api/cart/model";
import { SockVariant } from "@/api/inventory/model";
import { useGetSimilarSocks, useGetSockById } from "@/api/inventory/queries";
import GenericError from "@/components/GenericError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Max number of similar socks shown
const SIMILAR_SOCKS_LIMIT = 3;

export default function SockDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const sockIdStr = params["sockId"];
  const sockId = parseInt(sockIdStr!);

  const {
    data: sock,
    isLoading: isLoadingSock,
    isError: isErrorSock,
    error: errorSock,
  } = useGetSockById(sockId);
  const {
    data: similarSocks,
    isLoading: isLoadingSimilarSocks,
    isError: isErrorSimilarSocks,
  } = useGetSimilarSocks(sockId);

  const [selectedVariant, setSelectedVariant] = useState<
    SockVariant | undefined
  >(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const isOutOfStock = !sock?.variants.some((variant) => variant.quantity > 0);

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
      sockId: sock.id!,
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
    const initialVariant = sock?.variants.find(
      (variant) => variant.quantity > 0,
    );
    if (initialVariant) {
      setSelectedVariant(initialVariant);
    }
  }, [sock]);

  return (
    <div className="mx-auto px-4 py-10 md:px-8">
      {isLoadingSock ? (
        <ItemLoadingSkeleton />
      ) : isErrorSock ? (
        <GenericError
          message={`Unable to load sock details for ID ${sockIdStr}`}
          stackTrace={errorSock.stack}
        />
      ) : (
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          <div className="h-[512px] w-full md:w-1/2">
            <img
              src={sock!.previewImageUrl}
              alt={sock!.name}
              className="h-full w-full rounded object-cover"
              onError={(e) => {
                e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
              }}
            />
          </div>

          <div className="w-full space-y-4 md:w-1/2">
            <h1 className="text-3xl font-bold">{sock!.name}</h1>
            <div className="flex items-center space-x-2">
              {/* TODO: work on the review features */}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(0 reviews)</span>
            </div>
            {isOutOfStock ? (
              <Badge variant="destructive">Out of stock</Badge>
            ) : (
              <p className="text-xl text-muted-foreground">
                ${selectedVariant?.price}
              </p>
            )}
            <p>{sock!.description}</p>

            {!isOutOfStock && (
              <div className="my-4">
                <label className="mb-1 block font-medium">Size</label>
                <div className="flex space-x-4">
                  {sock!.variants.map((variant) => (
                    <Button
                      key={variant.id!}
                      variant={`${selectedVariant?.size === variant.size ? "default" : "outline"}`}
                      size="icon"
                      onClick={() => handleSizeChange(variant)}
                      className="min-w-12"
                      disabled={variant.quantity < 1}
                    >
                      {variant.size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!isOutOfStock && (
              <div className="my-4">
                <label className="mb-1 block font-medium">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                    }
                    disabled={selectedQuantity === 1}
                  >
                    <Minus size={16} />
                    <span className="sr-only">Decrease quantity by 1</span>
                  </Button>
                  <div className="w-12 text-center">{selectedQuantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  >
                    <Plus size={16} />
                    <span className="sr-only">Increase quantity by 1</span>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pb-2 pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full"
                disabled={isOutOfStock}
              >
                <ShoppingCart className="h-8 w-8 pr-3" /> Add to cart
              </Button>

              {/* TODO: add the share and add to wishlist functionalities */}
              <Button variant="outline" size="icon" disabled={true}>
                <span className="sr-only">Add to wishlist</span>
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" disabled={true}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share product</span>
              </Button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Free shipping on orders over $50</p>
              <p>30-day easy returns</p>
              <p>Made in USA</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Similar socks</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoadingSimilarSocks ? (
            <SimilarSocksSkeleton />
          ) : isErrorSimilarSocks ? (
            <GenericError message="Unable to load similar socks" />
          ) : (
            similarSocks!.slice(0, SIMILAR_SOCKS_LIMIT).map((sock) => (
              <Card key={sock.sockId} className="p-4">
                <img
                  src={sock.previewImageUrl}
                  alt={sock.name}
                  className="h-48 w-full rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
                  }}
                />
                <h3 className="mt-4 text-lg font-semibold">{sock.name}</h3>
                <p className="text-gray-600">${sock.price}</p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleViewProduct(sock.sockId)}
                >
                  View sock
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ItemLoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
      <div className="w-full md:w-1/2">
        <Skeleton className="h-[512px] w-full rounded" />
      </div>

      <div className="w-full space-y-6 md:w-1/2">
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
  );
}

function SimilarSocksSkeleton() {
  const renderItems = () => {
    const items: ReactElement[] = [];
    for (let i = 0; i < 3; i++) {
      items.push(
        <Card className="p-4">
          <Skeleton className="h-48 w-full rounded" />
          <div className="mt-4">
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>,
      );
    }
    return items;
  };

  return renderItems();
}
