import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

// Zod Schema for changing password
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Zod Schema for requesting password reset
const resetEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export function PasswordManagement() {
  const { changeCurrentPassword, forgotPasswordReq } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  // Hide show state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form for changing current password
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Form for requesting forgotten password reset
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    reset: resetResetForm,
  } = useForm({
    resolver: zodResolver(resetEmailSchema),
  });

  const onSubmitChangePassword = async (data) => {
    const payload = {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    try {
      setIsLoading(true);
      await changeCurrentPassword(payload);
      console.log("Password changed successfully.");
      reset(); // Clear form fields
      setShowChangePassword(false); // Hide form
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForgotPassword = async (data) => {
    try {
      setIsLoading(true);
      await forgotPasswordReq(data);
      console.log("Sending reset link to:", data.email);
      resetResetForm(); // Clear form fields
      setShowResetPassword(false); // Hide form
    } catch (error) {
      console.error("Reset password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Password Management
        </CardTitle>
        <CardDescription>
          Manage your account password and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setShowChangePassword((prev) => !prev)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Change Current Password
            <span className="ml-auto text-xs text-muted-foreground">
              {showChangePassword ? "Hide" : "Show"}
            </span>
          </Button>

          {showChangePassword && (
            <div className="border rounded-lg p-4 space-y-6 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Update your current password to keep your account secure.
              </p>

              <form
                onSubmit={handleSubmit(onSubmitChangePassword)}
                className="space-y-4"
              >
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      {...register("currentPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 border rounded-md bg-background"
                      {...register("newPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowChangePassword((prev) => !prev)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          <Button
            variant={"outline"}
            className={"w-full justify-start bg-transparent"}
            onClick={() => setShowResetPassword((prev) => !prev)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Forgot Password / Reset
            <span className="ml-auto text-xs text-muted-foreground">
              {showResetPassword ? "Hide" : "Show"}
            </span>
          </Button>

          {showResetPassword && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Send a password reset link to your email address{" "}
              </p>
              <form
                className="space-y-4"
                onSubmit={handleSubmitReset(onSubmitForgotPassword)}
              >
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    {...registerReset("email")}
                  />
                  {resetErrors.email && (
                    <p className="text-sm text-red-500">
                      {resetErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowResetPassword((prev) => !prev)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
