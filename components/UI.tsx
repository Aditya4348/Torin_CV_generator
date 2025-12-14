import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <input 
      className={`w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none ring-2 ring-transparent transition-all focus:border-gray-900 focus:ring-gray-900/5 ${className}`}
      {...props}
    />
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <textarea 
      className={`w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none ring-2 ring-transparent transition-all focus:border-gray-900 focus:ring-gray-900/5 min-h-[100px] resize-y ${className}`}
      {...props}
    />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 ${className}`}>
    {children}
  </div>
);
