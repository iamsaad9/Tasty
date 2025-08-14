interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryArea {
  area: string;
  postalCode: string;
  fee: number;
}

interface Delivery {
  isDeliverable: boolean;
  estimatedTime: string;
  baseFee: number;
  freeAbove: number;
  minOrder: number;
  areas: DeliveryArea[];
}

export interface MenuItem {
  _id?: string;
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  itemVariation: ItemVariation[];
  delivery: Delivery;
}
