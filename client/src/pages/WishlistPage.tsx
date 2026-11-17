import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store';
import ProductCard from '../components/product/ProductCard';
import type { ProductItem } from '../types';

// Sample fallback items for wishlist preview if empty or testing
const DEMO_WISHLIST_PRODUCTS: ProductItem[] = [
  {
    _id: 'prod-1',
    title: 'Minimalist Heavyweight Box Tee — Onyx Black',
    slug: 'minimalist-heavyweight-box-tee-black',
    price: 2499,
    compareAtPrice: 3199,
    category: { name: 'T-Shirts', slug: 't-shirts' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
    ],
    variants: [
      { sku: 'TEE-BLK-S', size: 'S', colorName: 'Onyx Black', stock: 12 },
      { sku: 'TEE-BLK-M', size: 'M', colorName: 'Onyx Black', stock: 18 },
      { sku: 'TEE-BLK-L', size: 'L', colorName: 'Onyx Black', stock: 15 },
    ],
  },
  {
    _id: 'prod-3',
    title: 'Double-Pleated Relaxed Trouser — Slate Charcoal',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    price: 4199,
    category: { name: 'Trousers', slug: 'trousers' },
    isBestSeller: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80' },
    ],
    variants: [
      { sku: 'TRS-CHR-M', size: 'M', colorName: 'Charcoal', stock: 12 },
      { sku: 'TRS-CHR-L', size: 'L', colorName: 'Charcoal', stock: 9 },
    ],
  },
];

export default function WishlistPage() {
  const { productIds } = useWishlistStore();

  const activeWishlist = DEMO_WISHLIST_PRODUCTS.filter((p) =>
    productIds.size === 0 ? true : productIds.has(p._id)
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-db-neutral-200 pb-6 mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-db-black">
              Private Wishlist
            </h1>
            <p className="text-xs text-db-neutral-500 mt-1">
              Curated garments reserved for your consideration
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-db-neutral-500">
            {activeWishlist.length} Items
          </span>
        </div>

        {activeWishlist.length === 0 ? (
          <div className="text-center py-20 bg-db-neutral-50 border border-db-neutral-200">
            <Heart className="w-12 h-12 mx-auto text-db-neutral-300 mb-4" />
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-db-black mb-2">
              Your Wishlist Is Empty
            </h2>
            <p className="text-xs text-db-neutral-500 max-w-sm mx-auto mb-6">
              Save your favorite tailored silhouettes and heavyweight staples to curate your capsule wardrobe.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-db-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-db-charcoal"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {activeWishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
