import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "", 
    address: "", 
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(3).required("Username is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().min(4).required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: Yup.string().required("Role is required"),
    address: Yup.string().required("Address is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    // Error Handling: Try-Catch-Finally Block
    try {
      console.log("data", values);
      localStorage.setItem("registeredUser", JSON.stringify(values));
      // Redux ma data save karavo 
      // Ahia aapne khali username ane role j jaruri che dashboard mate
      dispatch(login({ 
        username: values.username, 
        role: values.role, 
        email: values.email 
      }));

      // Success to login
      navigate("/login");

    } catch (error) {
      console.error("Registration Failed:", error);
      alert("Something went wrong!");
    } finally {
      // Aa block hamesha run thase (loading band karva)
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Registration Form
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField label="Username" name="username" placeholder="JohnDoe" />
              <InputField label="Email" name="email" type="email" placeholder="john@example.com" />
          
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <Field as="select" name="role" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Role</option>
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Backend">Backend Developer</option>
                  <option value="FullStack">Fullstack Developer</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <InputField label="Address" name="address" as="textarea" placeholder="Your Address" />
              <InputField label="Password" name="password" type="password" placeholder="••••••••" />
              <InputField label="Confirm Password" name="confirm_password" type="password" placeholder="••••••••" />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Registration;