
import React from 'react';

interface InputGroupProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, icon, children }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        {icon && <i className={`fa-solid ${icon}`}></i>}
        {label}
      </label>
      {children}
    </div>
  );
};
