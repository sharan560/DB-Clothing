import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  Search,
  Filter,
  Palette,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { useStorefrontCustomizer } from '../store/customizerStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const customizer = useStorefrontCustomizer();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'theme'>('overview');

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 428950,
    totalOrders: 142,
    avgOrderValue: 3020,
    activeProducts: 24,
  });

  // Mock / Live Products
  const [products, setProducts] = useState<any[]>([
    {
      _id: 'prod-1',
      title: 'Minimalist Heavyweight Box Tee — Onyx Black',
      category: 'T-Shirts',
      price: 2499,
      totalStock: 49,
      status: 'Active',
    },
    {
      _id: 'prod-2',
      title: 'Architectural Camp-Collar Linen Shirt — Sandstone',
      category: 'Shirts',
      price: 3499,
      totalStock: 34,
      status: 'Active',
    },
    {
      _id: 'prod-3',
      title: 'Double-Pleated Relaxed Trouser — Slate Charcoal',
      category: 'Trousers',
      price: 4199,
      totalStock: 32,
      status: 'Active',
    },
    {
      _id: 'prod-4',
      title: '14.5oz Japanese Selvedge Raw Denim — Indigo',
      category: 'Jeans',
      price: 4999,
      totalStock: 26,
      status: 'Active',
    },
  ]);

  // Orders
  const [orders, setOrders] = useState<any[]>([
    {
      _id: 'DB-89214',
      customerName: 'Devraj Bansal',
      customerEmail: 'devraj@example.com',
      date: '2026-10-22',
      itemsCount: 2,
      total: 6698,
      status: 'In Air Transit',
      courier: 'BlueDart (AWB: 8819283)',
    },
    {
      _id: 'DB-89215',
      customerName: 'Kabir Mehta',
      customerEmail: 'kabir.m@gmail.com',
      date: '2026-10-22',
      itemsCount: 1,
      total: 3499,
      status: 'Confirmed',
      courier: 'Pending Dispatch',
    },
    {
      _id: 'DB-89210',
      customerName: 'Arjun Singhania',
      customerEmail: 'arjun.s@outlook.com',
      date: '2026-10-21',
      itemsCount: 3,
      total: 11497,
      status: 'Delivered',
      courier: 'Delhivery (AWB: 5549102)',
    },
  ]);

  // Coupons
  const [coupons, setCoupons] = useState<any[]>([
    { code: 'DBWELCOME', discount: '10% OFF', minOrder: 1500, uses: 84, status: 'Active' },
    { code: 'ATELIER500', discount: '₹500 OFF', minOrder: 3000, uses: 37, status: 'Active' },
    { code: 'SS26VIP', discount: '15% OFF', minOrder: 5000, uses: 19, status: 'Active' },
  ]);

  // New product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'T-Shirts',
    price: '',
    stock: '',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      toast.error('Please fill in title and price');
      return;
    }
    const added = {
      _id: `prod-${Date.now()}`,
      title: newProduct.title,
      category: newProduct.category,
      price: Number(newProduct.price),
      totalStock: Number(newProduct.stock) || 20,
      status: 'Active',
    };
    setProducts([added, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({ title: '', category: 'T-Shirts', price: '', stock: '' });
    toast.success(`Created garment: ${added.title}`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Updated order ${orderId} status to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-db-neutral-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-db-black text-white px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-db-gold hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Storefront</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg tracking-wider text-white">DB ATELIER</span>
            <span className="bg-db-gold text-db-black text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
              ADMIN DIRECTOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-db-neutral-400">Signed in as <strong>{user?.name || 'Admin'}</strong></span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-db-neutral-300 hover:text-rose-400 uppercase tracking-wider font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-db-neutral-300 mb-8 bg-white p-1 rounded-sm shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-db-black text-white'
                : 'text-db-neutral-600 hover:text-db-black hover:bg-db-neutral-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-db-black text-white'
                : 'text-db-neutral-600 hover:text-db-black hover:bg-db-neutral-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-db-black text-white'
                : 'text-db-neutral-600 hover:text-db-black hover:bg-db-neutral-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Fulfillment & Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'coupons'
                ? 'bg-db-black text-white'
                : 'text-db-neutral-600 hover:text-db-black hover:bg-db-neutral-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promotions & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'theme'
                ? 'bg-db-black text-white'
                : 'text-db-neutral-600 hover:text-db-black hover:bg-db-neutral-50'
            }`}
          >
            <Palette className="w-4 h-4 text-db-gold" />
            <span>Theme & Storefront Studio</span>
          </button>
        </div>

        {/* ── Tab 1: Overview & KPIs ────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-db-neutral-500 font-semibold block">
                  Gross Revenue (FY26)
                </span>
                <p className="font-serif text-3xl font-bold text-db-black mt-2">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last month
                </span>
              </div>

              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-db-neutral-500 font-semibold block">
                  Total Orders
                </span>
                <p className="font-serif text-3xl font-bold text-db-black mt-2">
                  {stats.totalOrders}
                </p>
                <span className="text-[11px] text-db-neutral-500 mt-2 block">
                  98.2% on-time air delivery
                </span>
              </div>

              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-db-neutral-500 font-semibold block">
                  Average Order Value (AOV)
                </span>
                <p className="font-serif text-3xl font-bold text-db-black mt-2">
                  ₹{stats.avgOrderValue.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold mt-2 block">
                  +₹420 above target
                </span>
              </div>

              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-db-neutral-500 font-semibold block">
                  Live Active SKUs
                </span>
                <p className="font-serif text-3xl font-bold text-db-black mt-2">
                  {stats.activeProducts}
                </p>
                <span className="text-[11px] text-amber-700 font-medium mt-2 block">
                  2 garments low in stock
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 border border-db-neutral-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-base font-bold uppercase tracking-wider text-db-black">
                  Recent Atelier Acquisitions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-db-black font-semibold underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-db-neutral-50 uppercase tracking-wider font-semibold border-b border-db-neutral-200 text-db-neutral-600">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Patron Name</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-db-neutral-200">
                    {orders.slice(0, 3).map((o) => (
                      <tr key={o._id} className="hover:bg-db-neutral-50">
                        <td className="py-3.5 px-4 font-mono font-bold text-db-black">{o._id}</td>
                        <td className="py-3.5 px-4 font-medium text-db-black">{o.customerName}</td>
                        <td className="py-3.5 px-4 text-db-neutral-500">{o.date}</td>
                        <td className="py-3.5 px-4 font-bold text-db-black">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-db-neutral-100 text-db-black px-2 py-0.5 font-semibold uppercase text-[10px]">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Products & Inventory ──────────────── */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-db-black">
                  Garment Catalog & Real-Time Stock
                </h3>
                <p className="text-xs text-db-neutral-500">
                  Manage inventory counts, pricing, and active availability
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-db-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-db-charcoal transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Garment</span>
              </button>
            </div>

            {/* Modal: Add Product */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white max-w-md w-full p-6 border border-db-neutral-200 shadow-2xl">
                  <h4 className="font-serif text-base font-bold uppercase tracking-wider text-db-black mb-4">
                    Create New Atelier Garment
                  </h4>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-db-neutral-700 mb-1">
                        Garment Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        placeholder="e.g. Vintage Wash Denim Jacket"
                        className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-medium text-db-neutral-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                        >
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Shirts">Shirts</option>
                          <option value="Trousers">Trousers</option>
                          <option value="Jeans">Jeans</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-medium text-db-neutral-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="3499"
                          className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-db-neutral-700 mb-1">
                        Initial Stock Count
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="25"
                        className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-db-neutral-200">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-db-neutral-600 hover:text-db-black"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-db-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-db-charcoal"
                      >
                        Save Garment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto border border-db-neutral-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-db-neutral-100 uppercase tracking-wider font-semibold border-b border-db-neutral-200 text-db-black">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-db-neutral-200">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-db-neutral-50">
                      <td className="py-3.5 px-4 font-semibold text-db-black">{p.title}</td>
                      <td className="py-3.5 px-4 text-db-neutral-600">{p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-db-black">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${p.totalStock < 10 ? 'text-amber-600' : 'text-db-black'}`}>
                          {p.totalStock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            const newP = prompt('Enter new price for ' + p.title, p.price);
                            if (newP) {
                              setProducts(
                                products.map((item) =>
                                  item._id === p._id ? { ...item, price: Number(newP) } : item
                                )
                              );
                              toast.success('Updated price');
                            }
                          }}
                          className="text-db-neutral-600 hover:text-db-black p-1"
                          title="Quick edit price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 3: Orders & Fulfillment ─────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-db-black">
                Order Fulfillment & Courier Dispatch
              </h3>
              <p className="text-xs text-db-neutral-500">
                Update shipment lifecycle, assign tracking courier IDs, and notify patrons
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="p-5 border border-db-neutral-200 space-y-3 bg-db-neutral-50/50">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-db-neutral-200">
                    <div>
                      <span className="font-mono text-sm font-bold text-db-black">{o._id}</span>
                      <span className="text-xs text-db-neutral-500 ml-3">
                        Patron: <strong>{o.customerName}</strong> ({o.customerEmail})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-db-black">₹{o.total.toLocaleString('en-IN')}</span>
                      <span className="bg-db-black text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
                        {o.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-1">
                    <div className="text-xs text-db-neutral-600">
                      <span>Logistics: <strong>{o.courier}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-db-neutral-500 uppercase">Update Status:</span>
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'Confirmed')}
                        className="px-2.5 py-1 border border-db-neutral-300 text-[10px] font-semibold uppercase hover:bg-db-neutral-200"
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'In Air Transit')}
                        className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-semibold uppercase hover:bg-blue-100"
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'Delivered')}
                        className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-semibold uppercase hover:bg-emerald-100"
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 4: Coupons ──────────────────────────── */}
        {activeTab === 'coupons' && (
          <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-db-black">
                  Promotional Coupons
                </h3>
                <p className="text-xs text-db-neutral-500">
                  Manage voucher codes, minimum purchase requirements, and discounts
                </p>
              </div>

              <button
                onClick={() => {
                  const code = prompt('Enter coupon code (e.g. VIP20):');
                  if (code) {
                    setCoupons([
                      ...coupons,
                      { code: code.toUpperCase(), discount: '20% OFF', minOrder: 2500, uses: 0, status: 'Active' },
                    ]);
                    toast.success(`Created code ${code.toUpperCase()}`);
                  }
                }}
                className="px-4 py-2 bg-db-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-db-charcoal"
              >
                + Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 border border-db-neutral-200 space-y-2 bg-db-neutral-50">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-db-black tracking-wider">{c.code}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">{c.status}</span>
                  </div>
                  <p className="text-xs font-bold text-db-gold">{c.discount}</p>
                  <p className="text-[11px] text-db-neutral-500">Min. Cart Value: ₹{c.minOrder.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-db-neutral-500">Redemptions: {c.uses} times</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 5: Theme & Storefront Studio ─────────── */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white p-6 border border-db-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-db-gold" />
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-db-black">
                    Live Storefront &amp; Theme Studio
                  </h3>
                </div>
                <p className="text-xs text-db-neutral-500 mt-1">
                  Configure brand identity, luxury color schemes, font pairings, hero carousels, and section visibility.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => customizer.openCustomizer()}
                  className="px-4 py-2 border border-db-black bg-db-neutral-50 text-db-black text-xs font-bold uppercase tracking-wider hover:bg-db-black hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-db-gold" />
                  <span>Launch Visual Drawer</span>
                </button>

                <button
                  onClick={customizer.resetToDefaults}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-db-neutral-600 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={customizer.saveSettingsToServer}
                  className="px-5 py-2 bg-db-black text-white text-xs font-bold uppercase tracking-wider hover:bg-db-charcoal shadow-sm transition-all flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-db-gold" />
                  <span>Save to MongoDB</span>
                </button>
              </div>
            </div>

            {/* Grid 1: Brand & Theme Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card A: Brand Identity & Policies */}
              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-4">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-db-black pb-2 border-b border-db-neutral-200">
                  Brand Identity &amp; Store Policies
                </h4>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={customizer.storeName}
                    onChange={(e) => customizer.updateSetting('storeName', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                    Brand Tagline / Descriptor
                  </label>
                  <input
                    type="text"
                    value={customizer.storeTagline}
                    onChange={(e) => customizer.updateSetting('storeTagline', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                      Free Shipping Min (₹)
                    </label>
                    <input
                      type="number"
                      value={customizer.freeShippingThreshold}
                      onChange={(e) => customizer.updateSetting('freeShippingThreshold', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                      Return Window (Days)
                    </label>
                    <input
                      type="number"
                      value={customizer.returnWindowDays}
                      onChange={(e) => customizer.updateSetting('returnWindowDays', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={customizer.contactEmail}
                      onChange={(e) => customizer.updateSetting('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                      WhatsApp Concierge
                    </label>
                    <input
                      type="text"
                      value={customizer.contactPhone}
                      onChange={(e) => customizer.updateSetting('contactPhone', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>
                </div>
              </div>

              {/* Card B: Visual Canvas, Fonts & Accent Palette */}
              <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-4">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-db-black pb-2 border-b border-db-neutral-200">
                  Visual Theme &amp; Typography
                </h4>

                {/* Canvas mode */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-2">
                    Canvas Ambient Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light', label: 'Light Atelier' },
                      { id: 'noir', label: 'Noir Dark' },
                      { id: 'sandstone', label: 'Warm Sandstone' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => customizer.setThemeMode(m.id as any)}
                        className={`p-2 text-xs uppercase tracking-wider border text-center transition-all ${
                          customizer.themeMode === m.id
                            ? 'bg-db-black text-white border-db-black font-bold'
                            : 'bg-white text-db-neutral-700 border-db-neutral-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font pairing */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                    Typography Pairing
                  </label>
                  <select
                    value={customizer.fontPairing}
                    onChange={(e) => customizer.setFontPairing(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black bg-white cursor-pointer"
                  >
                    <option value="playfair-inter">Playfair Display (Editorial) + Inter (Modern Sans)</option>
                    <option value="cormorant-montserrat">Cormorant Garamond (Parisian) + Montserrat (Refined)</option>
                    <option value="syne-jakarta">Syne (Architectural) + Plus Jakarta Sans (Contemporary)</option>
                    <option value="cinzel-inter">Cinzel (Imperial Heritage) + Inter (Clean Sans)</option>
                  </select>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                    Corner Geometry
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'sharp', label: '0px Sharp' },
                      { id: 'tailored', label: '3px Subtle' },
                      { id: 'soft', label: '8px Soft' },
                      { id: 'pill', label: '20px Pill' },
                    ].map((rad) => (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() => customizer.setBorderRadiusStyle(rad.id as any)}
                        className={`py-1.5 text-[11px] border text-center transition-all ${
                          customizer.borderRadiusStyle === rad.id
                            ? 'bg-db-black text-white border-db-black font-bold'
                            : 'border-db-neutral-300 hover:border-db-neutral-400'
                        }`}
                      >
                        {rad.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-db-black mb-1">
                    Accent Color Hex
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customizer.accentColor}
                      onChange={(e) => customizer.setAccentColor(e.target.value)}
                      className="w-8 h-8 p-0 border border-db-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customizer.accentColor}
                      onChange={(e) => customizer.setAccentColor(e.target.value)}
                      className="w-28 px-3 py-1.5 text-xs font-mono border border-db-neutral-300 uppercase"
                    />
                    <span className="text-xs text-db-neutral-500">Live preview active across all components</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Hero Carousel & Section Toggles */}
            <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-db-neutral-200">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-db-black">
                  Hero Editorial Carousel Slides ({customizer.heroSlides.length})
                </h4>
                <button
                  onClick={customizer.addHeroSlide}
                  className="px-3 py-1 bg-db-neutral-100 hover:bg-db-black hover:text-white border border-db-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  + Add New Slide
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-db-neutral-200">
                  <thead className="bg-db-neutral-100 uppercase tracking-wider font-semibold text-db-black">
                    <tr>
                      <th className="py-2.5 px-3">Slide</th>
                      <th className="py-2.5 px-3">Badge</th>
                      <th className="py-2.5 px-3">Headline</th>
                      <th className="py-2.5 px-3">Image Preview</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-db-neutral-200">
                    {customizer.heroSlides.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-db-neutral-50">
                        <td className="py-2.5 px-3 font-bold font-mono">0{s.id}</td>
                        <td className="py-2.5 px-3 text-db-gold font-semibold">{s.badge}</td>
                        <td className="py-2.5 px-3 font-serif font-bold">{s.titleLine1} {s.titleLine2}</td>
                        <td className="py-2.5 px-3">
                          <img src={s.image} alt="" className="w-12 h-8 object-cover border" />
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-2">
                          <button
                            onClick={() => customizer.openCustomizer()}
                            className="text-xs text-db-black font-semibold underline"
                          >
                            Edit
                          </button>
                          {customizer.heroSlides.length > 1 && (
                            <button
                              onClick={() => customizer.removeHeroSlide(idx)}
                              className="text-xs text-rose-600 font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grid 3: Continuous Marquee Ticker */}
            <div className="bg-white p-6 border border-db-neutral-200 shadow-sm space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-db-black pb-2 border-b border-db-neutral-200">
                Continuous Marquee Ticker
              </h4>
              <textarea
                rows={3}
                value={customizer.marqueeText}
                onChange={(e) => customizer.updateSetting('marqueeText', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-db-neutral-300 focus:outline-none focus:border-db-black"
              />
              <p className="text-[11px] text-db-neutral-500">
                Tip: Separate atelier highlights with bullet points or asterisks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
