import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice"; // Redux action
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { useState } from "react";

const LoginPage = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(4, "password must be 4")
      .required("Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    // const storedUserString = localStorage.getItem("registeredUser");
    //   const storedUser = JSON.parse(storedUserString);
    try {
      console.log("data:", values);

      //data save in redux
      // dispatch(
      //   login({
          // email: values.email,
        //   username: storedUser.username,
        //   role: storedUser.role,

        // })
      // );

      //navigate dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("login failed: ", error);
      alert("kik gadbad che");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
              />

              <div className="mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
