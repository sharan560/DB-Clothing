import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import type { FilterState } from '../../types';

export type { FilterState };

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: { _id?: string; name: string; slug: string }[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  totalProductsCount: number;
}

const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹1,500', value: '0-1500' },
  { label: '₹1,500 – ₹3,000', value: '1500-3000' },
  { label: '₹3,000 – ₹5,000', value: '3000-5000' },
  { label: '₹5,000 and above', value: '5000-999999' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FITS = ['All Fits', 'Oversized', 'Relaxed', 'Slim', 'Regular'];

export default function FilterSidebar({
  filters,
  onChange,
  categories,
  isMobileOpen,
  onCloseMobile,
  totalProductsCount,
}: FilterSidebarProps) {
  const handleCategoryChange = (slug: string) => {
    onChange({ ...filters, category: filters.category === slug ? '' : slug });
  };

  const handlePriceChange = (val: string) => {
    onChange({ ...filters, priceRange: val });
  };

  const handleSizeChange = (s: string) => {
    onChange({ ...filters, size: filters.size === s ? '' : s });
  };

  const handleFitChange = (fit: string) => {
    onChange({ ...filters, fit: fit === 'All Fits' ? '' : fit });
  };

  const handleReset = () => {
    onChange({
      category: '',
      priceRange: '',
      size: '',
      fit: '',
      inStockOnly: false,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.priceRange ||
    filters.size ||
    filters.fit ||
    filters.inStockOnly;

  const content = (
    <div className="space-y-7">
      {/* Active filters header */}
      <div className="flex items-center justify-between pb-3 border-b border-db-neutral-200">
        <span className="text-xs font-serif font-bold uppercase tracking-wider text-db-black">
          Filter By
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[11px] font-medium text-db-neutral-500 hover:text-db-black underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-db-black mb-3">
          Categories
        </h4>
        <ul className="space-y-1.5 text-xs">
          <li>
            <button
              onClick={() => handleCategoryChange('')}
              className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                !filters.category
                  ? 'font-bold text-db-black'
                  : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <span>All Menswear</span>
              {!filters.category && <Check className="w-3.5 h-3.5" />}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => handleCategoryChange(cat.slug)}
                className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                  filters.category === cat.slug
                    ? 'font-bold text-db-black'
                    : 'text-db-neutral-600 hover:text-db-black'
                }`}
              >
                <span>{cat.name}</span>
                {filters.category === cat.slug && <Check className="w-3.5 h-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div className="pt-4 border-t border-db-neutral-200">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-db-black mb-3">
          Size
        </h4>
        <div className="grid grid-cols-5 gap-1.5">
          {SIZES.map((sz) => {
            const isSelected = filters.size === sz;
            return (
              <button
                key={sz}
                onClick={() => handleSizeChange(sz)}
                className={`py-1.5 text-xs font-semibold tracking-wider uppercase border text-center transition-all ${
                  isSelected
                    ? 'bg-db-black text-white border-db-black'
                    : 'bg-white text-db-neutral-700 border-db-neutral-300 hover:border-db-black'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-db-neutral-200">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-db-black mb-3">
          Price Range
        </h4>
        <div className="space-y-2 text-xs">
          {PRICE_RANGES.map((p) => (
            <label
              key={p.value}
              className="flex items-center gap-2.5 cursor-pointer text-db-neutral-700 hover:text-db-black"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === p.value}
                onChange={() => handlePriceChange(p.value)}
                className="w-3.5 h-3.5 text-db-black focus:ring-db-black border-db-neutral-300"
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fits */}
      <div className="pt-4 border-t border-db-neutral-200">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-db-black mb-3">
          Silhouette / Fit
        </h4>
        <div className="space-y-1.5 text-xs">
          {FITS.map((ft) => (
            <button
              key={ft}
              onClick={() => handleFitChange(ft)}
              className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                (ft === 'All Fits' && !filters.fit) || filters.fit === ft
                  ? 'font-bold text-db-black'
                  : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <span>{ft}</span>
              {((ft === 'All Fits' && !filters.fit) || filters.fit === ft) && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* In-stock toggle */}
      <div className="pt-4 border-t border-db-neutral-200">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-medium text-db-black">In-Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 text-db-black rounded border-db-neutral-300 focus:ring-db-black"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside aria-label="Product filters" className="hidden lg:block w-60 flex-shrink-0 pr-6">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-db-neutral-200 flex items-center justify-between">
              <span className="text-sm font-serif font-bold uppercase tracking-wider text-db-black flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters ({totalProductsCount})
              </span>
              <button onClick={onCloseMobile} className="p-1 text-db-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{content}</div>
            <div className="p-4 border-t border-db-neutral-200 bg-db-neutral-50">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-db-black text-white text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Show {totalProductsCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
