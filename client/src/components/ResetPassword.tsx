import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { newPassword: string; }) => {
    const { newPassword } = values;

    try {
      setError(null);
      if (newPassword.length < 8) {
        setError("Password must be at least 8 character")
        return;
      }

      if (newPassword.includes(" ")) {
        setError("Password cannot contain spaces.")
        return
      }

      if (newPassword.length > 200) {
        setError("Password must be less than 200 character")
        return;
      }
      const localurl = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "localhost")
      const response = await fetch(localurl + '/reset-password-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      alert(data.message);

    } catch (error) {
      console.log("Error during form submission:", error)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <main className="flex flex-col bgmain">
      <section className="w-full h-screen container mx-auto px-3 flex items-center justify-center">
        <div className="bg-white p-10 rounded-md drop-shadow-md">
          <h1 className="text-2xl mb-5 font-bold text-black">Reset Password</h1>
          <Formik
            initialValues={{
              newPassword: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange }) => (
              <Form className="flex flex-col">
                <div className="flex flex-col mb-4">
                  <label htmlFor="newPassword" className="text-md font-semibold text-black">New Password</label>
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="border border-gray-400 rounded-md p-2"
                    value={values.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  {error && <p className="text-red-500">{error}</p>}
                </div>
                <button type="submit" className="bg-black text-white rounded-md p-2 font-semibold">Submit</button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </main >
  )
}
