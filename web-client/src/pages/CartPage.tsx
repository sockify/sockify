import React from 'react';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Hard-coded items for testing purposes
const items = [
  {
    sockId: 1,
    sockVariantId: 12,
    name: 'Socks (awesome)',
    size: 'XL',
    price: 21.20,
    quantity: 2,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    sockId: 2,
    sockVariantId: 13,
    name: 'Retro Socks',
    size: 'M',
    price: 15.50,
    quantity: 1,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

const CartPage: React.FC = () => {
  const handleIncrease = (id: number) => {
    console.log(`Increased product ID ${id} by 1.`);
  };

  const handleDecrease = (id: number) => {
    console.log(`Decreased product ID ${id} by 1.`);
  };

  const handleRemove = (id: number) => {
    console.log(`Removed product ID ${id} from the cart.`);
  };

  // Calculate the subtotal (sum of all items' total prices)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page mx-auto px-4 py-12 2xl:container md:px-8">
      {items.length > 0 ? (
        <>
          {items.map((item) => (
            <CartItem
              key={item.sockVariantId}
              sockId={item.sockId}
              sockVariantId={item.sockVariantId}
              name={item.name}
              size={item.size}
              price={item.price}
              quantity={item.quantity}
              imageUrl={item.imageUrl}
              onIncrease={() => handleIncrease(item.sockVariantId)}
              onDecrease={() => handleDecrease(item.sockVariantId)}
              onRemove={() => handleRemove(item.sockVariantId)}
            />
          ))}

          {/* Subtotal section */}
          <Card className="p-4">
            <div className="flex justify-between text-xl font-semibold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </Card>

          {/* Proceed to Checkout Button */}
          <div className="flex justify-end mt-6">
            <Button className="bg-black text-white px-6 py-3 rounded-lg font-bold">
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <Card className="text-center p-4">
          <p>Your cart is empty.</p>
        </Card>
      )}
    </div>
  );
};

export default CartPage;
