// client/src/pages/AuthForm.jsx
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Joi from "joi";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SetPasswordModal from "../components/SetPasswordModal.jsx";
import { toast } from "react-toastify";
import { googleAuth } from "../api.js";

function AuthForm() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState("Sign up");
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = schema.validate(formData, { abortEarly: false });

    if (error) {
      const formattedErrors = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0]] = detail.message;
      });
      setErrors(formattedErrors);
    } else {
      setErrors({});
      setLoading(true);
      try {
        const url = formState === "Sign up" ? "/register" : "/login";
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth${url}`,
          formData,
          { withCredentials: true }
        );
        if (res.data.code === "PASSWORD_NOT_SET") {
          setShowModal(true);
        } else {
          toast.success(res.data.msg);
          navigate("/home");
        }
      } catch (err) {
        toast.error(err.response?.data?.msg || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "This field is required.",
        "string.email": "Please enter a valid email address.",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "This field is required.",
      "string.min": "Password must be at least 6 characters long.",
    }),
    name:
      formState === "Sign up"
        ? Joi.string().min(3).required().messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
          })
        : Joi.optional(),
  });

  const responseGoogle = async (authResult) => {
    if (authResult.code) {
      setLoading(true);
      try {
        const result = await googleAuth(authResult.code);
        toast.success("Google login successful!");
        navigate("/home");
      } catch (error) {
        toast.error("Google login failed");
        console.error("Google login error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: () => {
      toast.error("Google login cancelled");
    },
    flow: "auth-code",
  });

  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-2xl shadow-xl ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
            <div className="absolute inset-2 flex items-center justify-center text-2xl">
              🎓
            </div>
          </div>
          <p
            className={`text-center font-medium ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            {formState === "Sign up"
              ? "Creating your account..."
              : "Logging you in..."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${
          theme === "light"
            ? "bg-white border border-blue-100 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]"
            : "bg-gray-800 border border-gray-700 shadow-[0_20px_60px_-15px_rgba(30,64,175,0.3)]"
        }`}
      >
        {loading && <LoadingSpinner />}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span
              className={`text-3xl font-bold ${
                theme === "light" ? "text-blue-600" : "text-blue-400"
              }`}
            >
              EduConnect
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {formState === "Sign up" ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
            {formState === "Sign up"
              ? "Join EduConnect and enhance your academic experience"
              : "Sign in to your EduConnect account"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Google Button */}
          <div className="mb-6">
            <button
              onClick={googleLogin}
              type="button"
              disabled={loading}
              className={`w-full font-bold cursor-pointer shadow-sm rounded-xl py-4 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : theme === "light"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 border border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="bg-white p-1 rounded-full shadow-sm">
                <svg className="w-5" viewBox="0 0 533.5 544.3">
                  <path
                    d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                    fill="#4285f4"
                  />
                  <path
                    d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                    fill="#34a853"
                  />
                  <path
                    d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                    fill="#fbbc04"
                  />
                  <path
                    d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                    fill="#ea4335"
                  />
                </svg>
              </div>
              <span className="ml-3">
                {formState === "Sign up"
                  ? "Sign Up with Google"
                  : "Log in with Google"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  theme === "light" ? "border-blue-200" : "border-gray-600"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  theme === "light"
                    ? "bg-white text-gray-500"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {formState === "Sign up" && (
              <div>
                <input
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm focus:outline-none transition-all duration-300 ${
                    theme === "light"
                      ? "bg-blue-50 border border-blue-200 placeholder-gray-500 text-black focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                      : "bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:bg-gray-600 focus:ring-2 focus:ring-blue-900"
                  }`}
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <input
                className={`w-full px-4 py-3 rounded-xl font-medium text-sm focus:outline-none transition-all duration-300 ${
                  theme === "light"
                    ? "bg-blue-50 border border-blue-200 placeholder-gray-500 text-black focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:bg-gray-600 focus:ring-2 focus:ring-blue-900"
                }`}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                className={`w-full px-4 py-3 rounded-xl font-medium text-sm focus:outline-none transition-all duration-300 ${
                  theme === "light"
                    ? "bg-blue-50 border border-blue-200 placeholder-gray-500 text-black focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:bg-gray-600 focus:ring-2 focus:ring-blue-900"
                }`}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl active:scale-[0.98] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {formState === "Sign up" ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  Create Account
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.5 12H3" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Toggle Link */}
          <div className="text-center mt-6">
            <p
              className={theme === "light" ? "text-gray-600" : "text-gray-300"}
            >
              {formState === "Sign up" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormState("Log in");
                      setFormData({ ...formData, name: "" });
                      setErrors({});
                    }}
                    className={`font-medium hover:underline bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent`}
                    disabled={loading}
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormState("Sign up");
                      setErrors({});
                    }}
                    className={`font-medium hover:underline bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent`}
                    disabled={loading}
                  >
                    Create one here
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Terms */}
          <p
            className={`mt-6 text-xs text-center ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            By continuing, you agree to EduConnect's{" "}
            <a href="#" className="underline hover:no-underline text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:no-underline text-blue-500">
              Privacy Policy
            </a>
          </p>
        </form>

        <SetPasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          email={formData.email}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default AuthForm;
