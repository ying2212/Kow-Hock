import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Package } from "lucide-react";
import api from "../../api/axios";
import { ORDER } from "../../api/endpoints";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(ORDER.GET_ALL);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Fallback to mock data if API fails
      setOrders([
        { id: 1, orderNumber: "#3565432", customer: { name: "John Doe" }, deliveryAddress: "123 Main St", status: "PENDING", totalPrice: 150.50 },
        { id: 2, orderNumber: "#483920", customer: { name: "Alice Tan" }, deliveryAddress: "45 Jalan Bukit", status: "OUT_FOR_DELIVERY", totalPrice: 89.00 },
        { id: 3, orderNumber: "#1442654", customer: { name: "Michael Lee" }, deliveryAddress: "78 Orchard Rd", status: "DELIVERED", totalPrice: 200.75 },
      ]);
    } finally {
      setLoading(false);
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
    <div className="content">
      <div className="list">
        {orders.map((order) => (
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
              <p className="customerName">{order.customer?.name || 'Unknown Customer'}</p>
              <p className="address">{order.deliveryAddress}</p>
              <p className="price">${order.totalPrice?.toFixed(2)}</p>
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
        ))}
      </div>

      <div className="map">
        {selectedOrder ? (
          <div className="mapContent">
            <MapPin size={48} className="mapIcon" />
            <div className="mapDetails">
              <h3>{selectedOrder.orderNumber}</h3>
              <p className="mapAddress">{selectedOrder.deliveryAddress}</p>
              <span className={`badge ${getStatusClass(selectedOrder.status)}`}>
                {getStatusLabel(selectedOrder.status)}
              </span>
              <p className="mapPrice">Total: ${selectedOrder.totalPrice?.toFixed(2)}</p>
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
  );
};

export default Orders;
