
import React, { useState, useMemo } from 'react';
import { AppView, Product, CartItem } from './types';
import StoreGrid from './components/StoreGrid';
import AIAssistant from './components/AIAssistant';
import CartView from './components/CartView';
import CategoryListView from './components/CategoryListView';
import WhatsAppButton from './components/WhatsAppButton';
import CartConfirmation from './components/CartConfirmation';
import LoginView from './components/LoginView';
import CheckoutView from './components/CheckoutView';

const PRODUCTS: Product[] = [
  // Sweets
  { id: 's1', name: 'Premium Mysurpa', price: 475, weight: '500g', category: 'Sweets', subCategory: 'Ghee Sweets', image: 'https://images.unsplash.com/photo-1589113103503-49ef83d92834?auto=format&fit=crop&w=400&q=80', rating: 5 },
  { id: 's2', name: 'Traditional Laddu', price: 250, weight: '500g', category: 'Sweets', subCategory: 'Traditional sweets', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' },
  { id: 's3', name: 'Kaju Katli', price: 600, weight: '500g', category: 'Sweets', subCategory: 'Kaju Sweets', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80' },
  // Savouries (formerly Karas)
  { id: 'v1', name: 'Pepper Sev', price: 120, weight: '200g', category: 'Savouries', subCategory: 'Pepper Sev', image: 'https://images.unsplash.com/photo-1605666807894-3a0593457223?auto=format&fit=crop&w=400&q=80' },
  { id: 'v2', name: 'Onion Murukku', price: 100, weight: '200g', category: 'Savouries', subCategory: 'Onion Murukku', image: 'https://images.unsplash.com/photo-1605666807894-3a0593457223?auto=format&fit=crop&w=400&q=80' },
  { id: 'v3', name: 'Butter Murukku', price: 110, weight: '200g', category: 'Savouries', subCategory: 'Butter Murukku', image: 'https://images.unsplash.com/photo-1605666807894-3a0593457223?auto=format&fit=crop&w=400&q=80' },
  // Snacks
  { id: 'sn1', name: 'Thukkada', price: 90, weight: '250g', category: 'Snacks', subCategory: 'Thukkada', image: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?auto=format&fit=crop&w=400&q=80' },
  { id: 'sn2', name: 'Cashew Pakoda', price: 150, weight: '200g', category: 'Snacks', subCategory: 'Cashew Pakoda', image: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?auto=format&fit=crop&w=400&q=80' },
  // Pickles
  { id: 'p1', name: 'Garlic Pickle', price: 85, weight: '200g', category: 'Pickles', subCategory: 'Garlic Pickle', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80' },
];

const CATEGORY_MAP: Record<string, string[]> = {
  'Savouries': ['Pepper Sev', 'Kara Sev', 'Mota Mixture', 'Dhal Mixture', 'Sathur Kundu Pepper Sev', 'Onion Murukku', 'Ragi Murukku', 'Thenkuzhal Kurukku', 'Butter Murukku', 'Garlic Murukku', 'Kara Boonthi'],
  'Snacks': ['Thukkada', 'Regular Pakoda', 'Small Onion Pakoda', 'Ginger Pakoda', 'Cashew Pakoda'],
  'Sweets': ['Traditional sweets', 'Ghee Sweets', 'Kaju Sweets', 'Bengali Sweets', 'Dry fruit Sweets'],
  'Pickles': ['Garlic Pickle', 'Avakkai Mango Pickle', 'Cut Mango pickle', 'Nartangai Pickle', 'Citrol pickle'],
  'Other': ['Vadaam', 'Podies', 'Makhana', 'Cookies', 'Vathal', 'Chocolates']
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.STORE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [showCartConfirmation, setShowCartConfirmation] = useState<{product: Product} | null>(null);

  const addToCart = (product: Product, bypassConfirmation = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (!bypassConfirmation) {
      setShowCartConfirmation({ product });
    }
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const buyNow = (product: Product) => {
    addToCart(product, true);
    setCurrentView(AppView.CHECKOUT);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSubCategory = !activeSubCategory || p.subCategory === activeSubCategory;
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [searchQuery, activeCategory, activeSubCategory]);

  const navigateToSubList = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory(null);
    setCurrentView(AppView.SUB_CATEGORY_LIST);
  };

  const navigateToSubDetail = (sub: string) => {
    setActiveSubCategory(sub);
    setCurrentView(AppView.SUB_CATEGORY_DETAIL);
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentView(AppView.STORE); setActiveCategory(null); setActiveSubCategory(null); }}>
             <div className="w-12 h-12 bg-[#fdbd10] rounded-full flex items-center justify-center border-2 border-[#1d4d2b]">
               <span className="text-[#1d4d2b] font-bold text-xl">S</span>
             </div>
             <div>
               <h1 className="text-xl font-bold text-[#1d4d2b] tracking-tight">SWARNAPAKSHI</h1>
               <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Sweets & Snacks</p>
             </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Search for sweets, savouries..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-10 focus:ring-2 focus:ring-[#fdbd10] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView(AppView.AI_ASSISTANT)} className="text-sm font-bold text-[#1d4d2b] hover:bg-gray-50 px-3 py-2 rounded-lg">AI Assistant</button>
            <button onClick={() => setCurrentView(AppView.LOGIN)} className="text-sm font-medium text-gray-700 hover:text-[#1d4d2b]">Login</button>
            <button onClick={() => setCurrentView(AppView.CART)} className="relative p-2 hover:bg-gray-50 rounded-full group">
              <span className="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-t border-gray-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex gap-8 py-3">
            {['All', 'Sweets', 'Savouries', 'Snacks', 'Pickles', 'Categories'].map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  if (cat === 'Categories') {
                    setCurrentView(AppView.CATEGORIES);
                  } else {
                    setActiveCategory(cat === 'All' ? null : cat);
                    setActiveSubCategory(null);
                    setCurrentView(AppView.STORE);
                  }
                }}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${(activeCategory === cat || (cat === 'Categories' && currentView === AppView.CATEGORIES)) ? 'text-[#1d4d2b] border-b-2 border-[#1d4d2b]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {currentView === AppView.STORE && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-[#fdbd10] rounded-2xl p-12 mb-12 flex flex-col items-center text-center relative overflow-hidden">
               <h2 className="text-4xl font-black text-[#1d4d2b] mb-2 uppercase tracking-tight">Handcrafted Tradition</h2>
               <p className="text-[#1d4d2b]/80 max-w-xl">Premium sweets and snacks delivered directly from our kitchen to yours.</p>
            </div>
            <StoreGrid products={filteredProducts} onAddToCart={addToCart} onBuyNow={buyNow} />
          </div>
        )}

        {currentView === AppView.CATEGORIES && (
          <CategoryListView onSelect={navigateToSubList} />
        )}

        {currentView === AppView.SUB_CATEGORY_LIST && activeCategory && (
          <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="mb-8 flex items-center gap-4">
              <button onClick={() => setCurrentView(AppView.CATEGORIES)} className="text-[#1d4d2b] font-bold">← Back</button>
              <h2 className="text-3xl font-black text-[#1d4d2b]">{activeCategory} Collections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(CATEGORY_MAP[activeCategory] || CATEGORY_MAP['Other']).map(sub => (
                <button 
                  key={sub}
                  onClick={() => navigateToSubDetail(sub)}
                  className="bg-white border border-gray-100 rounded-xl p-8 text-left hover:border-[#fdbd10] hover:shadow-lg transition-all"
                >
                  <h4 className="text-lg font-bold text-gray-800">{sub}</h4>
                  <p className="text-sm text-gray-400 mt-2">View all {sub.toLowerCase()} items</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === AppView.SUB_CATEGORY_DETAIL && activeSubCategory && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-4">
              <button onClick={() => setCurrentView(AppView.SUB_CATEGORY_LIST)} className="text-[#1d4d2b] font-bold">← Back to {activeCategory}</button>
              <h2 className="text-2xl font-black text-gray-800">{activeSubCategory}</h2>
            </div>
            <StoreGrid products={filteredProducts} onAddToCart={addToCart} onBuyNow={buyNow} />
          </div>
        )}

        {currentView === AppView.CART && (
          <CartView 
            items={cart} 
            onUpdateQuantity={updateCartQuantity} 
            onRemove={removeFromCart} 
            onCheckout={() => setCurrentView(AppView.CHECKOUT)} 
          />
        )}
        {currentView === AppView.AI_ASSISTANT && <div className="max-w-4xl mx-auto py-12 px-4"><AIAssistant /></div>}
        {currentView === AppView.LOGIN && <LoginView onVerify={() => setCurrentView(AppView.STORE)} />}
        {currentView === AppView.CHECKOUT && (
          <CheckoutView 
            cart={cart} 
            total={cartTotal} 
            onPay={() => alert('Order Placed Successfully!')} 
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
          />
        )}
      </main>

      <WhatsAppButton />
      {showCartConfirmation && (
        <CartConfirmation 
          product={showCartConfirmation.product} 
          onClose={() => setShowCartConfirmation(null)} 
          cartTotal={cartTotal} 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onViewCart={() => { setShowCartConfirmation(null); setCurrentView(AppView.CART); }}
          onCheckout={() => { setShowCartConfirmation(null); setCurrentView(AppView.CHECKOUT); }}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#1d4d2b] text-white pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#fdbd10] rounded-full flex items-center justify-center font-bold text-[#1d4d2b]">S</div>
              <h3 className="font-black uppercase tracking-widest">SWARNAPAKSHI</h3>
            </div>
            <p className="text-green-100/70 leading-relaxed">Artisanal sweets and savouries. Quality ingredients, heritage recipes, and pure love in every bite.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#fdbd10] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-green-100/70">
              <li className="cursor-pointer hover:text-white" onClick={() => setCurrentView(AppView.STORE)}>Home</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setCurrentView(AppView.CATEGORIES)}>All Categories</li>
              <li className="cursor-pointer hover:text-white">Shipping Policy</li>
              <li className="cursor-pointer hover:text-white">Refunds</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#fdbd10] uppercase tracking-wider">Contact</h4>
            <p className="mb-2">📞 +91 73959 43676</p>
            <p className="mb-4">✉️ Swarnapakshisweets@gmail.com</p>
            <p className="text-xs text-green-100/50">Bulk Orders: 9043331097</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#fdbd10] uppercase tracking-wider">Join Us</h4>
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Email" className="bg-white/10 border border-white/20 rounded px-3 py-2 outline-none w-full" />
              <button className="bg-[#fdbd10] text-[#1d4d2b] font-bold px-4 py-2 rounded">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
