import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import QuickViewModal from '../components/product/QuickViewModal';
import type { ProductItem, FilterState } from '../types';
import api from '../lib/api';

const CATEGORIES_LIST = [
  { name: 'T-Shirts & Tanks', slug: 't-shirts' },
  { name: 'Architectural Shirts', slug: 'shirts' },
  { name: 'Tailored Trousers', slug: 'trousers' },
  { name: 'Selvedge Denim', slug: 'jeans' },
];

const SEED_CATALOG: ProductItem[] = [
  {
    _id: 'prod-1',
    title: 'Minimalist Heavyweight Box Tee — Onyx Black',
    slug: 'minimalist-heavyweight-box-tee-black',
    price: 2499,
    compareAtPrice: 3199,
    category: { name: 'T-Shirts', slug: 't-shirts' },
    isNewArrival: true,
    isBestSeller: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
    ],
    variants: [
      { sku: 'TEE-BLK-S', size: 'S', colorName: 'Onyx Black', stock: 12 },
      { sku: 'TEE-BLK-M', size: 'M', colorName: 'Onyx Black', stock: 18 },
      { sku: 'TEE-BLK-L', size: 'L', colorName: 'Onyx Black', stock: 15 },
      { sku: 'TEE-BLK-XL', size: 'XL', colorName: 'Onyx Black', stock: 8 },
      { sku: 'TEE-BLK-XXL', size: 'XXL', colorName: 'Onyx Black', stock: 4 },
    ],
  },
  {
    _id: 'prod-2',
    title: 'Architectural Camp-Collar Linen Shirt — Sandstone',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    price: 3499,
    compareAtPrice: 4299,
    category: { name: 'Shirts', slug: 'shirts' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80' },
    ],
    variants: [
      { sku: 'SHIRT-SND-S', size: 'S', colorName: 'Sandstone', stock: 5 },
      { sku: 'SHIRT-SND-M', size: 'M', colorName: 'Sandstone', stock: 9 },
      { sku: 'SHIRT-SND-L', size: 'L', colorName: 'Sandstone', stock: 14 },
      { sku: 'SHIRT-SND-XL', size: 'XL', colorName: 'Sandstone', stock: 6 },
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
      { sku: 'TRS-CHR-S', size: 'S', colorName: 'Charcoal', stock: 7 },
      { sku: 'TRS-CHR-M', size: 'M', colorName: 'Charcoal', stock: 12 },
      { sku: 'TRS-CHR-L', size: 'L', colorName: 'Charcoal', stock: 9 },
      { sku: 'TRS-CHR-XL', size: 'XL', colorName: 'Charcoal', stock: 4 },
    ],
  },
  {
    _id: 'prod-4',
    title: '14.5oz Japanese Selvedge Raw Denim — Indigo',
    slug: 'japanese-selvedge-raw-denim-indigo',
    price: 4999,
    compareAtPrice: 5999,
    category: { name: 'Jeans', slug: 'jeans' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80' },
    ],
    variants: [
      { sku: 'DNM-IND-S', size: 'S', colorName: 'Raw Indigo', stock: 5 },
      { sku: 'DNM-IND-M', size: 'M', colorName: 'Raw Indigo', stock: 10 },
      { sku: 'DNM-IND-L', size: 'L', colorName: 'Raw Indigo', stock: 8 },
      { sku: 'DNM-IND-XL', size: 'XL', colorName: 'Raw Indigo', stock: 3 },
    ],
  },
  {
    _id: 'prod-5',
    title: 'Supima Heavy Cotton Graphic Tee — Atelier Noir',
    slug: 'supima-heavy-cotton-graphic-tee-atelier',
    price: 2799,
    compareAtPrice: 3499,
    category: { name: 'T-Shirts', slug: 't-shirts' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
    ],
    variants: [
      { sku: 'TEE-GRA-M', size: 'M', colorName: 'Vintage Noir', stock: 15 },
      { sku: 'TEE-GRA-L', size: 'L', colorName: 'Vintage Noir', stock: 11 },
      { sku: 'TEE-GRA-XL', size: 'XL', colorName: 'Vintage Noir', stock: 5 },
    ],
  },
  {
    _id: 'prod-6',
    title: 'Tailored Poplin Overshirt — Bone White',
    slug: 'tailored-poplin-overshirt-bone-white',
    price: 3899,
    category: { name: 'Shirts', slug: 'shirts' },
    isBestSeller: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
    ],
    variants: [
      { sku: 'SHIRT-WHT-S', size: 'S', colorName: 'Bone White', stock: 6 },
      { sku: 'SHIRT-WHT-M', size: 'M', colorName: 'Bone White', stock: 14 },
      { sku: 'SHIRT-WHT-L', size: 'L', colorName: 'Bone White', stock: 10 },
      { sku: 'SHIRT-WHT-XL', size: 'XL', colorName: 'Bone White', stock: 8 },
    ],
  },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<ProductItem[]>(SEED_CATALOG);
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('price') || '',
    size: searchParams.get('size') || '',
    fit: searchParams.get('fit') || '',
    inStockOnly: false,
    sortBy: searchParams.get('sort') || 'newest',
  });

  // Sync with searchParams
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  // Fetch from server API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.set('category', filters.category);
        if (filters.sortBy) queryParams.set('sort', filters.sortBy);

        const res: any = await api.get(`/products?${queryParams.toString()}`);
        const list = res.data?.data?.products || res.data?.products;
        if (list && list.length > 0) {
          const normalized = list.map((p: any) => ({
            _id: p._id,
            title: p.title || p.name,
            slug: p.slug,
            price: p.price || p.basePrice,
            compareAtPrice: p.compareAtPrice,
            images: p.images || [],
            variants: p.variants || [],
            category: p.category,
            isNewArrival: p.isNewArrival,
            isBestSeller: p.isBestSeller,
          }));
          setAllProducts(normalized);
        }
      } catch {
        // Fallback already preloaded
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters.category, filters.sortBy]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (filters.category) {
        const catSlug =
          typeof product.category === 'object' && product.category
            ? product.category.slug
            : product.category;
        if (catSlug !== filters.category) return false;
      }

      // Price filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (product.price < min || product.price > max) return false;
      }

      // Size filter
      if (filters.size) {
        const hasSize = (product.variants || []).some(
          (v) => v.size === filters.size && v.stock > 0
        );
        if (!hasSize) return false;
      }

      // In stock only
      if (filters.inStockOnly) {
        const totalStock = (product.variants || []).reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      return 0; // Default order
    });
  }, [allProducts, filters]);

  const activeCategoryName = CATEGORIES_LIST.find((c) => c.slug === filters.category)?.name;

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-20 transition-colors" style={{ backgroundColor: 'var(--site-bg)', color: 'var(--site-text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Page Header & Breadcrumbs ─────────────── */}
        <div className="border-b border-db-neutral-200 pb-8 mb-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-db-neutral-500 mb-2">
            <span>Home</span> / <span className="text-db-black font-semibold">Menswear Collection</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-db-black">
                {activeCategoryName || 'All Menswear Garments'}
              </h1>
              <p className="text-xs sm:text-sm text-db-neutral-600 mt-1 max-w-xl">
                Precision cut, heavyweight fabrics, and uncompromising silhouettes designed for enduring sartorial distinction.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-db-neutral-300 text-xs font-semibold uppercase tracking-wider text-db-black"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="appearance-none bg-white border border-db-neutral-300 text-xs font-semibold tracking-wider uppercase px-4 py-2.5 pr-8 focus:outline-none focus:border-db-black cursor-pointer text-db-black"
                >
                  <option value="newest">Sort: Newest Drops</option>
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-db-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(filters.category || filters.size || filters.priceRange || filters.fit) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-db-neutral-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-db-neutral-500 mr-1">
                Active:
              </span>
              {filters.category && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-db-neutral-100 text-[11px] font-medium uppercase text-db-black border border-db-neutral-200">
                  {activeCategoryName || filters.category}
                  <button onClick={() => setFilters({ ...filters, category: '' })}>
                    <X className="w-3 h-3 text-db-neutral-500 hover:text-db-black" />
                  </button>
                </span>
              )}
              {filters.size && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-db-neutral-100 text-[11px] font-medium uppercase text-db-black border border-db-neutral-200">
                  Size: {filters.size}
                  <button onClick={() => setFilters({ ...filters, size: '' })}>
                    <X className="w-3 h-3 text-db-neutral-500 hover:text-db-black" />
                  </button>
                </span>
              )}
              {filters.priceRange && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-db-neutral-100 text-[11px] font-medium uppercase text-db-black border border-db-neutral-200">
                  Price Filtered
                  <button onClick={() => setFilters({ ...filters, priceRange: '' })}>
                    <X className="w-3 h-3 text-db-neutral-500 hover:text-db-black" />
                  </button>
                </span>
              )}
              <button
                onClick={() =>
                  setFilters({
                    category: '',
                    priceRange: '',
                    size: '',
                    fit: '',
                    inStockOnly: false,
                    sortBy: 'newest',
                  })
                }
                className="text-[11px] text-db-neutral-500 hover:text-db-black underline uppercase tracking-wider ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Main Layout: Sidebar + Product Grid ────────── */}
        <div className="flex gap-8 items-start">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            categories={CATEGORIES_LIST}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalProductsCount={filteredProducts.length}
          />

          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onQuickView={(p) => setQuickViewProduct(p)}
              onResetFilters={() =>
                setFilters({
                  category: '',
                  priceRange: '',
                  size: '',
                  fit: '',
                  inStockOnly: false,
                  sortBy: 'newest',
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
