import React from "react";

const ClientCard = ({ client }: { client: any }) => {
  return (
    <div
      className="
      fixed mt-3 w-96 bg-white/60 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-800 backdrop-blur-md p-4 shadow-lg rounded-lg z-1000
      opacity-0 scale-95 pointer-events-none
      transition-all duration-300 ease-out
      peer-hover:opacity-100 peer-hover:scale-100 peer-hover:pointer-events-auto
      text-black dark:text-white space-y-5
    "
    >
      <p className="text-lg font-semibold">اطلاعات مراجع</p>
      <div className="space-y-3">
        <p>
          نام و نام خانوادگی:{" "}
          <span className="text-violet-500">{client?.name ?? ""}</span>
        </p>
        <p>
          شماره تلفن:{" "}
          <span className="text-violet-500">{client?.phone ?? ""}</span>
        </p>
      </div>
    </div>
  );
};

export default ClientCard;
