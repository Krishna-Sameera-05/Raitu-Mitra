import { useState, useEffect } from 'react';
import { HelpCircle, AlertTriangle, Mail, Check, Inbox, UserX, Ban, ArrowLeft, ShoppingBag, Plus, Trash2, Upload, X, ClipboardList, Package, Calendar, CheckCircle } from 'lucide-react';
import { helpAPI, productsAPI, ordersAPI } from '../lib/api';

type AdminView = 'main' | 'messages' | 'products' | 'orders';

interface HelpRequest {
  _id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

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

interface Order {
  _id: string;
  userId: { fullName: string; email: string };
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  deliveryDate?: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [view, setView] = useState<AdminView>('main');

  return (
    <div>
      {view === 'main' ? (
        <MainView onNavigate={setView} />
      ) : view === 'messages' ? (
        <MessagesView onBack={() => setView('main')} />
      ) : view === 'products' ? (
        <PestProductsView onBack={() => setView('main')} />
      ) : (
        <OrdersView onBack={() => setView('main')} />
      )}
    </div>
  );
}

function MainView({ onNavigate }: { onNavigate: (view: AdminView) => void }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Overview and Management</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        <button
          onClick={() => onNavigate('messages')}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-1"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Inbox className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Help Messages</h3>
            <p className="text-gray-600 text-center text-sm">
              View reports and help requests from users
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('products')}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-1"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <ShoppingBag className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Pest Products</h3>
            <p className="text-gray-600 text-center text-sm">
              Manage inventory and new arrivals
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('orders')}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-1"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <ClipboardList className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Orders</h3>
            <p className="text-gray-600 text-center text-sm">
              Track and approve store orders
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function MessagesView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await helpAPI.getRequests();
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: 'block' | 'suspend', userId: string) => {
    alert(`${action === 'block' ? 'Blocked' : 'Suspended'} user involved in this report.`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Help Desk Messages</h2>
        <p className="text-gray-600">Review user reports and take action</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          <Inbox className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No messages found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{msg.subject}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span className="font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">
                        {msg.senderRole}
                      </span>
                      <span>•</span>
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction('suspend', msg.senderName)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                      title="Suspend account for 5 days"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Suspend (5d)</span>
                    </button>
                    <button
                      onClick={() => handleAction('block', msg.senderName)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      title="Permanently block account"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Block User</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PestProductsView({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Insecticides',
    imageUrl: '',
    isNewArrival: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await productsAPI.addProduct({
        ...formData,
        price: parseFloat(formData.price)
      });
      if (response.success) {
        setProducts([response.data, ...products]);
        setShowAddForm(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Insecticides',
          imageUrl: '',
          isNewArrival: true
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await productsAPI.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Pest Products</h2>
          <p className="text-gray-600">Manage your product inventory and new arrivals</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{showAddForm ? 'Cancel' : 'Add New Product'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Insecticides">Insecticides</option>
                <option value="Fungicides">Fungicides</option>
                <option value="Herbicides">Herbicides</option>
                <option value="Rodenticides">Rodenticides</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Click to upload image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : products.length === 0 && !showAddForm ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No products available</p>
          <p className="text-sm mt-2">Click "Add New Product" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden group">
              <div className="relative h-48 bg-gray-100">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    ₹{product.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{product.category}</span>
                  <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersView({ onBack }: { onBack: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingOrder, setApprovingOrder] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvingOrder || !deliveryDate) return;
    try {
      await ordersAPI.updateOrderStatus(approvingOrder, {
        status: 'approved',
        deliveryDate
      });
      // Update local state
      setOrders(orders.map(o => o._id === approvingOrder ? { ...o, status: 'approved', deliveryDate } : o));
      setApprovingOrder(null);
      setDeliveryDate('');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Store Orders Management</h2>
        <p className="text-gray-600">Review pending orders and schedule deliveries</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No orders received</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-2 md:mb-0">
                  <p className="font-bold text-gray-800">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Customer</p>
                    <p className="text-sm font-medium">{order.userId?.fullName || 'Unknown'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {order.status}
                  </span>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => setApprovingOrder(order._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-500 font-bold text-xs uppercase mb-2">Items Ordered</p>
                    <div className="space-y-2">
                      {order.products.map((p, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="flex items-center"><Package className="w-3 h-3 text-gray-400 mr-2" /> {p.name} (x{p.quantity})</span>
                          <span className="font-medium">₹{p.price * p.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-2 flex justify-between font-bold text-gray-800">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                  <div className="border-l pl-0 md:pl-6">
                    <p className="text-gray-500 font-bold text-xs uppercase mb-2">Delivery Details</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.shippingAddress}</p>

                    {order.deliveryDate && (
                      <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-800 font-bold text-xs uppercase mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Expected Delivery</p>
                        <p className="text-sm font-medium text-green-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approvingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Approve Order
            </h3>
            <p className="text-gray-600 mb-6">
              Set an expected delivery date to approve this order. The user will be notified.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setApprovingOrder(null); setDeliveryDate(''); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={!deliveryDate}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
