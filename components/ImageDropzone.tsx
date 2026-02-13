
import React, { useState, useRef } from 'react';

interface ImageDropzoneProps {
  onUpload: (dataUrl: string) => void;
  currentImage?: string;
  label: string;
  icon: string;
  className?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUpload, currentImage, label, icon, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        className="hidden"
      />
      
      <div className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition-all ${
        isDragging 
          ? 'border-amber-500 bg-amber-50/50 scale-[1.02]' 
          : currentImage 
            ? 'border-slate-200 bg-white' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
      }`}>
        {currentImage ? (
          <div className="relative w-full h-full">
            <img src={currentImage} alt={label} className="w-full h-full object-contain rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</span>
            </div>
          </div>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              isDragging ? 'bg-amber-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
            }`}>
              <i className={`fa-solid ${icon} ${isDragging ? 'text-xl' : 'text-lg'}`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
              {isDragging ? 'Drop Image Here' : label}
            </p>
            <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Drag & Drop or Click</p>
          </>
        )}
      </div>
    </div>
  );
};
