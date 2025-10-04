// import React, { useEffect, useRef, useState } from 'react';
// import { Upload, FileText, X } from 'lucide-react';

// type FileUploadProps = {
//   onFileSelect: (file: File | null) => void;
//   variant?: 'file' | 'image';
//   disabled?: boolean;
//   className?: string; 
//   defaultFile?: File | null;
//   onRemove?: () => void;
// };

// const FileUpload: React.FC<FileUploadProps> = ({
//   onFileSelect,
//   variant = 'file',
//   disabled = false,
//   className = '',
//   defaultFile,
// }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(defaultFile ?? null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (defaultFile) {
//       setSelectedFile(defaultFile);
//       if (variant === 'image') {
//         const reader = new FileReader();
//         reader.onload = (e) => setPreviewUrl(e.target?.result as string);
//         reader.readAsDataURL(defaultFile);
//       }
//     }
//   }, [defaultFile, variant]);

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (disabled) return;
//     const file = e.dataTransfer.files?.[0];
//     handleFile(file);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file instanceof File) {
//       handleFile(file);
//     }
//   };

//   const handleFile = (file: File | null) => {
//     if (!file) return;
//     setSelectedFile(file);
//     onFileSelect(file);

//     if (variant === 'image') {
//       const reader = new FileReader();
//       reader.onload = (e) => setPreviewUrl(e.target?.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemove = () => {

//     setSelectedFile(null);
//     setPreviewUrl(null);
//     onFileSelect(null);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const formatSize = (size: number) => `${(size / 1024).toFixed(0)} KB`;

//   return (
//     <div className="relative">
//       {selectedFile ? (
//         variant === 'image' && previewUrl ? (
//           <div className="relative w-fit">
//             <img
//               src={previewUrl}
//               alt="preview"
//               className="w-24 h-24 rounded-full object-cover border"
//             />


//             {!disabled && (
//               <button
//                 onClick={handleRemove}
//                 className="absolute -top-2 -right-2  bg-transparent rounded-full p-1 shadow"
//               >
//                 <X className="w-4 h-4 text-gray-800" strokeWidth={3} />
//               </button>
//             )}
//           </div>
//         ) : (
//           <div
//             className={`flex items-center justify-between p-4  rounded-xl bg-transparent ${className}`}
//           >
//             <div className="flex items-center gap-3">
//               <FileText className="text-gray-600 w-5 h-5" />
//               <div className="flex flex-col">
//                 <p className="text-sm text-gray-900">{selectedFile.name}</p>
//                 <p className="text-xs text-gray-500">{formatSize(selectedFile.size)}</p>

//               </div>
//             </div>
//             {!disabled && (
//               <button onClick={handleRemove}>
//                 <X className="w-5 h-5 text-gray-600 hover:text-black" strokeWidth={3} />
//               </button>
//             )}
//           </div>
//         )
//       ) : (
//         <div
//           onClick={() => !disabled && fileInputRef.current?.click()}
//           onDrop={handleDrop}
//           onDragOver={(e) => e.preventDefault()}
//           className={`border border-gray-light rounded-xl bg-transparent ${
//             disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400 transition-all'
//           } flex flex-col items-center justify-center ${
//             variant === 'image' ? 'w-16 h-16 p-2' : 'p-6 text-center'
//           } ${className}`}
//         >
//           <Upload className="w-5 h-5 text-gray-600" />

//           {variant === 'file' && (
//             <p className="text-gray-700 text-sm mt-2 text-center">
//               {disabled ? 'Upload disabled' : (
//                 <>
//                   <span className="font-medium">Click to upload</span> or drag and drop
//                 </>
//               )}
//             </p>
//           )}
//         </div>
//       )}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept={variant === 'image' ? 'image/*' : undefined}
//         disabled={disabled}
//         className="hidden"
//         onChange={handleFileChange}
//       />
//     </div>
//   );
// };

// export default FileUpload;


import React, { useEffect, useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import DeleteDocsModal from './DeleteDocsModal'; // Ensure this path is correct

type FileUploadProps = {
  onFileSelect: (file: File | null) => void;
  variant?: 'file' | 'image';
  disabled?: boolean;
  className?: string;
  defaultFile?: File | null;
  onRemove?: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  variant = 'file',
  disabled = false,
  className = '',
  defaultFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(defaultFile ?? null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (defaultFile) {
      setSelectedFile(defaultFile);
      if (variant === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(defaultFile);
      }
    }
  }, [defaultFile, variant]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof File) {
      handleFile(file);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    onFileSelect(file);

    if (variant === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowDeleteModal(false);
  };

  const formatSize = (size: number) => `${(size / 1024).toFixed(0)} KB`;

  return (
    <div className="relative">
      {selectedFile ? (
        variant === 'image' && previewUrl ? (
          <div className="relative w-fit">
            <img
              src={previewUrl}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
            {!disabled && (
              <button
                onClick={handleRemoveClick}
                className="absolute -top-2 -right-2 bg-transparent rounded-full p-1 shadow"
              >
                <X className="w-4 h-4 text-gray-800" strokeWidth={3} />
              </button>
            )}
          </div>
        ) : (
          <div
            className={`flex items-center justify-between p-4 rounded-xl bg-transparent ${className}`}
          >
            <div className="flex items-center gap-3">
              <FileText className="text-gray-600 w-5 h-5" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatSize(selectedFile.size)}</p>
              </div>
            </div>
            {!disabled && (
              <button onClick={handleRemoveClick}>
                <X className="w-5 h-5 text-gray-600 hover:text-black" strokeWidth={3} />
              </button>
            )}
          </div>
        )
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border border-gray-light rounded-xl bg-transparent ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400 transition-all'
            } flex flex-col items-center justify-center ${variant === 'image' ? 'w-16 h-16 p-2' : 'p-6 text-center'
            } ${className}`}
        >
          <Upload className="w-5 h-5 text-gray-600" />
          {variant === 'file' && (
            <p className="text-gray-700 text-sm mt-2 text-center">
              {disabled ? 'Upload disabled' : (
                <>
                  <span className="font-medium">Click to upload</span> or drag and drop
                </>
              )}
            </p>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={variant === 'image' ? 'image/*' : undefined}
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      <DeleteDocsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmRemove}
      />
    </div>
  );
};

export default FileUpload;

