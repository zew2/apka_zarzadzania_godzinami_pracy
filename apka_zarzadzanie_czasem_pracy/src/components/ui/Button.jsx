import React from 'react';

// Uniwersalny przycisk, z którego będą korzystać wszyscy inni programiści
export default function Button({ children, onClick, variant = 'primary', type = 'button' }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors flex justify-center items-center gap-2";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border-2 border-slate-200 hover:bg-slate-50 text-slate-700"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </button>
  );
}