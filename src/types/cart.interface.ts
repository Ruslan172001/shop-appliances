export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}

export interface ICart {
  items: ICartItem[];
  itemCount: number;
  total: number;
  discount: number;
  finalTotal: number;
}

export interface ICartState {
  addItemToCart: (item: Omit<ICartItem, "quantity">, quantity?: number) => void;
  items: ICartItem[];
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  getDiscount: () => number;
  getFinalTotal: () => number;
}
