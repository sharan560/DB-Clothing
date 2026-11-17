import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, MapPin, LogOut, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store';
import api from '../lib/api';

const DEMO_ORDERS = [
  {
    _id: 'DB-89214',
    createdAt: '2026-10-18T10:30:00.000Z',
    status: 'dispatched',
    total: 6698,
    items: [
      {
        title: 'Minimalist Heavyweight Box Tee — Onyx Black',
        size: 'L',
        quantity: 1,
        price: 2499,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200',
      },
      {
        title: 'Double-Pleated Relaxed Trouser — Slate Charcoal',
        size: 'M',
        quantity: 1,
        price: 4199,
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200',
      },
    ],
  },
];

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS);

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res: any = await api.get('/orders');
        const list = res.data?.data || res.data?.orders;
        if (list && list.length > 0) {
          setOrders(list);
        }
      } catch {
        // Fallback demo orders retained
      }
    };
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Delivered</span>;
      case 'dispatched':
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">In Air Transit</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Atelier Finishing</span>;
      default:
        return <span className="bg-db-neutral-200 text-db-neutral-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Confirmed</span>;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-db-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Profile Banner */}
        <div className="bg-white p-6 sm:p-8 border border-db-neutral-200 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-db-gold font-bold">
              PATRON PROFILE
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-db-black mt-1">
              {user?.name || 'Devraj Bansal'}
            </h1>
            <p className="text-xs text-db-neutral-500">{user?.email || 'customer@dbclothing.in'}</p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-db-gold text-db-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400"
              >
                Go to Admin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-db-neutral-300 text-db-neutral-700 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-db-neutral-200 mb-8 space-x-8 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors ${
              activeTab === 'orders'
                ? 'text-db-black font-bold border-b-2 border-db-black -mb-[1px]'
                : 'text-db-neutral-400 hover:text-db-black'
            }`}
          >
            Orders & Acquisitions ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors ${
              activeTab === 'profile'
                ? 'text-db-black font-bold border-b-2 border-db-black -mb-[1px]'
                : 'text-db-neutral-400 hover:text-db-black'
            }`}
          >
            Atelier Membership Details
          </button>
        </div>

        {/* Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-db-neutral-200">
                <Package className="w-10 h-10 mx-auto text-db-neutral-400 mb-3" />
                <h3 className="font-serif text-lg font-bold uppercase text-db-black">
                  No Past Orders Found
                </h3>
                <p className="text-xs text-db-neutral-500 mb-6">
                  You haven't placed an order with DB Clothing yet.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-db-black text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord._id} className="bg-white p-6 sm:p-8 border border-db-neutral-200 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-db-neutral-200 gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-db-neutral-500">Order Reference</span>
                      <p className="font-mono text-sm font-bold text-db-black">{ord._id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-db-neutral-500 block">Total</span>
                        <span className="text-sm font-bold text-db-black">₹{ord.total?.toLocaleString('en-IN')}</span>
                      </div>
                      {getStatusBadge(ord.status)}
                    </div>
                  </div>

                  {/* Line items */}
                  <div className="divide-y divide-db-neutral-100">
                    {ord.items?.map((item: any, i: number) => (
                      <div key={i} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150'}
                            alt={item.title}
                            className="w-12 h-16 object-cover object-top bg-db-neutral-100"
                          />
                          <div>
                            <p className="text-xs font-bold text-db-black">{item.title}</p>
                            <p className="text-[11px] text-db-neutral-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-db-black">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-db-neutral-200 flex justify-between items-center text-xs">
                    <span className="text-db-neutral-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Ordered on {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                    <Link
                      to={`/order-success/${ord._id}`}
                      className="text-db-black font-semibold uppercase tracking-wider hover:text-db-gold inline-flex items-center gap-1"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 border border-db-neutral-200 max-w-xl space-y-6">
            <h3 className="font-serif text-lg font-bold uppercase text-db-black pb-3 border-b border-db-neutral-200">
              Patron Membership Status
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-db-neutral-500 uppercase tracking-wider">Tier</p>
                <p className="font-bold text-db-black text-sm mt-0.5">Private Atelier Circle (Tier 1)</p>
              </div>
              <div>
                <p className="text-db-neutral-500 uppercase tracking-wider">Perks</p>
                <p className="text-db-neutral-700 mt-0.5">Complimentary express shipping, 48-hour early access to seasonal capsule drops, bespoke tailoring assistance.</p>
              </div>
              <div>
                <p className="text-db-neutral-500 uppercase tracking-wider">Registered Email</p>
                <p className="font-mono text-db-black mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
