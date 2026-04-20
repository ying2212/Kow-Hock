import { useEffect, useState } from "react";
import { Truck, Phone, MapPin, Package, Plus } from "lucide-react";
import axios from "axios";

const DriverDetails = ({ driver }) => {
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [fuelForm, setFuelForm] = useState({
    liters: "",
    price: "",
    odometer: "",
    station: "",
    receiptUrl: "",
  });

  useEffect(() => {
    if (driver) fetchFuels();
  }, [driver]);

  const fetchFuels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/fuels/driver/${driver.id}`);
      setFuels(res.data);
    } catch (err) {
      console.error("Failed to fetch fuels", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/fuels", {
        driverId: driver.id,
        lorryId: driver.lorryId,
        liters: parseFloat(fuelForm.liters),
        price: parseFloat(fuelForm.price),
        odometer: fuelForm.odometer ? parseFloat(fuelForm.odometer) : null,
        station: fuelForm.station || null,
        receiptUrl: fuelForm.receiptUrl || null,
      });
      setFuelForm({ liters: "", price: "", odometer: "", station: "", receiptUrl: "" });
      setShowFuelForm(false);
      fetchFuels(); // refresh
    } catch (err) {
      console.error("Failed to add fuel", err);
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
              <span>Order #{activeDelivery.order.orderNumber}</span>
            </div>
            <div className="deliveryRow">
              <MapPin size={16} />
              <span>{activeDelivery.order.deliveryAddress}</span>
            </div>
            <span className="badge delivering">{activeDelivery.status}</span>
          </div>
        ) : <p className="muted">No active delivery</p>}
      </div>

    {/* Fuel Records */}
    <div className="detailsSection">
    <h4>Fuel Records</h4>
    <button
        className="primaryBtn small"
        onClick={() => setShowFuelForm(!showFuelForm)}
    >
        <Plus size={16} /> Add Fuel
    </button>

    {showFuelForm && (
        <form className="fuelForm" onSubmit={handleFuelSubmit}>
        <input
            type="number"
            step="0.01"
            placeholder="Liters"
            value={fuelForm.liters}
            onChange={(e) =>
            setFuelForm({ ...fuelForm, liters: e.target.value })
            }
            required
        />
        <input
            type="number"
            step="0.01"
            placeholder="Total Price (RM)"
            value={fuelForm.price}
            onChange={(e) =>
            setFuelForm({ ...fuelForm, price: e.target.value })
            }
            required
        />
        <input
            type="number"
            step="1"
            placeholder="Odometer (km)"
            value={fuelForm.odometer}
            onChange={(e) =>
            setFuelForm({ ...fuelForm, odometer: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="Station (Petronas, Shell, etc.)"
            value={fuelForm.station}
            onChange={(e) =>
            setFuelForm({ ...fuelForm, station: e.target.value })
            }
        />
        <input
            type="text"
            placeholder="Receipt URL"
            value={fuelForm.receiptUrl}
            onChange={(e) =>
            setFuelForm({ ...fuelForm, receiptUrl: e.target.value })
            }
        />
        <button type="submit" className="primaryBtn small">
            Save
        </button>
        </form>
    )}

    {loading && <p>Loading fuels...</p>}

    {/* Safe rendering */}
    {!loading && (!Array.isArray(fuels) || fuels.length === 0) && (
        <p className="muted">No fuel records yet</p>
    )}

    {Array.isArray(fuels) && fuels.length > 0 && fuels.map((fuel) => (
        <div key={fuel.id} className="fuelCard">
        <p>Date: {new Date(fuel.date).toLocaleDateString()}</p>
        <p>Liters: {fuel.liters} L</p>
        <p>Total: RM {fuel.price}</p>
        <p>Price/Liter: RM {(fuel.price / fuel.liters).toFixed(2)}</p>
        {fuel.odometer && <p>Odometer: {fuel.odometer} km</p>}
        {fuel.station && <p>Station: {fuel.station}</p>}
        {fuel.receiptUrl && (
            <a href={fuel.receiptUrl} target="_blank" rel="noreferrer">
            Receipt
            </a>
        )}
        </div>
    ))}
    </div>


      {/* Actions */}
      <div className="detailsActions">
        <button className="primaryBtn">Assign Delivery</button>
        <button className="secondaryBtn"><Phone size={16}/> Call</button>
      </div>
    </div>
  );
};

export default DriverDetails;
