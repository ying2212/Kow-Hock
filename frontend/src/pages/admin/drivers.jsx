import { useState, useEffect } from "react";
import { Truck, Phone, Mail } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAllDrivers, createDriver } from "../../api/endpoints";
import "./Drivers.css";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await getAllDrivers();
      setDrivers(response.data);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const classes = { IDLE: "idle", DELIVERING: "delivering", MAINTENANCE: "maintenance" };
    return classes[status] || "idle";
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    lorryNumber: Yup.string().required("Lorry number is required"),
    plateNumber: Yup.string().required("Plate number is required"),
  });
  

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await createDriver({
        name: values.name,
        lorryNumber: values.lorryNumber,
        plateNumber: values.plateNumber,
      });      
      setDrivers([...drivers, response.data]);
      resetForm();
    } catch (err) {
      console.error("Failed to add driver", err);
    }
  };

  return (
    <div className="driversContainer">
      <h2>Drivers</h2>
      <p>Manage your delivery drivers and lorries</p>

      {/* Formik Form */}
      <Formik
        initialValues={{ name: "", lorryNumber: "", plateNumber: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="driverForm">
          <div>
            <Field name="name" placeholder="Driver Name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field name="lorryNumber" placeholder="Lorry Number" />
            <ErrorMessage name="lorryNumber" component="div" className="error" />
          </div>
          <div>
            <Field name="plateNumber" placeholder="Plate Number" />
            <ErrorMessage name="plateNumber" component="div" className="error" />
          </div>
          <button type="submit">Add Driver</button>
        </Form>
      </Formik>

      <div className="driversGrid">
        {drivers.map((driver) => (
          <div key={driver.id} className="driverCard">
            <div className="driverHeader">
              <div className="driverAvatar"><Truck size={24} /></div>
              <div className="driverInfo">
                <h3>{driver.name}</h3>
                <p>{driver.lorry?.plateNumber}</p>
              </div>
            </div>
            <div className="driverBody">
              <span className={`badge ${getStatusClass(driver.lorry?.status || "IDLE")}`}>
                {driver.lorry?.status || "IDLE"}
              </span>
              <p className="driverPhone">{driver.phone}</p>
            </div>
            <div className="driverFooter">
              <button className="iconBtn"><Phone size={16} /></button>
              <button className="iconBtn"><Mail size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
