import { CartItem as CartItemType } from "@/api/cart/model";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NO_IMAGE_PLACEHOLDER } from "@/shared/constants";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <Card className="mx-auto mb-4 w-full">
      <CardContent className="flex flex-col justify-between gap-4 p-4 md:flex-row">
        <div className="flex items-center gap-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-24 w-24 rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.src = NO_IMAGE_PLACEHOLDER;
            }}
          />
          <div className="text-lg font-semibold">
            <Link to={`/socks/${item.sockId}`}>
              <h3 className="mb-1">{item.name}</h3>
            </Link>
            <p className="mb-1 text-sm text-gray-400">
              <strong>Size:</strong> {item.size}
            </p>
            <p className="text-base font-bold">${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onDecrease}
              aria-label={`Decrease quantity of ${item.name} by 1`}
            >
              <Minus size="16" />
            </Button>
            <span className="text-lg font-semibold">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={onIncrease}
              aria-label={`Increase quantity of ${item.name} by 1`}
            >
              <Plus size="16" />
            </Button>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
