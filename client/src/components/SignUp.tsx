import { Formik, Field, Form } from "formik";
import getFetch from "../controllers/getFetch";
import postFetch from "../controllers/postFetch";
import { useState } from "react";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const speicalChars = /[-!@#$%^&*(),.?":{}|<>~`_+=[\]\\;'/]/;;

  const handleSubmit = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    const { username, email, password, confirmPassword } = values;

    try {
      setError(null);
      setSuccess(null);
      const existingDB = await getFetch();
      const userExists = existingDB.some((user: { username: string }) => user.username === username);
      const emailExists = existingDB.some((user: { email: string }) => user.email === email);

      if (email.length > 200) {
        setError("Email must be less than 100 characters.");
        return;
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }

      if (username.includes(" ")) {
        setError("Username cannot contain spaces.");
        return;
      }

      if (speicalChars.test(username)) {
        setError("Username cannot contain special characters.");
        return;
      }

      if (username.length > 50) {
        setError("Username must be less than 50 characters.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (password.includes(" ")) {
        setError("Password cannot contain spaces.");
        return;
      }

      if (password.length > 200) {
        setError("Password must be less than 200 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (userExists) {
        setError("User already registered.");
        return;
      } else if (emailExists) {
        setError("Email already registered.");
        return;
      } else {
        await postFetch({ username, email, password });
        setSuccess("Successfully signed up!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
    }
  };

  if (success) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000)
  }

  return (
    <main className="flex flex-col bgmain">
      <section className="w-full h-screen container mx-auto px-3 flex items-center justify-center">
        <div className="bg-white p-10 rounded-md drop-shadow-md">
          <h1 className="text-2xl mb-5 font-bold text-black">Sign Up</h1>
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
                  <label htmlFor="email" className="text-md font-semibold text-black">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="border border-gray-400 rounded-md p-2"
                    value={values.email}
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
                <div className="flex flex-col mb-4">
                  <label htmlFor="confirmPassword" className="text-md font-semibold text-black">Confirm Password</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="border border-gray-400 rounded-md p-2"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>
                    Already have an account? <a href="/login" className="text-blue-500">Log in</a>
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
    </main>
  );
}
