"use client";

import Navbar from "./Navbar";

export default function Sidebar() {
  return (
    <div className="hidden fixed right-0 top-0 w-80 h-screen bg-white dark:bg-gray-900 pt-8 px-8 border-l border-gray-300 dark:border-gray-700 lg:flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-right">کلینیک ابراز</h1>
      <div className="overflow-y-auto space-y-8 pb-8 no-scrollbar">
        <Navbar />
      </div>
    </div>
  );
}
