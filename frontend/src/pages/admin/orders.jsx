import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Package, Plus, X } from "lucide-react";
import { getAllOrders, createOrder } from "../../api/endpoints";
import { getAllProducts, getAllStores } from "../../api/endpoints";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    storeId: "",
    productId: "",
    quantity: "",
    priceAtTime: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchStores();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };
  
  const fetchStores = async () => {
    try {
      const res = await getAllStores();
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
  };
  

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        customerId: Number(formData.customerId),
        storeId: Number(formData.storeId),
        deliveryAddress: formData.deliveryAddress,
        items: [
          {
            productId: Number(formData.productId),
            quantity: Number(formData.quantity),
          },
        ],
      };

      await createOrder(payload);
      fetchOrders();
      setShowCreateForm(false);
      setFormData({
        customerId: "",
        storeId: "",
        productId: "",
        quantity: "",
        priceAtTime: "",
        deliveryAddress: "",
      });
    } catch (err) {
      console.error("Create order failed:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to create order");
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Pending",
      PACKED: "Packed",
      OUT_FOR_DELIVERY: "In Transit",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      PENDING: "pending",
      PACKED: "packed",
      OUT_FOR_DELIVERY: "transit",
      DELIVERED: "delivered",
      CANCELLED: "cancelled",
    };
    return classes[status] || "pending";
  };

  if (loading) {
    return (
      <div className="content">
        <div className="loadingContainer">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ordersPage">
      <div className="ordersHeader">
        <div className="ordersHeaderLeft">
          <h2>Orders</h2>
          <p className="ordersCount">{orders.length} total orders</p>
        </div>
        <button className="createOrderBtn" onClick={() => setShowCreateForm(true)}>
          <Plus size={20} />
          Create Order
        </button>
      </div>

      {showCreateForm && (
        <div className="modalOverlay">
          <div className="createOrderModal">
            <div className="modalHeader">
              <h3>Create New Order</h3>
              <button className="closeModalBtn" onClick={() => setShowCreateForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="orderForm">
              <div className="formRow">
                <div className="formGroup">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    placeholder="Enter customer ID"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    required
                  />
                </div>

                <div className="formGroup">
                  {/* <label>Store ID</label>
                  <input
                    type="number"
                    placeholder="Enter store ID"
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                  /> */}
                  <label>Store</label>
                  <select
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Select a store
                    </option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formGroup">
                  <label>Product</label>
                  {/* <input
                    type="number"
                    placeholder="Enter product ID"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                  /> */}
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="formGroup">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>Delivery Address</label>
                <textarea
                  placeholder="Enter delivery address"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  required
                  rows="3"
                />
              </div>

              <div className="modalFooter">
                <button type="button" className="cancelBtn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submitBtn">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="content">
        <div className="list">
          {orders.length === 0 ? (
            <div className="emptyState">
              <Package size={48} />
              <p>No orders yet</p>
              <button className="createOrderBtn" onClick={() => setShowCreateForm(true)}>
                <Plus size={20} />
                Create First Order
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className={`card ${selectedOrder?.id === order.id ? "active" : ""}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="cardHeader">
                  <div className="orderInfo">
                    <Package size={16} />
                    <h4>{order.orderNumber}</h4>
                  </div>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="cardBody">
                  <p className="customerName">{order.customer?.name || "Unknown Customer"}</p>
                  <p className="address">{order.deliveryAddress}</p>
                  <p className="price">RM {order.totalPrice?.toFixed(2)}</p>
                </div>

                <div className="cardFooter">
                  <button className="iconBtn" onClick={(e) => e.stopPropagation()}>
                    <Phone size={16} />
                  </button>
                  <button className="iconBtn" onClick={(e) => e.stopPropagation()}>
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="map">
          {selectedOrder ? (
            <div className="mapContent">
              <MapPin size={48} className="mapIcon" />
              <div className="mapDetails">
                <h3>{selectedOrder.orderNumber}</h3>
                <p className="customerName">{selectedOrder.customer?.name}</p>
                <p className="mapAddress">{selectedOrder.deliveryAddress}</p>
                <span className={`badge ${getStatusClass(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
                <p className="mapPrice">Total: RM {selectedOrder.totalPrice?.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="mapPlaceholder">
              <MapPin size={64} className="mapIcon" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;