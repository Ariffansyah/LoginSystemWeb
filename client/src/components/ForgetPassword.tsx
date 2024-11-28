import { Formik, Form, Field } from "formik";
import getFetch from "../controllers/getFetch"
import resetPassword from "../controllers/resetPassword"
import { useState, useEffect } from "react"
import { Interface } from "../controllers/interface"

export default function ForgetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const storedCooldown = JSON.parse(localStorage.getItem("cooldownState") || "null");
    if (storedCooldown) {
      const { isCooldown, remainingTime, startTime } = storedCooldown;
      if (isCooldown) {
        const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
        const updatedRemainingTime = Math.max(remainingTime - elapsedTime, 0);

        if (updatedRemainingTime > 0) {
          setIsCooldown(true);
          setRemainingTime(updatedRemainingTime);
        } else {
          setIsCooldown(false);
          setRemainingTime(0);
        }
      } else {
        setIsCooldown(false);
        setRemainingTime(0);
      }
    }
  }, []);

  useEffect(() => {
    if (isCooldown && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsCooldown(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCooldown, remainingTime]);

  useEffect(() => {
    if (isCooldown) {
      const startTime = new Date().getTime();
      localStorage.setItem(
        "cooldownState",
        JSON.stringify({ isCooldown, remainingTime, startTime })
      );
    } else {
      localStorage.removeItem("cooldownState");
    }
  }, [isCooldown, remainingTime]);

  const handleSubmit = async (values: { email: string }) => {
    const { email } = values;
    try {
      setError(null);
      setSuccess(null);
      const existingUsers = await getFetch();
      const userEmail = existingUsers.some((user: { email: string }) => user.email === email);

      if (!userEmail) {
        setError("Email does not exist.");
        return;
      }

      if (isCooldown) return;

      setIsCooldown(true);
      setRemainingTime(60);
      const startTime = new Date().getTime();
      localStorage.setItem(
        "cooldownState",
        JSON.stringify({ isCooldown: true, remainingTime: 5, startTime })
      );

      setSuccess("Email sent. Please check your inbox. If you do not see the email, please check your spam folder. If you still do not see the email, please try again in a few minutes.");
      await resetPassword({ email } as Interface);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex flex-col bgmain">
      <section className="w-full h-screen container mx-auto px-3 flex items-center justify-center">
        <div className="bg-white p-10 rounded-md drop-shadow-md">
          <h1 className="text-2xl mb-5 font-bold text-black">Reset Password</h1>
          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange }) => (
              <Form className="flex flex-col">
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
                <div>
                  {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                  {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
                  {isCooldown && <p className="text-red-500 text-sm mb-3">Please wait {remainingTime} seconds before trying again.</p>}
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
