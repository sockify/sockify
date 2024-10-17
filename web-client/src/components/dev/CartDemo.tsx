import { CartItem } from "@/api/cart/model";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const item1: CartItem = {
  sockVariantId: 1,
  name: "Classic Socks",
  quantity: 1,
  price: 19.0,
  size: "LG",
  imageUrl: "some url",
};

const item2: CartItem = {
  sockVariantId: 2,
  name: "Retro Socks",
  quantity: 2,
  price: 30.0,
  size: "S",
  imageUrl: "some url",
};

const invalidItem: CartItem = {
  sockVariantId: 2,
  name: "Out of Phase Rockers",
  quantity: -20,
  price: 30.0,
  size: "XL",
  imageUrl: "some url",
};

export default function CartDemo() {
  const { addItem, items, removeItem, empty, updateItem, isLoading } =
    useCart();

  return (
    <div className="flex flex-col gap-4">
      <div className="space-x-2">
        <Button
          onClick={() => {
            addItem(item1);
          }}
        >
          +1 Add (Classic socks)
        </Button>

        <Button
          onClick={() => {
            addItem(item2);
          }}
        >
          +2 Add (Retro socks)
        </Button>

        <Button
          onClick={() => {
            addItem(invalidItem);
          }}
        >
          Add Invalid Item
        </Button>
      </div>

      <div className="space-x-2">
        <Button
          variant="destructive"
          onClick={() => {
            removeItem(item1);
          }}
        >
          Remove (Classic socks)
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            removeItem(item2);
          }}
        >
          Remove (Retro socks)
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button onClick={() => updateItem(1, { ...item1, quantity: 10 })}>
          Set "Classic socks" Quantity to 10
        </Button>
        <Button onClick={() => updateItem(2, { ...item2, quantity: 20 })}>
          Set "Retro socks" Quantity to 20
        </Button>

        <Button onClick={() => updateItem(1, { ...item1, quantity: 0 })}>
          Set "Classic socks" Quantity to 0
        </Button>
        <Button onClick={() => updateItem(2, { ...item2, quantity: -20 })}>
          Set "Retro socks" Quantity to -20
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          empty();
        }}
      >
        Empty
      </Button>

      <div className="flex flex-col gap-6">
        {isLoading && <p>Loading cart...</p>}

        {items.length > 0
          ? items.map((item) => (
              <div key={item.sockVariantId}>
                [Q: {item.quantity}] {item.name} ({item.size}) - ${item.price}{" "}
                <Button
                  variant="destructive"
                  onClick={() =>
                    updateItem(item.sockVariantId, {
                      ...item,
                      quantity: item.quantity - 1,
                    })
                  }
                >
                  -1 Decrement
                </Button>{" "}
                <Button
                  onClick={() =>
                    updateItem(item.sockVariantId, {
                      ...item,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  +1 Increment
                </Button>
              </div>
            ))
          : !isLoading && <p>Cart is empty.</p>}
      </div>
    </div>
  );
}
