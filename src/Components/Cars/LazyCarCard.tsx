interface LazyCardCardProps {
  size: number; // Adjust the type of 'size' as needed
}

const getStatusBoxStyle = (status: string): string => {
  switch (status) {
    case "AVAILABLE":
      return "bg-[#FFFFFF] text-[#000000]";
    case "Reserved":
      return "bg-[#FFFFFF] text-[#0B6A16]";
    case "Service started":
      return "bg-[#FFFFFF] text-[#1279C2]";
    case "Canceled":
      return "bg-[#FFFFFF] text-[#E22D0D]";
    case "Service provided":
      return "bg-[#FFFFFF] text-[#000000]";
    case "Booking finished":
      return "bg-[#FFFFFF] text-[#E09811]";
    default:
      return "bg-[#FFFFFF] text-[#000000]";
  }
};

const CarCardLazy: React.FC = () => (
  <div className="bg-[#F0F0F0] rounded-xl shadow p-3 w-full max-w-xs mb-5">
    <div className="relative">
      <div className="relative overflow-hidden rounded bg-gray-200 w-full h-44 ">
        <div className="absolute inset-0 shimmer"></div>
      </div>
      <span
        className={`absolute top-0.5 left-0.5 text-xs px-3 py-1 rounded-[5px] font-medium shadow  blur-[1px] ${getStatusBoxStyle(
          'AVAILABLE'
        )}`}
      >
      </span>
    </div>
    <div className="mt-4">
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="relative overflow-hidden rounded bg-gray-200 w-[13rem] h-4 my-2">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="relative overflow-hidden rounded bg-gray-200 w-[10rem] h-3 my-2">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <div className="relative overflow-hidden rounded bg-gray-200 w-[1rem] h-3 my-2">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <svg
            className="w-4 h-4 text-yellow-400 ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.19 3.674c.3.921-.755 1.688-1.538 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.783.57-1.838-.197-1.538-1.118l1.19-3.674a1 1 0 00-.364-1.118L2.32 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.19-3.674z" />
          </svg>
        </div>
      </div>
      <div className="relative overflow-hidden rounded bg-gray-200 w-full h-10 my-2">
        <div className="absolute inset-0 shimmer"></div>
      </div>
      <div className="relative flex justify-centeroverflow-hidden rounded bg-gray-200 w-2/4 h-3 my-2">
        <div className="absolute inset-0 shimmer"></div>
      </div>
    </div>
  </div>
);

const LazyCarCard: React.FC<LazyCardCardProps> = ({ size }) => {
  return (
    <>
      {Array.from({ length: size }, (_, index) => (
        <CarCardLazy
          key={index}
        />
      ))}
    </>)
}

export default LazyCarCard