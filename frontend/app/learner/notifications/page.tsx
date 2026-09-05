"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, Mic2, CheckCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

const notificationsData = [
  {
    id: 1,
    type: "quiz",
    title: "New Quiz Available",
    message:
      "Prof. Smith has scheduled a Mathematics quiz for tomorrow at 10:00 AM",
    timestamp: "2 hours ago",
    icon: "quiz",
    unread: true,
  },
  {
    id: 2,
    type: "material",
    title: "New Material Uploaded",
    message: "Prof. Johnson has uploaded Physics notes for Chapter 6",
    timestamp: "5 hours ago",
    icon: "material",
    unread: true,
  },
  {
    id: 3,
    type: "oral",
    title: "Oral Exam Scheduled",
    message:
      "Your English oral practice session is scheduled for tomorrow at 2:00 PM",
    timestamp: "1 day ago",
    icon: "oral",
    unread: true,
  },
  {
    id: 4,
    type: "result",
    title: "Quiz Results Available",
    message:
      "Your results for the Mathematics quiz are now available. Score: 92%",
    timestamp: "3 days ago",
    icon: "result",
    unread: false,
  },
  {
    id: 5,
    type: "material",
    title: "New Material Uploaded",
    message: "Prof. Brown has uploaded English Literature study guide",
    timestamp: "5 days ago",
    icon: "material",
    unread: false,
  },
  {
    id: 6,
    type: "certificate",
    title: "Certificate Earned",
    message:
      "Congratulations! You have earned a certificate in Advanced Python",
    timestamp: "1 week ago",
    icon: "result",
    unread: false,
  },
];

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  icon: string;
  unread: boolean;
}

export default function NotificationsPage() {
  // const [notifications, setNotifications] = useState<Notification[]>(notificationsData)

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const handleMarkAsRead = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "quiz":
        return <Bell className="w-5 h-5 text-blue-600" />;
      case "material":
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case "oral":
        return <Mic2 className="w-5 h-5 text-purple-600" />;
      case "result":
        return <CheckCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`p-6 border transition-all duration-300 hover:shadow-md ${
                !notification.read
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getIconComponent(notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read  && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!notification.read  && (
                    <Button
                      onClick={() => handleMarkAsRead(notification._id)}
                      size="sm"
                      variant="ghost"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(notification._id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 border border-border text-center">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </Card>
      )}
    </div>
  );
}
