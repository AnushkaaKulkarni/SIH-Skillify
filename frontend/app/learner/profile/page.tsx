"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function LearnerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile"); // IMPORTANT
      setFormData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await API.put("/auth/profile", formData); // IMPORTANT
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!formData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
  {/* Header */}
  <div className="space-y-2">
    <h1 className="text-3xl font-semibold text-gray-900">
      Profile
    </h1>
    <p className="text-gray-600 text-sm">
      Manage your profile information
    </p>
  </div>

  <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
    <div className="p-8 space-y-8">
      
      {/* Top Section - Official Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-6">
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-white">
              {formData.fullName?.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Student Info */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                OFFICIAL ID
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formData.officialId || formData.studentId || "N/A"}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">Active</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Button */}
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 h-10 rounded-lg shadow-sm text-sm font-medium transition-colors duration-200"
          >
            Edit Information
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            {!isEditing ? (
              <p className="text-gray-900 font-semibold text-base py-1">
                {formData.fullName}
              </p>
            ) : (
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            {!isEditing ? (
              <p className="text-gray-900 font-semibold text-base py-1">
                {formData.email}
              </p>
            ) : (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            {!isEditing ? (
              <p className="text-gray-900 font-semibold text-base py-1">
                {formData.phone}
              </p>
            ) : (
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Professional Profile */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Designation
            </Label>
            {!isEditing ? (
              <p className="text-gray-900 font-semibold text-base py-1">
                {formData.designation || "Not specified"}
              </p>
            ) : (
              <Input
                type="text"
                value={formData.designation || ""}
                onChange={(e) => handleChange("designation", e.target.value)}
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>
        </div>

        {/* Edit Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 h-10 rounded-lg shadow-sm text-sm font-medium transition-colors duration-200"
            >
              Save Changes
            </Button>

            <Button
              onClick={handleCancel}
              variant="outline"
              className="h-10 rounded-lg px-5 text-sm font-medium border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  </Card>
</div>

  );
}
