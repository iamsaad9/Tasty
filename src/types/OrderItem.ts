interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

export interface OrderItem {
  _id?: string;
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemBasePrice?: number;
  itemPrice?: number;
  itemQuantity?: number;
  itemVariation?: ItemVariation[];
  itemInstructions?: string;
}
