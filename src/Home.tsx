import React, { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import Layout from "./dashboard/layout/Layout";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "./utils/cookieUtils";

interface FormData {
  email: string;
  password: string;
  username: string;
}

interface AuthResponse {
  token: string;
  username?: string;
  message?: string;
  user: {
    email: string;
    username: string;
  };
}

interface WalletAuthProps {
  onAuthenticated: (value: boolean) => void;
}

// Add cookie utility functions

const WalletAuth: React.FC<WalletAuthProps> = ({ onAuthenticated }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
  });
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const endpoint = isLogin ? "/login" : "/register";
    const url = `/api/v1/auth${endpoint}`;
    console.log("Sending request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Accept header to explicitly request JSON
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // First, get the raw response text
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // If we have an empty response
    if (!responseText) {
      // Check if it's a successful status but empty response
      if (response.ok) {
        // Some deployments might return 200 OK with no content for successful auth
        // In this case, we'll create a default successful response
        const defaultResponse: AuthResponse = {
          token:
            response.headers.get("authorization") ||
            response.headers.get("x-auth-token") ||
            "default-token",
          user: {
            email: formData.email,
            username: formData.username || "",
          },
        };

        // Store token in cookie (expires in 7 days)
        setCookie("auth_token", defaultResponse.token, 7);
        setCookie("user_data", JSON.stringify(defaultResponse.user), 7);

        onAuthenticated(true);
        navigate("/dashboard");
        return;
      } else {
        throw new Error(
          `Server returned ${response.status} with no response body`
        );
      }
    }

    // Try to parse the response as JSON
    try {
      const data: AuthResponse = JSON.parse(responseText);

      // Store token in cookie (expires in 7 days)
      setCookie("auth_token", data.token, 7);

      // Store user data in cookie if needed
      if (data.user) {
        setCookie(
          "user_data",
          JSON.stringify({
            email: data.user.email,
            username: data.user.username,
          }),
          7
        );
      }

      onAuthenticated(true);
      navigate("/dashboard");
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  } catch (err) {
    console.error("Authentication error:", err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement; // Type assertion
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
                    placeholder="mufrobiba"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Sign up"}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeApp: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check authentication status on mount
    const token = getCookie("auth_token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <WalletAuth onAuthenticated={setIsAuthenticated} />;
  }

  return <Layout />;
};

export default HomeApp;
