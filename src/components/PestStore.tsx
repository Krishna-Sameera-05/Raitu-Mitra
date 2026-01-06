import { useState, useEffect } from 'react';
import { ShoppingBag, Search, ShoppingCart, Plus, Minus, X, CheckCircle, Truck, History, ArrowLeft, MapPin, User, Phone, Package, Calendar } from 'lucide-react';
import { productsAPI, ordersAPI } from '../lib/api';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    inStock: boolean;
    isNewArrival: boolean;
}

interface CartItem extends Product {
    quantity: number;
}

interface Order {
    _id: string;
    products: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: string;
    shippingAddress: string;
    deliveryDate?: string;
    createdAt: string;
}

export default function PestStore() {
    const [view, setView] = useState<'browse' | 'cart' | 'checkout' | 'history'>('browse');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);

    // Checkout State
    const [checkoutForm, setCheckoutForm] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    // History State
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (view === 'history') {
            fetchOrderHistory();
        }
    }, [view]);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getProducts();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderHistory = async () => {
        try {
            const response = await ordersAPI.getOrders();
            if (response.success) {
                setOrderHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const categories = ['All', 'Organic', 'Biological', 'Botanical', 'Chemical', 'Other'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderStatus('processing');

        const fullAddress = `${checkoutForm.fullName}, ${checkoutForm.phone}\n${checkoutForm.street}, ${checkoutForm.city}, ${checkoutForm.state} - ${checkoutForm.zipCode}`;

        try {
            const orderData = {
                products: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: cartTotal,
                shippingAddress: fullAddress
            };

            await ordersAPI.createOrder(orderData);
            setOrderStatus('success');
            setCart([]);
            setTimeout(() => {
                setOrderStatus('idle');
                setView('history'); // Navigate to history after success
                setCheckoutForm({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });
            }, 2000);
        } catch (error) {
            console.error('Checkout failed:', error);
            setOrderStatus('error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div onClick={() => setView('browse')} className="cursor-pointer">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <ShoppingBag className="w-8 h-8 text-green-600 mr-2" />
                        Pest Store
                    </h2>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button
                        onClick={() => setView('browse')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${view === 'browse' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Shop
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${view === 'history' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <History className="w-4 h-4 mr-2" />
                        My Orders
                    </button>
                    <button
                        onClick={() => setView('cart')}
                        className={`relative p-2 rounded-full transition ${view === 'cart' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">

                {/* BROWSE VIEW */}
                {view === 'browse' && (
                    <div className="animate-fadeIn">
                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex overflow-x-auto space-x-2 pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${selectedCategory === category
                                            ? 'bg-green-600 text-white font-medium'
                                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-medium text-gray-500">No products found</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            {product.isNewArrival && (
                                                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">New</span>
                                            )}
                                            {!product.inStock && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <span className="bg-red-500 text-white font-bold px-3 py-1 rounded">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-md font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                                                <span className="text-green-700 font-bold">₹{product.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                                            <div className="mt-auto pt-2 border-t flex justify-between items-center">
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    disabled={!product.inStock}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${product.inStock ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CART VIEW */}
                {view === 'cart' && (
                    <div className="max-w-4xl mx-auto animate-slideUp">
                        <div className="flex items-center mb-6">
                            <button onClick={() => setView('browse')} className="mr-4 text-gray-500 hover:text-green-600"><ArrowLeft className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl">
                                <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 text-lg">Your cart is empty</p>
                                <button onClick={() => setView('browse')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-grow space-y-4">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 mr-4">
                                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ShoppingBag className="w-full h-full p-4 text-gray-300" />}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                                <p className="text-gray-500 text-sm">₹{item.price}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center bg-white border rounded-lg">
                                                    <button onClick={() => updateQuantity(item._id, -1)} className="p-2 hover:bg-gray-100 text-gray-600"><Minus className="w-4 h-4" /></button>
                                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item._id, 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus className="w-4 h-4" /></button>
                                                </div>
                                                <p className="font-bold text-gray-800 w-20 text-right">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full md:w-80 h-fit bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                    <div className="flex justify-between mb-2 text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between mb-4 text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-800 mb-6">
                                        <span>Total</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <button
                                        onClick={() => setView('checkout')}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform active:scale-95 flex justify-center items-center"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* CHECKOUT VIEW */}
                {view === 'checkout' && (
                    <div className="max-w-3xl mx-auto animate-slideInRight">
                        <div className="flex items-center mb-6">
                            <button onClick={() => setView('cart')} className="mr-4 text-gray-500 hover:text-green-600"><ArrowLeft className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                        </div>

                        {orderStatus === 'success' ? (
                            <div className="text-center py-16 bg-green-50 rounded-xl border border-green-200 animate-fadeIn">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-green-800 mb-2">Order Places Successfully!</h2>
                                <p className="text-green-700 mb-8">Thank you for shopping with us. You can track your order in history.</p>
                                <p className="text-sm text-gray-500">Redirecting to Order History...</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-8">
                                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-green-600" /> Contact Info</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input required type="text" value={checkoutForm.fullName} onChange={e => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="John Doe" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input required type="tel" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="9876543210" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-green-600" /> Shipping Address</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                                <input required type="text" value={checkoutForm.street} onChange={e => setCheckoutForm({ ...checkoutForm, street: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="123 Farm Road, Village" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City/District</label>
                                                    <input required type="text" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <input required type="text" value={checkoutForm.state} onChange={e => setCheckoutForm({ ...checkoutForm, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / PIN Code</label>
                                                <input required type="text" value={checkoutForm.zipCode} onChange={e => setCheckoutForm({ ...checkoutForm, zipCode: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={orderStatus === 'processing'}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center disabled:opacity-70"
                                    >
                                        {orderStatus === 'processing' ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Confirm Order - ₹{cartTotal}</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
                                        <div className="flex items-center p-4 bg-white border-2 border-green-500 rounded-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">ONLY OPTION</div>
                                            <div className="w-4 h-4 rounded-full border-4 border-green-600 mr-4"></div>
                                            <div>
                                                <p className="font-bold text-gray-800 flex items-center"><Truck className="w-4 h-4 mr-2" /> Cash on Delivery</p>
                                                <p className="text-xs text-gray-500 mt-1">Pay when you receive your items.</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 border rounded-xl opacity-50 bg-gray-100">
                                            <p className="font-bold text-gray-400">Online Payment</p>
                                            <p className="text-xs text-gray-400">Currently unavailable</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                        <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                                            {cart.map(item => (
                                                <div key={item._id} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                                    <span className="font-medium">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{cartTotal}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* HISTORY VIEW */}
                {view === 'history' && (
                    <div className="max-w-4xl mx-auto animate-slideInRight">
                        <div className="flex items-center mb-6">
                            <button onClick={() => setView('browse')} className="mr-4 text-gray-500 hover:text-green-600"><ArrowLeft className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
                        </div>

                        {orderHistory.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl">
                                <History className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                                <button onClick={() => setView('browse')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orderHistory.map(order => (
                                    <div key={order._id} className="bg-white border text-left rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="bg-gray-50 p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div className="mb-2 sm:mb-0">
                                                <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                                                <p className="font-mono text-gray-800 text-sm">#{order._id.slice(-8)}</p>
                                            </div>
                                            <div className="mb-2 sm:mb-0">
                                                <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                                                <p className="text-gray-800 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold text-right">Total</p>
                                                <p className="font-bold text-green-700 text-right">₹{order.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-grow space-y-2">
                                                    {order.products.map((p, i) => (
                                                        <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                            <div className="flex items-center">
                                                                <Package className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-gray-700 font-medium">{p.name}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">x{p.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="w-full md:w-64 border-l pl-0 md:pl-6">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1 mt-4">Payment</p>
                                                    <p className="text-sm text-gray-700 font-medium">Cash on Delivery</p>

                                                    {order.status === 'approved' && order.deliveryDate && (
                                                        <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                                                            <p className="text-green-800 font-bold text-xs uppercase mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Expected Delivery</p>
                                                            <p className="text-sm font-bold text-green-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
