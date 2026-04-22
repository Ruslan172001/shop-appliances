export interface IProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: IProductImage[];
  category: ICategory;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  quantity: number;
  specifications?: IProductSpecifications | null;
  model?: string | null;
  color?: string | null;
  country?: string | null;
  badge?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IProductCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: IProductImage[];
  category: ICategory;
  rating?: number;
  reviewCount?: number;
  quantity: number;
}
export interface IProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain: boolean;
  order: number;
}

export interface IProductSpecifications {
  // Для бытовой техники
  volume?: string;
  energyClass?: string;
  dimensions?: string;
  weight?: string;
  noiseLevel?: string;
  compressorType?: string;

  // Для стиральных машин
  loadCapacity?: string;
  spinSpeed?: string;
  programs?: number;
  steamFunction?: boolean;

  // Для телевизоров
  diagonal?: string;
  resolution?: string;
  hdr?: string;
  smartTV?: string;
  refreshRate?: string;
  hdmiPorts?: number;

  // Для ноутбуков
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  batteryLife?: string;
  ports?: string;

  // Для смартфонов
  camera?: string;
  battery?: string;
  waterResistance?: string;
  connectivity?: string;

  // Для очистителей
  coverage?: string;
  cadr?: string;
  filterType?: string;
  powerConsumption?: string;
  smartControl?: boolean;

  // Динамические характеристики
  [key: string]: string | number | boolean | undefined | null;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  productCount?: number;
  parent?: ICategory;
  children?: ICategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStock?: boolean;
  rating?: number;
  specifications?: Record<string, string | boolean>;
}

export interface IProductSort {
  field: "price" | "rating" | "name" | "createdAt";
  order: "asc" | "desc";
}
