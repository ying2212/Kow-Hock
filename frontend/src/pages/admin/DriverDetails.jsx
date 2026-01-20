import { Truck, Phone, MapPin, Package } from "lucide-react";

const DriverDetails = ({ driver }) => {
  if (!driver) {
    return (
      <div className="driverPlaceholder">
        <Truck size={48} />
        <p>Select a driver to view details</p>
      </div>
    );
  }

  const activeDelivery = driver.deliveries?.[0];

  return (
    <div className="driverDetails">
      {/* Header */}
      <div className="driverDetailsHeader">
        <div className="avatar">
          <Truck size={24} />
        </div>
        <div>
          <h3>{driver.name}</h3>
          <p className="subText">{driver.phone || "No phone number"}</p>
        </div>
      </div>

      {/* Lorry */}
      <div className="detailsSection">
        <h4>Lorry</h4>
        <p>Lorry Number: {driver.lorry?.lorryNumber}</p>
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

            <span className="badge delivering">
              {activeDelivery.status}
            </span>
          </div>
        ) : (
          <p className="muted">No active delivery</p>
        )}
      </div>

      {/* Actions */}
      <div className="detailsActions">
        <button className="primaryBtn">
          Assign Delivery
        </button>
        <button className="secondaryBtn">
          <Phone size={16} />
          Call
        </button>
      </div>
    </div>
  );
};

export default DriverDetails;
