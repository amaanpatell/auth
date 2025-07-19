import { useEffect } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./page/HomePage";
import SignUpPage from "./page/SignUpPage";
import LoginPage from "./page/LoginPage";
import { Loader } from "lucide-react";
import { ThemeProvider } from "./components/theme-provider";
import ResetPasswordPage from "./page/ResetPasswordPage";
import { Toaster } from "sonner";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="/forgot-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
