import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "../utils/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: true, // Start with true to show loader on initial load
  isResettingPassword: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/users/current-user");
      set({ authUser: res.data.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/users/register", data);
      // Automatically log in the user after successful registration
      const loginRes = await axiosInstance.post("/users/login", {
        email: data.email,
        password: data.password,
      });
      set({ authUser: loginRes.data.data });

      toast.success(res.data.message || "Signup successful! Welcome.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during sign-up.";
      toast.error(errorMessage);
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Logged in successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ authUser: null });
      toast.success("Logged out successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during logout.";
      toast.error(errorMessage);
    }
  },

  resendVerificationEmail: async () => {
    try {
      await axiosInstance.post("/users/resend-email-verification");
      toast.success("Verification email sent successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error resending verification email.";
      toast.error(errorMessage);
    }
  },

  changeCurrentPassword: async (data) => {
    try {
      await axiosInstance.post("/users/change-password", data);
      toast.success("Your password was changed successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error changing password.";
      toast.error(errorMessage);
    }
  },

  forgotPasswordReq: async (data) => {
    try {
      await axiosInstance.post("/users/forgot-password", data);
      toast.success(
        "If an account exists for this email, a reset link has been sent."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error requesting password reset.";
      toast.error(errorMessage);
    }
  },

  resetForgottenPassword: async (token, newPassword) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post(`/users/reset-password/${token}`, {
        newPassword,
      });
      set({ authUser: null });
      toast.success("Password reset successfully. Please log in.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error resetting password. The link may be invalid or expired.";
      toast.error(errorMessage);
      throw error; 
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
