import { useEffect, useState } from "react";
import { Truck, Phone, MapPin, Package, Plus, X } from "lucide-react";
import { getFuelsByDriver, createFuel, getAllOrders, createDelivery } from "../../api/endpoints";

const DriverDetails = ({ driver }) => {
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [fuelForm, setFuelForm] = useState({
    liters: "", price: "", odometer: "", station: "", receiptUrl: "",
  });

  useEffect(() => {
    if (driver) fetchFuels();
  }, [driver]);

  const fetchFuels = async () => {
    setLoading(true);
    try {
      const res = await getFuelsByDriver(driver.id);
      setFuels(res.data);
    } catch (err) {
      console.error("Failed to fetch fuels", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = async () => {
    try {
      const res = await getAllOrders();
      // Only show PENDING orders
      const pending = res.data.filter((o) => o.status === "PENDING");
      setOrders(pending);
      setShowAssignModal(true);
    } catch (err) {
      alert("Failed to load orders");
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedOrderId) return alert("Please select an order");
    setAssigning(true);
    try {
      await createDelivery({
        orderId: Number(selectedOrderId),
        driverId: driver.id,
        lorryId: driver.lorry?.id,
      });
      alert("Delivery assigned successfully!");
      setShowAssignModal(false);
      setSelectedOrderId("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to assign delivery");
    } finally {
      setAssigning(false);
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    const optimistic = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString(),
      liters: parseFloat(fuelForm.liters),
      price: parseFloat(fuelForm.price),
      odometer: fuelForm.odometer ? parseFloat(fuelForm.odometer) : null,
      station: fuelForm.station || null,
      receiptUrl: fuelForm.receiptUrl || null,
      _pending: true,
    };
    setFuels((prev) => [optimistic, ...prev]);
    setShowFuelForm(false);
    setFuelForm({ liters: "", price: "", odometer: "", station: "", receiptUrl: "" });
    try {
      const res = await createFuel({
        driverId: driver.id,
        lorryId: driver.lorry?.id,   // ← fixed
        liters: optimistic.liters,
        price: optimistic.price,
        odometer: optimistic.odometer,
        station: optimistic.station,
        receiptUrl: optimistic.receiptUrl,
      });
      setFuels((prev) => prev.map((f) => (f.id === optimistic.id ? res.data : f)));
    } catch (err) {
      setFuels((prev) => prev.filter((f) => f.id !== optimistic.id));
      alert("Failed to save fuel record. Please try again.");
    }
  };

  if (!driver) return (
    <div className="driverPlaceholder">
      <Truck size={48} />
      <p>Select a driver to view details</p>
    </div>
  );

  const activeDelivery = driver.deliveries?.[0];

  return (
    <div className="driverDetails">

      {/* Assign Delivery Modal */}
      {showAssignModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 32,
            width: 480, maxWidth: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Assign Delivery to {driver.name}</h3>
              <button onClick={() => setShowAssignModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {orders.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>
                No pending orders available
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {orders.map((order) => (
                  <label key={order.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: 12, border: `2px solid ${selectedOrderId == order.id ? "#2563eb" : "#e5e7eb"}`,
                    borderRadius: 8, cursor: "pointer",
                    background: selectedOrderId == order.id ? "#eff6ff" : "white"
                  }}>
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId == order.id}
                      onChange={() => setSelectedOrderId(order.id)}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{order.deliveryAddress}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#059669", fontWeight: 600 }}>
                        RM {order.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAssignModal(false)} style={{
                padding: "10px 20px", border: "2px solid #e5e7eb",
                borderRadius: 8, background: "white", cursor: "pointer", fontWeight: 600
              }}>
                Cancel
              </button>
              <button onClick={handleAssignDelivery} disabled={assigning || !selectedOrderId}
                style={{
                  padding: "10px 20px", background: "#2563eb", color: "white",
                  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
                  opacity: (!selectedOrderId || assigning) ? 0.6 : 1
                }}>
                {assigning ? "Assigning..." : "Confirm Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="driverDetailsHeader">
        <div className="avatar"><Truck size={24} /></div>
        <div>
          <h3>{driver.name}</h3>
          <p className="subText">{driver.phone || "No phone number"}</p>
        </div>
      </div>

      {/* Lorry */}
      <div className="detailsSection">
        <h4>Lorry</h4>
        <p>Lorry #: {driver.lorry?.lorryNumber}</p>
        <p>Plate: {driver.lorry?.plateNumber}</p>
        <span className={`badge ${driver.lorry?.status?.toLowerCase()}`}>
          {driver.lorry?.status}
        </span>
      </div>

      {/* Active Delivery */}
      <div className="detailsSection">
        <h4>Active Delivery</h4>
        {activeDelivery ? (
          <div className="deliveryCard">
            <div className="deliveryRow">
              <Package size={16} />
              <span>Order #{activeDelivery.order?.orderNumber}</span>
            </div>
            <div className="deliveryRow">
              <MapPin size={16} />
              <span>{activeDelivery.order?.deliveryAddress}</span>
            </div>
            <span className="badge delivering">{activeDelivery.status}</span>
          </div>
        ) : <p className="muted">No active delivery</p>}
      </div>

      {/* Fuel Records */}
      <div className="detailsSection">
        <h4>Fuel Records</h4>
        <button className="primaryBtn small" onClick={() => setShowFuelForm(!showFuelForm)}>
          <Plus size={16} /> Add Fuel
        </button>

        {showFuelForm && (
          <form className="fuelForm" onSubmit={handleFuelSubmit}>
            <input type="number" step="0.01" placeholder="Liters" value={fuelForm.liters}
              onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Total Price (RM)" value={fuelForm.price}
              onChange={(e) => setFuelForm({ ...fuelForm, price: e.target.value })} required />
            <input type="number" step="1" placeholder="Odometer (km)" value={fuelForm.odometer}
              onChange={(e) => setFuelForm({ ...fuelForm, odometer: e.target.value })} />
            <input type="text" placeholder="Station (Petronas, Shell, etc.)" value={fuelForm.station}
              onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })} />
            <input type="text" placeholder="Receipt URL" value={fuelForm.receiptUrl}
              onChange={(e) => setFuelForm({ ...fuelForm, receiptUrl: e.target.value })} />
            <button type="submit" className="primaryBtn small">Save</button>
          </form>
        )}

        {loading && <p>Loading fuels...</p>}
        {!loading && (!Array.isArray(fuels) || fuels.length === 0) && (
          <p className="muted">No fuel records yet</p>
        )}
        {Array.isArray(fuels) && fuels.length > 0 && fuels.map((fuel) => (
          <div key={fuel.id} className="fuelCard" data-pending={fuel._pending ? "true" : "false"}>
            <p>Date: {new Date(fuel.date).toLocaleDateString()}</p>
            <p>Liters: {fuel.liters} L</p>
            <p>Total: RM {fuel.price}</p>
            <p>Price/Liter: RM {(fuel.price / fuel.liters).toFixed(2)}</p>
            {fuel.odometer && <p>Odometer: {fuel.odometer} km</p>}
            {fuel.station && <p>Station: {fuel.station}</p>}
            {fuel.receiptUrl && <a href={fuel.receiptUrl} target="_blank" rel="noreferrer">Receipt</a>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="detailsActions">
        <button className="primaryBtn" onClick={handleOpenAssign}>Assign Delivery</button>
        <button className="secondaryBtn"><Phone size={16} /> Call</button>
      </div>
    </div>
  );
};

export default DriverDetails;