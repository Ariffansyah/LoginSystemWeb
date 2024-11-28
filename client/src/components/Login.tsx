import { Formik, Form, Field } from "formik"
import getFetch from "../controllers/getFetch"
import AuthToken from "../controllers/AuthToken"
import { useState } from "react"
import bcrypt from "bcryptjs"

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: { username: string; password: string; }) => {
    const { username, password } = values;

    try {
      setError(null);
      setSuccess(null);
      const existingUsers = await getFetch();
      const userExists = existingUsers.some((user: { username: string }) => user.username === username);
      const userPassword = existingUsers.some((user: { password: string }) => bcrypt.compare(password, user.password));

      if (!userExists) {
        setError("User does not exist.");
        return;
      }

      if (!userPassword) {
        setError("Incorrect password.");
        return;
      }

      await AuthToken({ username });
      const data = await AuthToken({ username });
      localStorage.setItem("tokenauth", data.tokenauth);
      setSuccess("Successfully logged in! Redirecting to dashboard...");

    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
    }
  };

  if (success) {
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000)
  }

  return (
    <main className="flex flex-col bgmain">
      <section className="w-full h-screen container mx-auto px-3 flex items-center justify-center">
        <div className="bg-white p-10 rounded-md drop-shadow-md">
          <h1 className="text-2xl mb-5 font-bold text-black">Log In</h1>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange }) => (
              <Form className="flex flex-col">
                <div className="flex flex-col mb-4">
                  <label htmlFor="username" className="text-md font-semibold text-black">Username</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="border border-gray-400 rounded-md p-2"
                    value={values.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="password" className="text-md font-semibold text-black">Password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="border border-gray-400 rounded-md p-2"
                    value={values.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>
                    Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                  </p>
                  <p>
                    <a href="/forget-password" className="text-blue-500">Forget Password?</a>
                  </p>
                  <div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                  </div>
                </div>
                <button type="submit" className="bgmain text-white rounded-md p-2 mt-4">Sign Up</button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </main >
  )
}
