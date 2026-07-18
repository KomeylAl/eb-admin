import React, { ReactNode } from "react";

interface ButtonProps {
  icon: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "dark"; // Button variant
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const IconButton = ({
  icon,
  size = "md",
  variant = "primary",
  onClick,
  disabled,
  className,
}: ButtonProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "p-3",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-blue-600 text-white shadow-theme-xs hover:bg-black disabled:bg-black/50",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-blue-600 hover:bg-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    dark: "",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-md transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default IconButton;
