import React from 'react';

interface LazyCarDetailProps {
  size: number;
}

const LazyCarDetailSkeleton: React.FC = () => (
    <>
     <div className="rounded-lg p-6 mb-6 max-w-6xl mx-auto animate-pulse max-[1000px]:hidden">

    <div className="flex gap-6 mb-8">
        
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative overflow-hidden rounded bg-gray-300 w-[80px] h-[60px]" />
        ))}
      </div>
      <div className="relative flex-1 bg-gray-300 rounded-lg overflow-hidden w-96">
        <div className="absolute top-3 left-3 w-[90px] h-6 rounded bg-gray-100" ></div>
      </div>
      <div className="w-[320px] flex flex-col gap-4">
        <div className="w-48 h-6 bg-gray-300 rounded" />
        <div className="w-36 h-4 bg-gray-300 rounded" />

        <div className='flex gap-4'>
             <div className="flex flex-col gap-3 mt-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
         <div className="flex flex-col gap-3 mt-3 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        </div>
       
        <div className="flex gap-4 mt-4">
          <div className="w-32 h-10 bg-gray-300 rounded" />
          <div className="w-32 h-10 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-10 bg-red-200 rounded-full mt-4" />
      </div>
    </div>
    
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="w-40 h-6 bg-gray-300 rounded" />
        <div className="w-24 h-6 bg-gray-300 rounded" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="w-32 h-4 bg-gray-300 rounded" />
            <div className="w-20 h-4 bg-gray-300 rounded" />
          </div>
          <div className="w-full h-12 bg-gray-300 rounded" />
        </div>
      ))}
      <div className="flex justify-center gap-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </div>
    </div>
  </div>
   <div className="rounded-lg p-6 mb-6 max-w-6xl mx-auto animate-pulse min-[1000px]:hidden">

    <div className="flex flex-col gap-5 mb-8">

        <div className='flex gap-6 mb-8'>
 <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative overflow-hidden rounded bg-gray-300 w-[80px] h-[60px]" />
        ))}
      </div>
      <div className="relative flex-1 bg-gray-300 rounded-lg overflow-hidden w-96">
        <div className="absolute top-3 left-3 w-[90px] h-6 rounded bg-gray-100" ></div>
      </div>

       
        </div>
        
     
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <div className="w-48 h-6 bg-gray-300 rounded" />
        <div className="w-36 h-4 bg-gray-300 rounded" />

        <div className='flex gap-10'>
             <div className="flex flex-col gap-3 mt-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
         <div className="flex flex-col gap-3 mt-3 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        </div>
       
        <div className="flex gap-4 mt-4">
          <div className="w-32 h-10 bg-gray-300 rounded" />
          <div className="w-32 h-10 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-12 bg-red-200 rounded mt-4" />
      </div>
    </div>
    
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="w-40 h-6 bg-gray-300 rounded" />
        <div className="w-24 h-6 bg-gray-300 rounded" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="w-32 h-4 bg-gray-300 rounded" />
            <div className="w-20 h-4 bg-gray-300 rounded" />
          </div>
          <div className="w-full h-12 bg-gray-300 rounded" />
        </div>
      ))}
      <div className="flex justify-center gap-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </div>
    </div>
  </div>
    </>
 
);

const LazyCarDetailLoader: React.FC<LazyCarDetailProps> = ({ size }) => {
  return (
    <>
      {Array.from({ length: size }, (_, index) => (
        <LazyCarDetailSkeleton key={index} />
      ))}
    </>
  );
};

export default LazyCarDetailLoader;