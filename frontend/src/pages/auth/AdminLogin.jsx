import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { sendOtp, verifyOtp } from "../../api/endpoints";
import { Lock, Phone, Shield } from "lucide-react";
import "./adminLogin.css";

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1 = phone, 2 = OTP
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validation schemas
  const phoneValidationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  });

  const otpValidationSchema = Yup.object({
    code: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
    name: Yup.string().required("Name is required"),
  });

  // Handlers
  const handleSendOtp = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError("");
      await sendOtp({ phone: values.phone });
      setPhone(values.phone);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError("");
      const response = await verifyOtp({
        phone: phone,
        code: values.code,
        name: values.name,
      });

      // Save token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Check if user is admin
      if (response.data.user.role === "ADMIN" || response.data.user.role === "STAFF") {
        navigate("/admin/orders");
      } else {
        setError("Access denied. Admin privileges required.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="loginHeader">
          <div className="loginIcon">
            <Shield size={32} />
          </div>
          <h1>Admin Login</h1>
          <p>Access the delivery management system</p>
        </div>

        {error && <div className="errorAlert"><p>{error}</p></div>}

        {step === 1 ? (
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={phoneValidationSchema}
            onSubmit={handleSendOtp}
          >
            {({ isSubmitting, values }) => (
              <Form className="loginForm">
                <div className="formGroup">
                  <label htmlFor="phone">
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="+1234567890"
                    className="formInput"
                    value={values.phone || ""} // ensures controlled input
                  />
                  <ErrorMessage name="phone" component="div" className="fieldError" />
                </div>

                <button
                  type="submit"
                  className="submitBtn"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ code: "", name: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting, values }) => (
              <Form className="loginForm">
                <div className="formGroup">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    className="formInput"
                    value={values.name || ""} // ensures controlled input
                  />
                  <ErrorMessage name="name" component="div" className="fieldError" />
                </div>

                <div className="formGroup">
                  <label htmlFor="code">
                    <Lock size={18} />
                    OTP Code
                  </label>
                  <Field
                    type="text"
                    name="code"
                    id="code"
                    placeholder="Enter 6-digit code"
                    className="formInput"
                    maxLength="6"
                    value={values.code || ""} // ensures controlled input
                  />
                  <ErrorMessage name="code" component="div" className="fieldError" />
                </div>

                <button
                  type="submit"
                  className="submitBtn"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  className="backBtn"
                  onClick={() => setStep(1)}
                >
                  Back to Phone
                </button>
              </Form>
            )}
          </Formik>
        )}

        <div className="loginFooter">
          <p>Sent to: {phone || "Enter your phone number"}</p>
          <p className="hint">Check WhatsApp for your OTP code</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
