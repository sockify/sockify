import { CartItem, cartItemListSchema } from "@/api/cart/model";
import { LOCAL_STORAGE_CART_ITEMS_KEY } from "@/shared/constants";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface CartContextType {
  /** Items currently in the cart. */
  items: CartItem[];
  /** Method to add an item to the cart, or increase its quantity if already present */
  addItem: (newItem: CartItem) => void;
  /** Method to remove an item completely from the cart based on its ID */
  removeItem: (item: CartItem) => void;
  /** Method to update the details of a specific item in the cart */
  updateItem: (sockVariantId: number, updatedItem: CartItem) => void;
  /** Method to empty all items from the cart (e.g., after checkout) */
  empty: () => void;
  /** True when the cart is being retrieved from local storage, false otherwise. */
  isLoading: boolean;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children?: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addItem = (newItem: CartItem) => {
    if (newItem.quantity < 1) {
      toast.error(
        `Unable to add "${newItem.name}" (${newItem.size}) to the cart since the quantity is less than one`,
      );
      return;
    }

    setItems((currentItems) => {
      let updatedItems: CartItem[];
      const idx = currentItems.findIndex(
        (cartItem) => cartItem.sockVariantId === newItem.sockVariantId,
      );

      if (idx === -1) {
        updatedItems = [...currentItems, { ...newItem }];
      } else {
        const currentQuantity = currentItems[idx].quantity;
        updatedItems = [
          ...currentItems.slice(0, idx),
          {
            ...currentItems[idx],
            quantity: currentQuantity + newItem.quantity,
          },
          ...currentItems.slice(idx + 1),
        ];
      }

      return updatedItems;
    });

    toast.success(
      `Added ${newItem.quantity}x "${newItem.name}" (${newItem.size})`,
    );
  };

  const removeItem = (item: CartItem) => {
    updateItem(item.sockVariantId, { ...item, quantity: 0 });
  };

  const updateItem = (sockVariantId: number, updatedItem: CartItem) => {
    if (updatedItem.quantity < 0) {
      toast.error("Unable to set an item's quantity to a value less than zero");
      return;
    }

    setItems((currentItems) => {
      const idx = currentItems.findIndex(
        (cartItem) => cartItem.sockVariantId === sockVariantId,
      );

      if (idx === -1) {
        console.error(
          `"${updatedItem.name}" (${updatedItem.size}) is not in the cart`,
        );
        return currentItems;
      }

      let updatedItems: CartItem[];
      if (updatedItem.quantity === 0) {
        updatedItems = currentItems.filter(
          (cartItem) => cartItem.sockVariantId !== sockVariantId,
        );
      } else {
        updatedItems = [...currentItems];
        updatedItems[idx] = { ...updatedItem };
      }

      if (updatedItems.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_CART_ITEMS_KEY);
      }

      return updatedItems;
    });
  };

  const empty = () => {
    setItems([]);
    localStorage.removeItem(LOCAL_STORAGE_CART_ITEMS_KEY);
  };

  const saveToStorage = useCallback(() => {
    if (items.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(items));
    }
  }, [items]);

  const loadFromStorage = useCallback(() => {
    const stringifiedStoredItems = localStorage.getItem(
      LOCAL_STORAGE_CART_ITEMS_KEY,
    );

    if (stringifiedStoredItems) {
      try {
        const storedItems = JSON.parse(stringifiedStoredItems);
        const parsedItems = cartItemListSchema.parse(storedItems);
        setItems(parsedItems);
      } catch {
        toast.error(
          "Invalid cart items were found in local storage, unable to restore the cart",
        );
        empty();
      }
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  useEffect(() => {
    saveToStorage();
  }, [items, saveToStorage]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        empty,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within an CartProvider");
  }
  return context;
};
