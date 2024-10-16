import { Address } from "@/api/cart/model";

// Converts an `Address` type to a combined shipping address string
export function toShippingAddress(address: Address): string {
  // TODO: add city
  return `${address.street}${address.aptUnit && `, Apt/Unit ${address.aptUnit}`}, ${address.state}, ${address.zipcode}`;
}
