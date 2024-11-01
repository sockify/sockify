import { CartItem as CartItemType } from "@/api/cart/model";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";

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
          />
          <div className="text-lg font-semibold">
            <h3 className="mb-1">{item.name}</h3>
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
              onClick={onDecrease}
              aria-label={`Decrease quantity of ${item.name} by 1`}
            >
              <Minus size="16" />
            </Button>
            <span className="text-lg font-semibold">{item.quantity}</span>
            <Button
              variant="outline"
              onClick={onIncrease}
              aria-label={`Increase quantity of ${item.name} by 1`}
            >
              <Plus size="16" />
            </Button>
          </div>
          <Button
            variant="destructive"
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
