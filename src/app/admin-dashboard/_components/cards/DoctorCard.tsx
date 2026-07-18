import React from "react";

const DoctorCard = ({ doctor }: { doctor: any }) => {
  return (
    <div
      className="
      fixed mt-3 w-96 bg-white/60 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-800 backdrop-blur-md p-4 shadow-lg rounded-lg z-[1000]
      opacity-0 scale-95 pointer-events-none
      transition-all duration-300 ease-out
      peer-hover:opacity-100 peer-hover:scale-100 peer-hover:pointer-events-auto
      text-black dark:text-white space-y-5
    "
    >
      <p className="text-lg font-semibold">اطلاعات متخصص</p>
      <div className="space-y-3">
        <p>
          نام و نام خانوادگی:{" "}
          <span className="text-cyan-500">{doctor.name}</span>
        </p>
        <p>
          شماره تلفن: <span className="text-cyan-500">{doctor.phone}</span>
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;
