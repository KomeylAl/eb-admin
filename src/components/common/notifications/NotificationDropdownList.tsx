"use client";

import { useGetNotifications } from "@/hooks/useNotifications";
import React from "react";

const NotificationDropdownList = () => {
  const { data, isLoading, error, refetch } = useGetNotifications(1, 5);
  return (
    <div className="w-full space-y-2 p-3">
      {data &&
        data.data.map((item: any) => (
          <div
            key={item.id}
            className="w-full border border-gray-100 rounded-md flex items-center justify-between p-2"
          >
            <p>{item.title}</p>
            <p>{item.prioriry}</p>
          </div>
        ))}
    </div>
  );
};

export default NotificationDropdownList;
