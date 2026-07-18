"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface NotificationCardProps {
  id: number | string;
  title: string;
  message: string;
  duration?: number; // ms
  onClose: (id: number | string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(duration);
  const [isHovering, setIsHovering] = useState(false);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (startRef.current) {
      const elapsed = Date.now() - startRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      startRef.current = null;
    }
  };

  const startTimer = () => {
    // don't start if there's already a timer
    if (timerRef.current) return;
    startRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onClose(id);
    }, remainingRef.current);
  };

  useEffect(() => {
    // start on mount
    if (!isHovering) startTimer();
    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isHovering) {
      // pause
      clearTimer();
    } else {
      // resume
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="bg-white shadow-xl rounded-xl p-4 w-80 border border-gray-200 cursor-pointer
                 hover:shadow-2xl transition-all duration-200"
      role="article"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {title}
          </h4>
          <p className="text-gray-600 text-xs mt-1 line-clamp-3">{message}</p>
        </div>

        <button
          aria-label="close notification"
          onClick={() => onClose(id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};
