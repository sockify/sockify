import { Sock } from "@/api/inventory/model";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";
import { useNavigate } from "react-router-dom";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface SockCardProps {
  sock: Sock;
}

export default function SockCard({ sock }: SockCardProps) {
  const navigate = useNavigate();

  const isOutOfStock = !sock.variants.some((variant) => variant.quantity > 0);
  const showingPrice = sock.variants.find(
    (variant) => variant.quantity > 0,
  )?.price;

  return (
    <Card
      className="group hover:cursor-pointer"
      onClick={() => navigate(`/socks/${sock.id!}`)}
    >
      <div className="aspect-square h-64 w-full overflow-hidden bg-gray-100">
        <img
          src={sock.previewImageUrl}
          alt={sock.name}
          className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
          }}
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold">{sock.name}</h3>
        {isOutOfStock ? (
          <Badge variant="destructive">Out of stock</Badge>
        ) : (
          <p className="text-sm text-muted-foreground">
            ${showingPrice!.toFixed(2)}
          </p>
        )}
      </div>
    </Card>
  );
}

export function SockCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-64 w-full" />

      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
}
