import { useState, useEffect } from "react";
import { Truck, Phone, Mail } from "lucide-react";

const Drivers = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Robert Fox", lorry: { plateNumber: "ABC-1234", status: "DELIVERING" }, phone: "+65 9123 4567" },
    { id: 2, name: "Jane Cooper", lorry: { plateNumber: "XYZ-5678", status: "IDLE" }, phone: "+65 9234 5678" },
    { id: 3, name: "Wade Warren", lorry: { plateNumber: "DEF-9012", status: "MAINTENANCE" }, phone: "+65 9345 6789" },
  ]);

  const getStatusClass = (status) => {
    const classes = {
      IDLE: "idle",
      DELIVERING: "delivering",
      MAINTENANCE: "maintenance",
    };
    return classes[status] || "idle";
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Drivers</h2>
        <p style={{ color: "#6b7280" }}>Manage your delivery drivers and lorries</p>
      </div>

      <div className="driversGrid">
        {drivers.map((driver) => (
          <div key={driver.id} className="driverCard">
            <div className="driverHeader">
              <div className="driverAvatar">
                <Truck size={24} />
              </div>
              <div className="driverInfo">
                <h3>{driver.name}</h3>
                <p>{driver.lorry.plateNumber}</p>
              </div>
            </div>

            <div className="driverBody">
              <span className={`badge ${getStatusClass(driver.lorry.status)}`}>
                {driver.lorry.status}
              </span>
              <p className="driverPhone">{driver.phone}</p>
            </div>

            <div className="driverFooter">
              <button className="iconBtn">
                <Phone size={16} />
              </button>
              <button className="iconBtn">
                <Mail size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
