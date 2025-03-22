import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));


// import { create } from "zustand";
// import axios from "axios";

// // API URL based on the environment (development or production)
// const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/auth" : "/api/auth";

// // Enable credentials for cross-origin requests (cookies, etc.)
// axios.defaults.withCredentials = true;

// export const useAuthStore = create((set) => ({
//   user: null,
//   isAuthenticated: false,
//   error: null,
//   isLoading: false,
//   isCheckingAuth: true,
//   message: null,

//   // Sign up function
//   signup: async (email, password, name) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/signup`, { email, password, name });
//       if (response?.data?.user) {
//         set({ user: response.data.user, isAuthenticated: true, isLoading: false });
//       } else {
//         set({ error: "Signup failed, no user data", isLoading: false });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error signing up";
//       set({ error: errorMessage, isLoading: false });
//       throw error;
//     }
//   },

//   // Login function
//   login: async (email, password) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/login`, { email, password });
//       if (response?.data?.user) {
//         set({ isAuthenticated: true, user: response.data.user, error: null, isLoading: false });
//       } else {
//         set({ error: "Login failed, no user data", isLoading: false });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error logging in";
//       set({ error: errorMessage, isLoading: false });
//       throw error;
//     }
//   },

//   // Logout function
//   logout: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.post(`${API_URL}/logout`);
//       set({ user: null, isAuthenticated: false, error: null, isLoading: false });
//     } catch (error) {
//       set({ error: "Error logging out", isLoading: false });
//       throw error;
//     }
//   },

//   // Email verification function
//   verifyEmail: async (code) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/verify-email`, { code });
//       if (response?.data?.user) {
//         set({ user: response.data.user, isAuthenticated: true, isLoading: false });
//       } else {
//         set({ error: "Email verification failed", isLoading: false });
//       }
//       return response.data;
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error verifying email";
//       set({ error: errorMessage, isLoading: false });
//       throw error;
//     }
//   },

//   // Check authentication function
//   checkAuth: async () => {
//     set({ isCheckingAuth: true, error: null });
//     try {
//       const response = await axios.get(`${API_URL}/check-auth`);
//       if (response?.data?.user) {
//         set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
//       } else {
//         set({ isAuthenticated: false, isCheckingAuth: false });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error checking authentication";
//       set({
//         error: errorMessage,
//         isCheckingAuth: false,
//         isAuthenticated: false
//       });
//     }
//   },

//   // Forgot password function
//   forgotPassword: async (email) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/forgot-password`, { email });
//       if (response?.data?.message) {
//         set({ message: response.data.message, isLoading: false });
//       } else {
//         set({ error: "Failed to send reset password email", isLoading: false });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error sending reset password email";
//       set({ error: errorMessage, isLoading: false });
//       throw error;
//     }
//   },

//   // Reset password function
//   resetPassword: async (token, password) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
//       if (response?.data?.message) {
//         set({ message: response.data.message, isLoading: false });
//       } else {
//         set({ error: "Failed to reset password", isLoading: false });
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || error.message || "Error resetting password";
//       set({ error: errorMessage, isLoading: false });
//       throw error;
//     }
//   },
// }));
