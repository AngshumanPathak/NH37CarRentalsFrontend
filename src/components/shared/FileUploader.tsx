import { useCallback, useState, useEffect } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { convertFileToUrl } from '@//lib/utils';
import { Button } from '../ui/button';
import { getMediaTypeFromUrl } from '@//lib/mediaUtils';
import FileUpload from '../../assets/icons/FileUpload.svg'




const MAX_TOTAL_FILES = 1;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const FileUploaderMarket = ({ fieldChange, docUrl }: { fieldChange: (files: File[]) => void; docUrl: string[] }) => {
  const [fileData, setFileData] = useState<{
    files: File[];
    fileUrls: string[];
    mediaTypes: string[];
  }>({
    files: [],
    fileUrls: docUrl,
    mediaTypes: [],
  });
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      setError('');
      if (!acceptedFiles || acceptedFiles.length === 0) return;
  
      const newFiles = [...fileData.files, ...acceptedFiles].slice(0, MAX_TOTAL_FILES);
  
      if (newFiles.length > MAX_TOTAL_FILES) {
        setError(`Maximum of ${MAX_TOTAL_FILES} files allowed.`);
        return;
      }
  
      const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length !== newFiles.length) {
        setError(`Some files are too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      }
  
      // Update the form field with the valid files
      fieldChange(validFiles); // This is key for the form submission
  
      setFileData({
        files: validFiles,
        fileUrls: validFiles.map(file => convertFileToUrl(file)),
        mediaTypes: validFiles.map(file => {
          const type = file.type;
          if (type.startsWith('image/')) return 'image';
          return 'unknown';
        }),
      });
    },
    [fileData.files, fieldChange]
  );
  
  

  useEffect(() => {
    if (docUrl && docUrl.length > 0) {
      Promise.all(docUrl.map(url => getMediaTypeFromUrl(url)))
        .then((types) => {
          // Update the `fileData` state with both `fileUrls` and `mediaTypes`
          setFileData((prevData) => ({
            ...prevData,
            fileUrls: docUrl,        // Set the URLs directly from docUrl
            mediaTypes: types,       // Set the media types based on the URLs
          }));
        });
    }
  }, [docUrl]);  // This effect runs when docUrl changes
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      
    },
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 50MB.');
      } else {
        setError(rejection.errors[0]?.message || 'Invalid file type');
      }
    },
  });

  const renderPreviews = () => {
    return fileData.fileUrls.length > 0 ? (
      fileData.fileUrls.map((url, index) => (
        <div key={index} className="relative w-40 h-40 border rounded-lg overflow-hidden">
          {fileData.mediaTypes[index] === 'image' && (
            <img
              src={url}
              alt={`preview-${index}`}
              className="object-cover w-full h-full"
            />
          )}
          
    <button
      type="button"
      onClick={(e) => {
      e.stopPropagation(); // Prevent triggering file browser
      removeFile(index);
      }}
      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none"
>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-red">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
       </svg>
    </button>


        </div>
      ))
    ) : (
      <div className="w-full text-center p-5">
        <p>No files selected</p>
      </div>
    );
  };

  const removeFile = (index: number) => {
    setFileData((prevData) => {
      const updatedFiles = prevData.files.filter((_, i) => i !== index);
      const updatedUrls = prevData.fileUrls.filter((_, i) => i !== index);
      const updatedTypes = prevData.mediaTypes.filter((_, i) => i !== index);

      fieldChange(updatedFiles); 

      return { files: updatedFiles, fileUrls: updatedUrls, mediaTypes: updatedTypes };
    });
  };

  return (
    <div
    {...getRootProps()}
    className="flex flex-col items-center justify-center bg-neutral-900 rounded-xl p-6 cursor-pointer border border-dashed border-neutral-700 hover:border-neutral-500 transition-all"
  >
    <input {...getInputProps()} className="cursor-pointer" />
    
    {fileData.fileUrls.length > 0 ? (
      <>
        <div className="flex flex-wrap justify-center w-full p-5 lg:p-10 gap-4">
          {renderPreviews()}
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <p className="text-gray-400 text-sm">Click or drag media to replace</p>
      </>
    ) : (
      <div className="flex flex-col items-center">
        <img
          src={FileUpload}
          className="w-16 h-16 mb-4"
          alt="file upload"
        />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Drag media here</h3>
        <p className="text-gray-500 text-sm mb-4">Images, Audio, Videos (max: 150 MB)</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button 
          type="button" 
          className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
        >
          Select from files
        </Button>
      </div>
    )}
  </div>
  
  );
};

export { FileUploaderMarket };
