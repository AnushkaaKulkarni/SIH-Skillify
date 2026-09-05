"use client";

import React from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { FaceRegistrationModal } from "./face-registration-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/lib/auth";
import { useSubscription, SubscriptionPlanType } from "@/contexts/SubscriptionContext";

export function StudentRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentPlan } = useSubscription();
  const [step, setStep] = useState<"form" | "face">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await registerUser({
        fullName,
        email,
        phone,
        password,
        role: "learner",
        educationLevel,
      });

      // ✅ VERY IMPORTANT
      localStorage.setItem("token", data.token);

      // move to face verification
      setStep("face");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleFaceVerified = () => {
    setFaceVerified(true);
    router.push("/learner/dashboard");
  };

  if (step === "face") {
    return <FaceRegistrationModal onVerified={handleFaceVerified} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-bold text-2xl"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-foreground">SkillifyAI</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Create Learner Account
          </h1>
          <p className="text-muted-foreground">
            Build your official competency profile with SkillifyAI
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-primary">
              Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="p-8 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 border-border bg-background"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 border-border bg-background"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-10 border-border bg-background"
              />
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <Label
                htmlFor="education"
                className="text-sm font-medium text-foreground"
              >
                Education Level
              </Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger className="h-10 border-border bg-background">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highschool">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 border-border bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="text-xs text-red-500">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 border-border bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 mt-6"
              disabled={
                !fullName ||
                !email ||
                !phone ||
                !educationLevel ||
                password.length < 6 ||
                password !== confirmPassword
              }
            >
              Continue to Face Verification
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
