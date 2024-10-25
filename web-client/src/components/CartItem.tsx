import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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
        <Card className="w-full mx-auto mb-4" >
            <CardContent className="flex flex-col gap-4 md:flex-row justify-between p-4">
                <div className="flex gap-4 items-center">
                    <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="text-lg font-semibold">
                        <h3 className="mb-1">{name}</h3>
                        <p className="text-sm mb-1 text-gray-400">Size: {size}</p>
                        <p className="text-base font-bold">${price.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={onDecrease}>
                            -
                        </Button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <Button variant="outline" onClick={onIncrease}>
                            +
                        </Button>
                    </div>
                    <Button variant="destructive" onClick={onRemove}>
                        <Trash2 />
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
};


