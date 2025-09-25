import * as Yup from "yup";

export const validationRegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  role: Yup.string().required("role is required"),
  recaptcha: Yup.string().required("Please verify that you are not a robot"),
});
