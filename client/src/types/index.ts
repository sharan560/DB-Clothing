export interface ProductImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  _id?: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex?: string;
  stock: number;
  price?: number;
}

export interface ProductItem {
  _id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: { name: string; slug: string } | string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  totalStock?: number;
}

export interface FilterState {
  category: string;
  priceRange: string;
  size: string;
  fit: string;
  inStockOnly: boolean;
  sortBy: string;
}
