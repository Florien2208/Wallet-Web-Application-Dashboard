// src/hooks/useNotifications.ts

import { useState, useCallback } from "react";
import { Notification } from "@/types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "timestamp">) => {
      const newNotification = {
        ...notification,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [...prev, newNotification]);

      // Automatically remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
