import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAllDrivers, createDriver } from "../../api/endpoints";
import DriverDetails from "./DriverDetails";
import "./Drivers.css";
import { useCallback } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const Drivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDriverPage = useCallback(
    (page, limit) => getAllDrivers({ page, limit }),
    []
  );

  const { items: drivers, loading, sentinelRef } =
    useInfiniteScroll(fetchDriverPage);
    
  const getStatusClass = (status) => {
    const classes = {
      IDLE: "idle",
      DELIVERING: "delivering",
      MAINTENANCE: "maintenance",
    };
    return classes[status] || "idle";
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    lorryNumber: Yup.string().required("Lorry number is required"),
    plateNumber: Yup.string().required("Plate number is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await createDriver(values);
      resetForm();
  
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to add driver", err);
    }
  };

  return (
    <div className="driversContainer">
      <h2>Drivers</h2>
      <p>Manage your delivery drivers and lorries</p>

      {/* Add Driver Form */}
      <Formik
        initialValues={{ name: "", lorryNumber: "", plateNumber: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="driverForm">
          <Field name="name" placeholder="Driver Name" />
          <ErrorMessage name="name" component="div" className="error" />

          <Field name="lorryNumber" placeholder="Lorry Number" />
          <ErrorMessage name="lorryNumber" component="div" className="error" />

          <Field name="plateNumber" placeholder="Plate Number" />
          <ErrorMessage name="plateNumber" component="div" className="error" />

          <button type="submit">Add Driver</button>
        </Form>
      </Formik>

      <div className="content">
        {/* LEFT: Driver list */}
        <div className="list">
          {loading && drivers.length === 0 && <p>Loading drivers...</p>}

          {drivers.map((driver) => (
            <div
              key={driver.id}
              className={`driverCard ${
                selectedDriver?.id === driver.id ? "active" : ""
              }`}
              onClick={() => setSelectedDriver(driver)}
            >
              <div className="driverHeader">
                <div className="driverAvatar">
                  <Truck size={24} />
                </div>
                <div className="driverInfo">
                  <h3>{driver.name}</h3>
                  <p>{driver.lorry?.plateNumber}</p>
                </div>
              </div>

              <span
                className={`badge ${getStatusClass(
                  driver.lorry?.status || "IDLE"
                )}`}
              >
                {driver.lorry?.status || "IDLE"}
              </span>
            </div>
          ))}

          {/* 👇 THIS triggers loading next page */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {loading && drivers.length > 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                padding: "12px",
                fontSize: "13px",
              }}
            >
              Loading more...
            </p>
          )}
        </div>

        {/* RIGHT: Driver details */}
        <div className="map">
          <DriverDetails driver={selectedDriver} />
        </div>
      </div>
    </div>
  );
};

export default Drivers;
