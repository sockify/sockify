import { CartItem as CartItemType } from "@/api/cart/model";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CartItem from "../components/CartItem";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateItem, removeItem, isLoading } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleIncrease = (item: CartItemType) => {
    updateItem(item.sockVariantId, { ...item, quantity: item.quantity + 1 });
  };

  const handleDecrease = (item: CartItemType) => {
    updateItem(item.sockVariantId, { ...item, quantity: item.quantity - 1 });
  };

  const handleRemove = (item: CartItemType) => {
    removeItem(item);
  };

  const handleCheckout = () => {
    navigate("/cart/checkout");
  };

  return (
    <div className="mx-auto px-4 py-10 2xl:container md:px-8">
      <h1 className="mb-8 text-3xl font-extrabold">Your cart</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : items.length > 0 ? (
        <>
          {items.map((item) => (
            <CartItem
              key={item.sockVariantId}
              item={item}
              onIncrease={() => handleIncrease(item)}
              onDecrease={() => handleDecrease(item)}
              onRemove={() => handleRemove(item)}
            />
          ))}

          <Card className="p-4">
            <div className="flex justify-between text-xl font-extrabold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleCheckout}>Proceed to checkout</Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-8 p-4 text-center">
          <ShoppingCart className="h-64 w-64 text-muted" />
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">Cart is empty</h3>
            <p className="text-muted-foreground">
              Keep browsing to find the pair for you!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
