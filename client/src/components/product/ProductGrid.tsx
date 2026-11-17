import ProductCard from './ProductCard';
import type { ProductItem } from '../../types';

interface ProductGridProps {
  products: ProductItem[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
  onQuickView?: (product: ProductItem) => void;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No garments match your selected criteria.',
  onResetFilters,
  onQuickView,
  columns = 4,
}: ProductGridProps) {
  const gridColsClass =
    columns === 3
      ? 'grid-cols-2 md:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid ${gridColsClass} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex flex-col animate-pulse">
            <div className="aspect-[3/4] bg-db-neutral-200 w-full" />
            <div className="pt-3 space-y-2">
              <div className="h-2.5 bg-db-neutral-200 w-1/3" />
              <div className="h-3.5 bg-db-neutral-200 w-3/4" />
              <div className="h-3.5 bg-db-neutral-200 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 border border-dashed border-db-neutral-300 bg-db-neutral-50/50">
        <p className="font-serif text-lg text-db-black font-semibold mb-2">
          No Products Found
        </p>
        <p className="text-xs text-db-neutral-500 max-w-sm mx-auto mb-6">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${gridColsClass} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
