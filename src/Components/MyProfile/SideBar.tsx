import React from "react";

interface SidebarProps {
  selected: string;
  onSelect?: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  const items = ["Personal info", "Documents","Reviews", "Change password"];

  return (
    <div className="w-44 text-sm flex flex-col gap-5 top-0 max-[800px]:-top-4 self-start max-[800px]:w-full max-[800px]:z-30">
      <h1 className="text-4xl font-bold mb-8 max-[800px]:mb-4 max-[560px]:text-2xl">
        My profile
      </h1>
      <ul
        className="min-[800px]:space-y-5 text-sm max-[800px]:flex max-[800px]:gap-10 max-[800px]:justify-center max-[800px]:items-center 
        max-[800px]:bg-[#FFFBEA] max-[800px]:h-14 max-[800px]:shadow-sm 
        max-[515px]:gap-6 max-[470px]:gap-4 max-[470px]:overflow-x-auto max-[470px]:whitespace-nowrap 
        [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[5px] 
        [&::-webkit-scrollbar-track]:bg-[#F0F0F0] 
        [&::-webkit-scrollbar-thumb]:bg-[#CBCBCB] [&::-webkit-scrollbar-thumb]:rounded-full 
        max-[450px]:justify-start"
      >
        {items.map((item) => (
          <li
            key={item}
            className={`cursor-pointer ${
              selected === item
                ? "text-[#E6B800] font-medium" // active: darker yellow
                : "text-[#555555]" // inactive: medium gray
            }`}
            onClick={() => onSelect?.(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
