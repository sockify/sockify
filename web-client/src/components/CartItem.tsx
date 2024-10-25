import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/api/cart/model";

interface CartItemProps {
    item: CartItemType;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

export default function CartItem({
    name,
    size,
    price,
    quantity,
    imageUrl,
    onIncrease,
    onDecrease,
    onRemove
}: CartItemProps) {

    return (
        <Card className="w-full mx-auto mb-4">
            <CardContent className="flex flex-col gap-4 md:flex-row justify-between p-4">
                <div className="flex gap-4 items-center">
                    <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="text-lg font-semibold">
                        <h3 className="mb-1">{name}</h3>
                        <p className="mb-1 text-sm text-gray-400">
                            <strong>Size:</strong> {size}
                        </p>
                        <p className="text-base font-bold">${price.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={onDecrease} aria-label={`Decrease quantity of ${name}`}>
                            -
                        </Button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <Button variant="outline" onClick={onIncrease} aria-label={`Increase quantity of ${name}`}>
                            +
                        </Button>
                    </div>
                    <Button variant="destructive" onClick={onRemove} aria-label={`Remove ${name} from cart`}>
                        <Trash2 />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
