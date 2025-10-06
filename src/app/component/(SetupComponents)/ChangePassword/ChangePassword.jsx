import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
const ChangePassword = () => {
  return (
    <div className="w-full">
      <div className="title bg-blue-900 w-full py-4 px-6">
        <h3 className="text-orange-500 font-gotham font-semibold text-lg">
          Change Password
        </h3>
      </div>
      <div className="form bg-white py-2 px-6 border">
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            retypePassword: "",
          }}
          validationSchema={Yup.object({
            currentPassword: Yup.string().required(
              "Current password is required"
            ),
            newPassword: Yup.string()
              .min(8, "Password must be at least 8 characters")
              .required("New password is required"),
            retypePassword: Yup.string()
              .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
              .required("Retype password is required"),
          })}
          // onSubmit={(values) => console.log(values)}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleSubmit,
            handleChange,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 py-8 items-start"
            >
              <div className="formFields grid grid-cols-3 gap-x-5 w-full pb-3">
                <div className="flex flex-col currentPass gap-y-1">
                  <label htmlFor="currentPass">Current Password*</label>
                  <input
                    type="password"
                    className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                    placeholder="Enter current password"
                    id="currentPass"
                    name="currentPassword"
                    onChange={handleChange}
                    value={values.currentPassword}
                  />
                  {touched.currentPassword && errors.currentPassword && (
                    <div className="text-sm text-red-500">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>
                <div className="flex flex-col newPass gap-y-1">
                  <label htmlFor="newPass">New Password*</label>
                  <input
                    type="password"
                    className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                    placeholder="Enter new password"
                    id="newPass"
                    name="newPassword"
                    onChange={handleChange}
                    value={values.newPassword}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <div className="text-sm text-red-500">
                      {errors.newPassword}
                    </div>
                  )}
                </div>
                <div className="flex flex-col retypePass gap-y-1">
                  <label htmlFor="retypePass">Check new Password*</label>
                  <input
                    type="password"
                    className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                    placeholder="Type new password again"
                    id="retypePass"
                    name="retypePassword"
                    onChange={handleChange}
                    value={values.retypePassword}
                  />
                  {touched.retypePassword && errors.retypePassword && (
                    <div className="text-sm text-red-500">
                      {errors.retypePassword}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border px-4 py-2 bg-orange-500 cursor-pointer text-white font-gotham rounded-sm"
              >
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
