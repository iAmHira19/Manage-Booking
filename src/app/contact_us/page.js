"use client";
import styles from "./contactus.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(
      /^[a-zA-Z\s']+$/,
      "Name can only contain letters, spaces, and apostrophes"
    )
    .min(2, "Name must be at least 2 characters long")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone number can only contain digits")
    .min(10, "Phone number must be at least 10 digits long")
    .required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

export default function Page() {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Message sent successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className={` bg-blue-900 lg:h-[50vh] h-[30vh]`}>
        <h1 className="text-3xl lg:text-6xl pt-10 lg:pt-20 pl-10 lg:pl-20 text-white font-gotham">
          Get in <span className="text-orange-500">Touch </span> <br />
          <h1 className="pt-2 lg:pt-6 font-gotham">With Our Team</h1>
        </h1>
      </div>
      <div className={`min-h-[60vh] bg-white py-10 px-[5%]`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <iframe
              className="w-full h-[400px] lg:h-[500px] rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.1004925261122!2d74.34839147540599!3d31.52139877421333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904f8ef4079db%3A0x205ef077d3d244!2sHumayun%20Farrukh%20Travels%20%26%20Tours%20PVT%20LTD!5e0!3m2!1sen!2s!4v1747387527706!5m2!1sen!2s"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div
            className={`order-1 lg:order-2 bg-[#f6f7fb] p-6 lg:p-8 rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-gotham font-light`}
          >
            <h2 className="mb-[10px] text-orange-500 text-xl lg:text-3xl uppercase font-gotham font-normal">
              Contact US
            </h2>
            <p className="text-sm font-gotham lg:text-base mb-[10px] lg:mb-[20px] text-[#333]">
              Talk to a Member of our Support Team
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="mb-[10px] lg:mb-[15px]">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      autoComplete="name"
                      className={`w-full p-[7px] lg:p-[16px] text-sm lg:text-base rounded-[3px] lg:rounded-[6px] border outline-none ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-[#ccc]"
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-xs mt-1 font-gotham"
                    />
                  </div>

                  <div className="mb-[10px] lg:mb-[15px]">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      autoComplete="email"
                      className={`w-full p-[7px] lg:p-[16px] text-sm lg:text-base rounded-[3px] lg:rounded-[6px] border outline-none ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-[#ccc]"
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-xs mt-1 font-gotham"
                    />
                  </div>

                  <div className="mb-[10px] lg:mb-[15px]">
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      className={`w-full p-[7px] lg:p-[16px] text-sm lg:text-base rounded-[3px] lg:rounded-[6px] border outline-none ${
                        errors.phone && touched.phone
                          ? "border-red-500"
                          : "border-[#ccc]"
                      }`}
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-xs mt-1 font-gotham"
                    />
                  </div>

                  <Field
                    as="textarea"
                    rows={2}
                    name="message"
                    placeholder="Write your message"
                    autoComplete="off"
                    className={`mb-[10px] lg:mb-[15px] p-[7px] lg:p-[16px] text-sm lg:text-base rounded-[3px] lg:rounded-[6px] border outline-none resize-y ${
                      errors.message && touched.message
                        ? "border-red-500"
                        : "border-[#ccc]"
                    }`}
                  />
                  <ErrorMessage
                    name="message"
                    component="p"
                    className="text-red-500 text-xs mt-1 font-gotham mb-[10px] lg:mb-[15px]"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-orange-500 text-white p-[8px] lg:p-[12px] border-none rounded-[3px] lg:rounded-[6px] text-sm lg:text-base cursor-pointer mt-[7px] lg:mt-[10px] font-gotham font-semibold transition-all duration-200 ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-600"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
