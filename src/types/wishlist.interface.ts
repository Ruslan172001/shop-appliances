export interface IWishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  addedAt: Date;
}

export interface IWishlistState {
  items: IWishlistItem[];

  // Основные методы
  addItemWishlist: (item: Omit<IWishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;

  getItemCount: () => number;
  isInWishlist: (productId: string) => boolean;
  getAllItems: () => IWishlistItem[];

  moveToCart: (productId: string) => void;
  updateItem: (
    productId: string,
    updates: Partial<Omit<IWishlistItem, "productId" | "addedAt">>,
  ) => void;
}
