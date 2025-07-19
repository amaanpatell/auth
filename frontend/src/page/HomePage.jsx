import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertCircle, Mail, User, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

import { PasswordManagement } from "../components/password-management";

const HomePage = () => {
  const { authUser, checkAuth, resendVerificationEmail, logout } =
    useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to check auth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const msg = await resendVerificationEmail();
      console.log(msg);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      console.log("You have been Logout successfully");
    } catch (error) {
      console.log("Logout Failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and security settings
          </p>
        </div>
        <ModeToggle />
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="w-5 h-5 text-muted-foreground" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${authUser?.username}&background=random`}
              />
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{authUser?.username}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{authUser?.email}</span>
                <Badge
                  className={
                    authUser?.isEmailVerified
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }
                >
                  {authUser?.isEmailVerified ? "Email Verified" : "Unverified"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Role: <span className="font-medium">{authUser?.role}</span>
              </p>
            </div>
          </div>

          {!authUser?.isEmailVerified && (
            <Alert className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 mt-1 text-red-500" />
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
                <span>
                  Your email address is not verified. Please check your inbox.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                >
                  Resend Verification
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/*  PasswordManagement  */}
      <PasswordManagement />

      <Separator />

      {/* Logout Section */}
      <Card>
        <CardHeader>
          <CardTitle className={"flex items-center gap-2 text-destructive"}>
            <LogOut className="h-5 w-5" />
            Logout
          </CardTitle>
          <CardDescription>
            Logout of your account on this device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"destructive"} onClick={handleLogout}>
            <LogOut className="h-4 w-4 " />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
