import { Field, ErrorMessage } from "formik";

const InputField = ({ label, name, type = "text", placeholder, as }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Field
        as={as} //  textarea and select mate
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-xs text-red-500"
      />
    </div>
  );
};

export default InputField;
