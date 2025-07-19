import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(25, "Password cannot exceed 25 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
      .max(25, "Confirm password cannot exceed 25 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({ className, ...props }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetForgottenPassword, isResettingPassword } = useAuthStore();

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [resetStatus, setResetStatus] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setResetStatus("error");
      setDisplayMessage("Invalid or missing token.");
      return;
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) return;

    setResetStatus("loading");
    setDisplayMessage("");

    try {
      await resetForgottenPassword(token, data.newPassword);
      setResetStatus("success");
      setDisplayMessage("Password reset successfully. You can now log in.");
      reset();
      setTimeout(() => navigate("/login"), 9000);
    } catch (error) {
      setResetStatus("error");
      setDisplayMessage(
        error.response.data.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="container mx-auto py-5 px-4  space-y-8">
      <Card className={"w-full max-w-md mx-auto"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className={`input input-bordered w-full ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`input input-bordered w-full ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className={`w-full ${isResettingPassword ? "loading" : ""}`}
            >
              Reset Password
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>

            {displayMessage && (
              <p
                className={`text-sm ${
                  resetStatus === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {displayMessage}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordForm;
