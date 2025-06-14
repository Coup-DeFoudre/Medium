import { type ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { type SignupType, signinInput, signupInput } from "@iamrishabhpathak/medium-common";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupType>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate inputs using zod schema
      if (type === "signup") {
        signupInput.parse(formData);
      } else {
        signinInput.parse(formData);
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type}`,
        formData
      );
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);

      setTimeout(() => {
          toast.success(type=="signup"?"Signed up successfully!":"Logged in Successfully")
      }, 1000);
    
      navigate("/blogs");
    } catch (error: any) {
      toast.error(type=="signin"?"Invalid Credentials":"Please provide valid inputs");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {type === "signup" ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {type === "signup" ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {type === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          >
            {type === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
