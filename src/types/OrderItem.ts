export interface OrderItem {
  _id?: string;
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemBasePrice?: number;
  itemPrice?: number;
  itemQuantity?: number;
  itemVariations?: Record<string, string>; // Changed from ItemVariation[] to object
  itemInstructions?: string;
}

// You can remove the ItemVariation interface since it's no longer needed
// Or keep it if you use it elsewhere, but update itemVariations type
