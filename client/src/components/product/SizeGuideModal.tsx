import { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const SHIRT_MEASUREMENTS = [
  { size: 'S', chestIn: '38 - 40', chestCm: '96 - 101', lengthIn: '28.5', lengthCm: '72.4', shoulderIn: '18.0', shoulderCm: '45.7' },
  { size: 'M', chestIn: '40 - 42', chestCm: '101 - 107', lengthIn: '29.5', lengthCm: '74.9', shoulderIn: '18.7', shoulderCm: '47.5' },
  { size: 'L', chestIn: '42 - 44', chestCm: '107 - 112', lengthIn: '30.5', lengthCm: '77.5', shoulderIn: '19.5', shoulderCm: '49.5' },
  { size: 'XL', chestIn: '44 - 46', chestCm: '112 - 117', lengthIn: '31.5', lengthCm: '80.0', shoulderIn: '20.2', shoulderCm: '51.3' },
  { size: 'XXL', chestIn: '46 - 48', chestCm: '117 - 122', lengthIn: '32.5', lengthCm: '82.5', shoulderIn: '21.0', shoulderCm: '53.3' },
];

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-db-neutral-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-db-neutral-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-db-gold" />
              <h3 className="text-base font-serif font-bold text-db-black uppercase tracking-wider">
                Garment Measurement & Size Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-db-neutral-400 hover:text-db-black p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Unit Switcher */}
            <div className="flex justify-between items-center bg-db-neutral-50 p-2.5 border border-db-neutral-200">
              <span className="text-xs text-db-neutral-600 font-medium uppercase tracking-wider">
                Select Display Unit:
              </span>
              <div className="inline-flex rounded-none p-0.5 bg-db-neutral-200">
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase transition-colors ${
                    unit === 'inches'
                      ? 'bg-db-black text-white'
                      : 'text-db-neutral-700 hover:text-db-black'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase transition-colors ${
                    unit === 'cm'
                      ? 'bg-db-black text-white'
                      : 'text-db-neutral-700 hover:text-db-black'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Measurements Table */}
            <div className="overflow-x-auto border border-db-neutral-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-db-neutral-100 text-db-black uppercase tracking-wider font-semibold border-b border-db-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">To Fit Chest</th>
                    <th className="py-3 px-4">Body Length</th>
                    <th className="py-3 px-4">Shoulder Width</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-db-neutral-200">
                  {SHIRT_MEASUREMENTS.map((row) => (
                    <tr key={row.size} className="hover:bg-db-neutral-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-db-black">{row.size}</td>
                      <td className="py-3 px-4 text-db-neutral-700">
                        {unit === 'inches' ? row.chestIn : row.chestCm} {unit === 'inches' ? 'in' : 'cm'}
                      </td>
                      <td className="py-3 px-4 text-db-neutral-700">
                        {unit === 'inches' ? row.lengthIn : row.lengthCm} {unit === 'inches' ? 'in' : 'cm'}
                      </td>
                      <td className="py-3 px-4 text-db-neutral-700">
                        {unit === 'inches' ? row.shoulderIn : row.shoulderCm} {unit === 'inches' ? 'in' : 'cm'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fit Tips */}
            <div className="bg-db-neutral-50 p-4 border border-db-neutral-200 space-y-2">
              <h4 className="text-xs font-bold text-db-black uppercase tracking-wider">
                Fit Advisory
              </h4>
              <ul className="text-xs text-db-neutral-600 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Oversized Fits:</strong> Our graphic and luxury heavy tees are engineered with a dropped shoulder and generous silhouette. We recommend taking your normal size for the intended drape, or sizing down for a closer classic fit.
                </li>
                <li>
                  <strong>Oxford & Linen Shirts:</strong> Tailored modern regular fit. True to size with enough ease for ease of movement.
                </li>
                <li>
                  <strong>Model Reference:</strong> Male model is 6'1" (185cm) with a 39" chest and wears size <strong>Large</strong>.
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-db-neutral-100 px-6 py-3 border-t border-db-neutral-200 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-db-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-db-charcoal transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
