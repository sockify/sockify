import { OrderAddress } from "@/api/orders/model";

// Converts an `Address` type to a combined shipping address string
export function toShippingAddress(address: OrderAddress): string {
  return `${address.street}${address.aptUnit && `, Apt/Unit ${address.aptUnit}`}, ${address.city}, ${address.state}, ${address.zipcode}`;
}

// Truncates a string to a limit number of characters.
export function truncate(str: string, limit: number, separator = "...") {
  if (str.length <= limit) {
    return str;
  }
  return str.substring(0, limit) + separator;
}
